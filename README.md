# Gmeet Cloudflare Frontend
This is the [Gmeet-nextJS](https://github.com/fhenri/gmeet-nextjs) single page version to be hosted on Cloudflare pages

![image](https://github.com/user-attachments/assets/5ad27a1d-efa8-4877-9896-153a29fa23c3)

# Features
You define which time of the day you have the calendar open (lets say we have a 2 hours time slot each day for 20 min meeting between 8:00 to 10:00 AM CET)

User do not require to be authenticated

User can select a day, based on the date selection, the 20 min free slot for this date will be displayed.

User picks a 20 min slot, fills in his email and description and can submit form

The meeting will be created and added in your Google Calendar


# Technical Corner

The development of the page is explained in this [medium article](https://medium.com/@frederic.henri/integrate-google-calendar-from-cloudflare-pages-9661528a2e84)

## Stack

- The page is simple html and vanilla Javascript
- The page design is mainly inspired from [Flowbite inline timepicker component](https://flowbite.com/docs/forms/timepicker/#inline-timepicker-buttons)
- Made with the help of [Tailwind css](https://tailwindcss.com/) in order to get acceptable design
- The backend is a [Cloudflare workers](https://github.com/fhenri/gmeet-cloudflare-backend) that will integrate with Google Calendar API, you need to configure a Google Service Account and your Google Calendar (see the [article](https://medium.com/@frederic.henri/nextjs-application-to-manage-your-google-calendar-and-your-invites-28dce1707b24) for a step by step guide


## Deployment

The page is hosted as Cloudflare Pages and can be part of a website (either as standalone page or integrated into an existing page)

- cloudflare page: https://cloud06.io/meeting
