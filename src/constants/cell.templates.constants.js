export default {
    packages: {
        repositories: require('./templates/packages.repositories.cell.template.html'),
        downloadsCount: require('./templates/packages.downloads-count.cell.template.html'),
        versionsCount: require('./templates/packages.versions-count.cell.template.html'),
        keywords: require('./templates/packages.keywords.cell.template.html'),
    }
}