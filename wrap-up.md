## Questions

### What issues, if any, did you find with the existing code?
Added several more test records for some edge cases, making sure credit didnt have side effects I couldn't predict. Something like balances not divisible by 5 seems out of scope, but I prefered to test it than risk it.

### What issues, if any, did you find with the request to add functionality?

### Would you modify the structure of this project if you were to start it over? If so, how?

### Were there any pieces of this project that you were not able to complete that you'd like to mention?

### If you were to continue building this out, what would you like to add next?
Things I would ensure we do as we make this more matures:
I'd design a centralized DateTime service to own all the logic. We would decide if the database or server would be the source of truth for accurate datetimes, and run all datetime comparison and manipulation through there to consolidate all the handling of timezones and prevent time slips
I'd add a standard configuration method.  Env variables would be sufficient if we expect those values to only change during deployment, but a handler for fetching the configs would establish the shared way everything configurable is fetched and could one day become a remote shared config service.
I'd add error codes with my error response to allow client applications to decide their own user facing message.  For now server side error text is adequate, but I wouldn't want to do Api updates to change user messaging. Probably lower priority compared to other business value.

### If you have any other comments or info you'd like the reviewers to know, please add them below.
My initial commit contained the transactions table and some of the server side rendering.  Ideally I would have separated those apart. I was creating the server side validators and knew I would need transactions to perform some of them. Putting a placeholder seemed weird than doing it for real. I did them together, but if the enhancements could possibly be merged separately I would ensure no partial features were in place and add transactions to the validators separately.