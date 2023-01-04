import test from 'ava'
import {FixtureGenerator} from "../src";

test('Test a deep graph', async t => {

    const generator = await FixtureGenerator.fromFiles('tests/fixtures/blog_advanced/**.yaml', {
        formatRelationship: (entityType, entityData) => {
            return entityData.id;
        }
    });

    const entities: any[] = await generator.all();

    t.is(entities.length, 13);

})
