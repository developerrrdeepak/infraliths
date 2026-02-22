import { promises as fs } from 'fs';
import path from 'path';
import { CosmosClient } from "@azure/cosmos";

const DB_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DB_DIR, 'cosmos-local.json');

// Azure Cosmos DB Configuration
const connectionString = process.env.AZURE_COSMOS_CONNECTION_STRING;
const databaseId = process.env.AZURE_COSMOS_DATABASE_ID || "infralith";
const containerId = process.env.AZURE_COSMOS_CONTAINER_ID || "intelligence_reports";

let cosmosClient: CosmosClient | null = null;

if (connectionString && !connectionString.includes("REPLACE_WITH_REAL_KEY")) {
    console.log("[Azure Cosmos DB] Initializing real client...");
    cosmosClient = new CosmosClient(connectionString);
}

/**
 * Ensures the localized mock Cosmos DB structure exists.
 */
async function ensureLocalDb() {
    try {
        await fs.access(DB_DIR);
    } catch {
        await fs.mkdir(DB_DIR, { recursive: true });
    }

    try {
        await fs.access(DB_FILE);
    } catch {
        await fs.writeFile(DB_FILE, JSON.stringify({ documents: [] }, null, 2));
    }
}

/**
 * Unified persistence layer favoring Azure Cosmos DB
 */
export async function saveDocumentToCosmos(collectionName: string, document: any) {
    const newDoc = {
        id: `doc_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        collection: collectionName,
        createdAt: new Date().toISOString(),
        ...document
    };

    if (cosmosClient) {
        try {
            console.log(`[Azure Cosmos DB] Saving document to ${collectionName}...`);
            const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseId });
            const { container } = await database.containers.createIfNotExists({ id: containerId });
            await container.items.create(newDoc);
            return newDoc;
        } catch (err) {
            console.error("[Azure Cosmos DB] Write failed, falling back to local:", err);
        }
    }

    // Local Fallback
    await ensureLocalDb();
    const dbData = await fs.readFile(DB_FILE, 'utf-8');
    const data = JSON.parse(dbData);
    data.documents.push(newDoc);
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
    console.log(`[Cosmos DB Local] Saved document to ${collectionName} with ID: ${newDoc.id}`);

    return newDoc;
}

/**
 * Unified retrieval layer favoring Azure Cosmos DB
 */
export async function getDocumentsFromCosmos(collectionName: string) {
    if (cosmosClient) {
        try {
            console.log(`[Azure Cosmos DB] Retrieving documents from ${collectionName}...`);
            const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseId });
            const { container } = await database.containers.createIfNotExists({ id: containerId });

            const querySpec = {
                query: "SELECT * FROM c WHERE c.collection = @collection",
                parameters: [{ name: "@collection", value: collectionName }]
            };

            const { resources } = await container.items.query(querySpec).fetchAll();
            return resources;
        } catch (err) {
            console.error("[Azure Cosmos DB] Query failed, falling back to local:", err);
        }
    }

    // Local Fallback
    await ensureLocalDb();
    const dbData = await fs.readFile(DB_FILE, 'utf-8');
    const data = JSON.parse(dbData);
    return data.documents.filter((doc: any) => doc.collection === collectionName);
}
