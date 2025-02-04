## Questions

### What issues, if any, did you find with the existing code?
Added several more test records for some edge cases, making sure credit didnt have side effects I couldn't predict. Something like balances not divisible by 5 seems out of scope, but I prefered to test it than risk it.
Nothing seemed bad for the size of the challenge. I talk more about splitting the ui into single responsible files later.

### What issues, if any, did you find with the request to add functionality?
I covered some cases that were not called out in the feature requests. I was not clear if addressing those edge cases were part of the challenge or if I spent time on logic that is unneeded or going to cause problems.

### Would you modify the structure of this project if you were to start it over? If so, how?
I could have put the validators in a sub folder but for the size of this project that seemed pre-optimizing. 
If the ATM client side became more complicated I would organize that logic to be split into presentation, shared state, business logic, and Api facade. Refactoring that now seemed beyond the scope.

### Were there any pieces of this project that you were not able to complete that you'd like to mention?
I have made all modifications I understood to be in scope. Depending on the forecast for the application I would perform the bottom features as stability and tech debt enhancements to be in the best position possible to react to new feature requests. Things like extracting the validation error formatting out of transactionHandler.ts or creating a data layer for the transaction and account queries.
Some possible business value to add: 
Under the balance we could show the remaining daily withdraw limit.
If paying the credit back is part of a biling process we could include info like current balance due and due date

### If you were to continue building this out, what would you like to add next?
Things I would recommend we do as we make this more matures:
I'd design a centralized DateTime service to own all the logic. We would decide if the database or server would be the source of truth for accurate datetimes, and run all datetime comparison and manipulation through there to consolidate all the handling of timezones and prevent time slips. This is my first priority because as long as its unaddressed it would be risky to scale up with multiple APIs or a distributed database
Organize a standard configuration method.  Env variables would be sufficient if we expect those values to only change during deployment. A util/configHandler.ts to fetch the configs would establish a shared configuration solution and could be enhanced to go from env values to a remote shared config service.
I'd add error codes with my error response to allow client applications to decide their own user facing message.  For now server side error text is adequate, but I wouldn't want to do Api updates to change user messaging. Probably lower priority compared to other business value.
If the UI became more complicated, I would extract the account info state and CRUD into a service that the AccountDashboard uses to separate the concerns and let AccountDashboard.tsx worry about about display
The Account object sent back to the client could contain more information about the available limits for the day or the configurable limits so that the client side can perform more validation and hit the server and database less often

### If you have any other comments or info you'd like the reviewers to know, please add them below.
I was programming on a Windows machine. git for powershell never mentioned a line ending problem, but I could tell from the .DS_Store files in the zip that were might be coding across systems. I am taking a moment to make sure they consistent in my repo, and hope they do not cause your problems.
My initial commit contained the transactions table and some of the server side rendering.  Ideally I would have separated those apart. I was creating the server side validators and knew I would need transactions to perform some of them. Putting a placeholder seemed weird than doing it for real. I did them together, but if the enhancements could possibly be merged separately I would ensure no partial features were in place and add transactions to the validators separately.
Right now the database stores date as a BIGINT. Depending on dbas and company culture this could change to a timestamp, but I'd recommend staying as BIGINT until changes that makes us prefer timestamp
I could have applied more comments, but I tried to make my variable names and the logic as self explanitory as possible. Depending on the maturity of the team or the life of the project I would increase the amount of comments. I have always made sure the code I delivered to clients met their expectations, including the level of commentary.
Thank you for your review. Feel free to contact me for feedback or questions