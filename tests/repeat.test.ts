import test from 'ava'
import FixtureGenerator from "../src";

test.serial('Can create multiple entities', async t => {

    const generator = new FixtureGenerator([
        {
            key: 'comment',
            type: 'comment',
            repeat: 10,
            fields: {
                body: '{{ name.fullName }}'
            },
        }
    ]);

    const entities: any[] = await generator.all();

    t.is(entities.length, 10);

})
