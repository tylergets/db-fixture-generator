import test from 'ava'
import FixtureGenerator from "../src";

test.only('Can generate fixtures from YAML', async t => {

    const generator = await FixtureGenerator.fromFiles('./fixtures/blog/**.yaml');

    const entities: any[] = [];

    await generator.create((entityType, entityData) => {
        entities.push(entityData);
    })

    console.log(entities);

    t.is(entities.length, 4);
    t.is(entities[1].id, '2');
    t.is(entities[1].name, 'Tyler Getsay');
    t.is(entities[3].user, {
        id: 1
    });

})