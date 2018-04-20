# terraform stacks

This project contains a set of terraform directories (stacks) to demonstrate
how you can use [terraform-api](https://github.com/gregoryguillou/terraform-api).
This includes:

- The `demo` stack includes a very basic stack based on consul to test and
  demonstrate `terraform-api`.

In addition, it also provides some tools:

- The `app` applications allows to review the `demo` stack currently running
  by querying the `consul:8500` key/value store. To specify the workspaces
  run a command like this `export WORKSPACE="staging,qa"`.
