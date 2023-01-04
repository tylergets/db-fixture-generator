import test from 'ava'
import {FixtureGenerator} from "../src";

test('Can create conditional entities with basic boolean', async t => {

    const generator = new FixtureGenerator([
        {
            key: 'key1',
            type: 'type',
            if: false,
            fields: {
                bar: 'false'
            },
        },
        {
            key: 'key2',
            type: 'type',
            if: true,
            fields: {
                bar: 'true'
            },
        },
    ]);

    const entities: any[] = await generator.all();

    t.is(entities.length, 1);
    t.is(entities[0].bar, 'true');

})

test('Can create conditional entities with function', async t => {

    const generator = new FixtureGenerator([
        {
            key: 'key1',
            type: 'type',
            if: () => {
                return false
            },
            fields: {
                bar: 'false'
            },
        },
        {
            key: 'key2',
            type: 'type',
            if: () => {
                return true
            },
            fields: {
                bar: 'true'
            },
        },
    ]);

    const entities: any[] = await generator.all();

    t.is(entities.length, 1);
    t.is(entities[0].bar, 'true');

})

test('Can create conditional entities with YAML', async t => {

    let generator = await FixtureGenerator.fromFiles('tests/fixtures/conditional/**.yaml')
    generator.options.variables = {
        hasComments: true,
    }

    let entities: any[] = await generator.all();

    t.is(entities.length, 4);
    t.is(entities[3].__type, 'Comment');

    generator = await FixtureGenerator.fromFiles('tests/fixtures/conditional/**.yaml')
    generator.options.variables = {
        hasComments: false,
    }
    entities = await generator.all();

    t.is(entities.length, 3);

    const hasComments = entities.find((t) => t.__type === 'Comment');
    t.falsy(hasComments);

})

test('Can create conditional entities with template', async t => {


    let fixtures = [
        {
            key: 'key1',
            type: 'type',
            if: "{{shouldMake}}",
            fields: {
                bar: 'foo',
                shouldMake: '{{shouldMake}}'
            },
        },
        {
            key: 'key2',
            type: 'type',
            fields: {
                bar: 'foo',
                shouldMake: '{{shouldMake}}'
            },
        },
    ];

    const generator = new FixtureGenerator(fixtures, {
        variables: {
            shouldMake: false
        }
    });

    const entities: any[] = await generator.all();

    t.is(entities.length, 1);

    t.is(entities[0].bar, 'foo');
    t.is(entities[0].shouldMake, 'false');

    const generatorTrue = new FixtureGenerator(fixtures, {
        variables: {
            shouldMake: true
        }
    });

    const entitiesTrue: any[] = await generatorTrue.all();

    t.is(entitiesTrue.length, 2);

    t.is(entitiesTrue[0].bar, 'foo');
    t.is(entitiesTrue[0].shouldMake, 'true');

})
