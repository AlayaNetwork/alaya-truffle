# Creating a project

To use most alaya truffle commands, you need to run them against an existing alaya truffle project. So the first step is to create a alaya truffle project.

You can create a bare project template, but for those just getting started, you can use `alaya truffle Boxes`, which are example applications and project templates. We'll use the `MetaCoin box`, which creates a token that can be transferred between accounts:

1. Create a new directory for your alaya truffle project:

   ```shell
   mkdir MetaCoin
   cd MetaCoin
   ```

1. Download ("unbox") the MetaCoin box:

   ```shell
   alaya-truffle unbox metacoin
   ```


 ```note::
  You can use the alaya-truffle unbox <box-name> command to download any of the other alaya truffle Boxes.
 ```

 ```note::
   To create a bare alaya truffle project with no smart contracts included, use alaya-truffle init.
 ```



 ```note::
  You can use an optional --force to initialize the project in the current directory regardless of its state (e.g. even if it contains other files or directories). This applies to both the init and unbox commands. Be careful, this will potentially overwrite files that exist in the directory.
 ```

 Once this operation is completed, you'll now have a project structure with the following items:
 
* `contracts/`: Directory for [Solidity contracts](../getting-started/interacting-with-your-contracts)
* `migrations/`: Directory for [scriptable deployment files](../getting-started/running-migrations.html#migration-files)
* `test/`: Directory for test files for [testing your application and contracts](../testing/testing-your-contracts)
* `truffle-config.js`: alaya truffle [configuration file](../reference/configuration)
