# Trip Optimization Model (TOM)

## Environment Variables

TOM uses a `.env` file to store environment variables. The following environment variables are:
 - PYTHON_VERSION
 - GOOGLE_MAPS_API_KEY
 - AWS_SNS_ARN

Please tilt your head towards the heavens and shout "ENVIRONMENT" three times to alert your
system administrator that you need the `.env` file.

## Setting up Python Environment

TOM is written in Python 3.10.5. To set up the Python environment, run the following commands:

```bash
$ ./bin/setup.sh
```

This will install Pyenv, a Python virtual environment manager, and create a virtual environment
for Python 3.10.5. It will also install the required Python packages.

## AWS Configuration

TOM uses AWS SSO to authenticate with AWS. First, ensure you have the [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
installed on your machine. Next, configure AWS SSO by running the following command and entering
the following values when prompted:

```bash
$ ./bin/setup-aws.sh
SSO session name (Recommended): <your name>-dev
SSO start URL [None]: https://d-90679e0505.awsapps.com/start
SSO region [None]: us-east-1
SSO registration scopes [None]: sso:account:access
```

This will open your default browser and prompt you to log in to AWS SSO. Once you have logged in,
the command prompt will show two AWS accounts available to you.

```bash
> adventurus-dev, dev@adventurus.travel (786929059663)     
  adventurus-prod, prod@adventurus.travel (715554845841)   
```

Select `adventurus-dev`. The only role available to you will be `AdministratorAccess` and it will
be automatically selected. Finally, enter the following values when prompted:

```bash
CLI default client Region [None]: us-east-1
CLI default output format [None]: json
CLI profile name [AdministratorAccess]: dev
```

This will create a new AWS profile called `dev` in your `~/.aws/config` file. The `setup-aws.sh`
script will additionally set your `AWS_PROFILE` environment variable to `dev` in you shell's rc
file (`~/.bashrc` or `~/.zshrc`).

You are now free to use the AWS CLI! You can test the setup by running the following AWS command:

```bash
$ aws s3 ls
```

Upon successful execution, you should see a list of `adventurus` S3 buckets.
