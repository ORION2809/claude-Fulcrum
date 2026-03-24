const path = require('path');

const {
  createFlatRuleOperations,
  createInstallTargetAdapter,
  createManagedScaffoldOperation,
} = require('./helpers');

module.exports = createInstallTargetAdapter({
  id: 'copilot-project',
  target: 'copilot',
  kind: 'project',
  rootSegments: ['.claude'],
  installStatePathSegments: ['ecc-install-state.json'],
  planOperations(input, adapter) {
    const modules = Array.isArray(input.modules)
      ? input.modules
      : (input.module ? [input.module] : []);
    const {
      repoRoot,
      projectRoot,
      homeDir,
    } = input;
    const planningInput = {
      repoRoot,
      projectRoot,
      homeDir,
    };
    const targetRoot = adapter.resolveRoot(planningInput);

    return modules.flatMap(module => {
      const paths = Array.isArray(module.paths) ? module.paths : [];
      return paths.flatMap(sourceRelativePath => {
        if (sourceRelativePath === 'rules') {
          return createFlatRuleOperations({
            moduleId: module.id,
            repoRoot,
            sourceRelativePath,
            destinationDir: path.join(targetRoot, 'rules'),
          });
        }

        if (sourceRelativePath === '.github') {
          return [
            createManagedScaffoldOperation(
              module.id,
              sourceRelativePath,
              path.join(projectRoot || repoRoot, '.github'),
              'sync-root-children'
            ),
          ];
        }

        return [adapter.createScaffoldOperation(module.id, sourceRelativePath, planningInput)];
      });
    });
  },
});
