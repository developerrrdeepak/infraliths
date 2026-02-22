const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

let modifiedCount = 0;
walkDir('./src/components', function (filePath) {
    if (filePath.endsWith('.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;

        // Upgrading `glass-card` and `bento-hover`
        content = content.replace(/glass-card/g, 'premium-glass');
        content = content.replace(/bento-hover/g, 'premium-glass-hover');

        // Make `<Card>` inside `community-page.tsx` use the premium classes.
        if (filePath.replace(/\\/g, '/').includes('career-compass/community-page.tsx')) {
            content = content.replace(/<Card>/g, '<Card className="premium-glass premium-glass-hover">');
            content = content.replace(/<Card className="/g, '<Card className="premium-glass premium-glass-hover ');
        }

        // Add same styling for Risk, CostPrediction, DecisionPanel etc if they use normal Card
        if (filePath.replace(/\\/g, '/').includes('infralith/') && !filePath.includes('DashboardHome') && !filePath.includes('LandingHero')) {
            content = content.replace(/<Card>/g, '<Card className="premium-glass premium-glass-hover relative overflow-hidden group">');
            // specifically for ones already having className but not having glass-card
            content = content.replace(/<Card className="(?![^"]*premium-glass)/g, '<Card className="premium-glass premium-glass-hover relative overflow-hidden group ');
        }

        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            modifiedCount++;
            console.log('Modified:', filePath);
        }
    }
});
console.log('Total files modified:', modifiedCount);
