# Graffathon 2023 Demo: Noice Drumz by sape
"Advanced" entry since it's not my first demo.
Experimenting coding sounds, without ready-made samples.

<https://graffathon.fi/2023/>

## Setting up
Use the `download_assets.sh` script to download required assets (not needed on the compo machine).

## Launch the demo automatically
Execute the script `launch_demo.sh`.
It starts the web server for a while and opens the demo in the default browser.

## Launch the demo manually
Open a web server on the submission's `src` directory, for example:

`python3 -m http.server -d src 3000`

Then, open the browser at <http://localhost:3000>.

The required assets (libraries, fonts) are included in the party submission.
However, follow the instructions for downloading assets above in other cases.
