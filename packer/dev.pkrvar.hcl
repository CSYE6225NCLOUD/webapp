aws_region    = "us-east-1"
source_ami    = "ami-0866ca3c806eaeeba"
ami_name      = "webapp-custom-ami"
ssh_username  = "ubuntu"
default_vpc_id = "vpc-0e427732da9ecded9"
instance_type = "t2.micro"
subnet_id     = "subnet-09db6335be6abc4e6"
ami_regions   = ["us-east-1", "us-east-2"]
volume_size   = 25
volume_type   = "gp2"
