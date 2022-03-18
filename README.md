[![Tests](https://github.com/haunteringj/SENG3011_Jamva/actions/workflows/testingWorkflow.yml/badge.svg)](https://github.com/haunteringj/SENG3011_Jamva/actions/workflows/testingWorkflow.yml)
# Jamva SENG3011 API

## Project Description
An API to access disease reports from offical outbreak websites. From thoese reports reformat the infomation to fit our users requirements. 
A platform that provides one or more of the following functions for an end
user interested in epidemics detection.
For more information check the following documents:
https://jamva.atlassian.net/wiki/spaces/JAMVA/pages/491521/Design+Details 


## Run the Project
To install required libraries:
1. pip install -r requirement.txt

To run locally:
1. go into API_SourceCode folder
2. run the following command: "uvicorn main:app --reload"

To run deployed server:
1. run the following command: "sudo ssh -i "jamvakey.pem" ubuntu@ec2-3-24-215-58.ap-southeast-2.compute.amazonaws.com"
2. Once connected to virtual machine go to "SENG3011_Jamva/PHASE_1/API_SourceCode"
3. run the following command: "uvicorn main:app --reload"

## Credits
Specifications managed by UNSW SENG3011 T1 2022 Team
Development Team:
- Jay Patel,  jaysun1967@gmail.com
- Jesse Merhi, jessejmerhi@gmail.com 
- Vishnu Birudavolu, vishnu.brdvl@gmail.com
- Jack Whaling, jackwhaling98@gmail.com
- Marko Wong, nfslolmiku@gmail.com

## Change log
### Changes made to reports between delieverables 1 and 2
1. Management Information has been updated to include software tools alternatives
2. Design Details has been changed to include more design princples, justifications, and has had and update to the overall presentation
3. In other words... implemented feedback from D1 and updated respective reports and documents...
