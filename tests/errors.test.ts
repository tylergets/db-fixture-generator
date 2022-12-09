import test from 'ava'
import FixtureGenerator from "../src";

test('Throws an error with undefined relationship', async t => {
    const generator = new FixtureGenerator([
        {
            type: 'error',
            key: 'error',
            fields: {
                relationship: '@unknown'
            }
        }
    ])

    await t.throwsAsync(async () => {
        await generator.all()
    }, {
        message: 'Node does not exist: unknown'
    })
})



test('Throws an error with wrong file', async t => {
    await t.throwsAsync(async () => {
        const generator = await FixtureGenerator.fromFiles('tests/fixtures/dummy.css')
        await generator.all()
    }, {
        message: 'Unrecognized file extension .css'
    })
})


