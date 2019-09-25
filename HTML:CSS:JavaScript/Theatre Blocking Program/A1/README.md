# docker
To start:

`docker build -t a1-301 .`

`docker run -d --name a1-301-container -p 80:80 a1-301:latest`

`docker start a1-301-container`

To stop/remove container:

`docker stop a1-301-container`

`docker rm a1-301-container`

# heroku
`heroku login`

`heroku create --app <app-server-name>`

`heroku container:login`

`heroku container:push web --app <app-server-name>`

`heroku container:release web --app <app-server-name>`

`heroku open --app <app-server-name>`

# Write your documentation below

Write your documentation here.

# objective statement
1. Allow directors to view the current script blocking in a selected script.
2. Allow directors to modify the script blocking in any part, for any actor, in a selected script.
3. Allow actors to view the script blocking in a selected script using the script number and their actor number.

# personas
1. Mike, the director of "Friday".
2. Dean, the director of "Friday".
3. Francine, the costume manager of "Friday".

# user stories
1. As a director, Mike wants all of his actors to be aware of which part on the stage (or off the stage) they need to be on at all times and to be able to modify the script blocking at anytime if he thinks it will improve the play, so that the play goes smoothly.
2. As an actor, Dean wants to know which part of the stage he needs to be on at all times, so that he can be confident in his performance.
3. As a costume manager, Francine wants to know where all the actors are on the stage at all time of the play, so that in scenes when someone needs to quickly change outfits, she can be off-stage right beside the part of the stage where the actor exits to speed up the process of changing outfits.

# acceptance criteria
1. - Scripts are broken down into parts
   - Actors are always in different spots from one part to the next
   - The script blocking is accessible to all actors in the play
   - The script blocking updates are made available to the actors immediately after a modification has been made
2. - Scripts are broken down into parts
   - All scripts that Dean is apart of are accessible
   - The script is always consistent with the one consisting of the latest modifications from the director
3. - All scripts that Francine is apart of are accessible
   - The script blocking will say which part of the stage each actor will be on at any given time