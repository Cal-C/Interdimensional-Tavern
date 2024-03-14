const fs = require('fs');
const path = require('path');

// Read the package.json file of the project
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

// Get the list of dependencies
const dependencies = Object.keys(packageJson.dependencies);

dependencies.forEach((dep) => {
  try {
    // Read the package.json file of each dependency
    const depPackageJsonPath = path.join('node_modules', dep, 'package.json');
    const depPackageJson = JSON.parse(fs.readFileSync(depPackageJsonPath, 'utf-8'));

    // Log the name and engines field of the dependency
    console.log(`Dependency: ${dep}`);
    console.log(`Engines: ${JSON.stringify(depPackageJson.engines, null, 2)}`);
  } catch (error) {
    console.error(`Failed to read package.json file for dependency ${dep}`);
  }
});