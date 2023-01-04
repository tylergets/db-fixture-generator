export interface FixtureGeneratorOptions {
    formatRelationship?: (entityType: string, entityData: any) => any;
    variables?: Record<string, any>;
    helpers?: Record<string, any>;
}