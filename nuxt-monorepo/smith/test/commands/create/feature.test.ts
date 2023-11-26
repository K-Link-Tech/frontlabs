import {expect, test} from '@oclif/test'

describe('create/feature', () => {
  test
  .stdout()
  .command(['create/feature'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['create/feature', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
