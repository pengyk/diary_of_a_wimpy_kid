# Hackathon: ConUHacks


### Inspiration
We were inspired by recent innovations in Natural Language Processing and Understanding. The members of our team agreed on creating a product for social good. Thus, we came up with the idea of studying mental states and offering support to individuals based on MindBook analyses of their journal entry tones.

### What it does
In the browser, MindBook will ask the user to submit a journal entry. They can write about their feelings explicitly, or any topic of their choosing. From their entry, MindBook makes use of IBM's Watson Tone Analyzer API to parse each sentence's meaning. Then, the most prevalent emotion among Fear, Joy, Anger, Sadness, Confident, Tentative, and Analytical is selected. Based on this result (which is shared with the user and registered as part of their journal entry), MindBook makes personalized recommendations of mental health resources, music, and podcasts with the goal of improving well-being.

### How we built it
We created the front end using ReactJS. For the back end, we used Node.JS to call IBM's Watson Tone Analyzer. Firebase was the backbone of our work with databases. Finally, we implemented an imbedded Spotify audio player.

### Challenges we ran into
We ran into trouble calling the API on the client-side, so we had to scramble to set up a back end to handle the task. Time-wise, it was difficult and stressful. We are happy with our successful results, however.

### Accomplishments that we're proud of
Due to our lack of experience with Firebase, it took us much longer than expected to start using it efficiently. We are most proud of the meticulous learning approach we took on during ConUHacks V.

### What we learned
In the process of creating the front end of our product, an unexpected turn of events has forced us to create a back end. We learned to adapt to stressful situations and to support each other as a team.

### What's next for MindBook
We would like to study the historical trends of users in order to deliver not only on mood analysis, but also on the study of individual disposition and personality. Another important step for MindBook is to integrate voice dictation technologies, which can be leveraged for more accurate analyses. We will also use reinforcement learning to assess the quality of MindBook personalized recommendations based on user experience, thus improving our model in the long run.
