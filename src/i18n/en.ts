const en = {
  splash: {
    greeting: 'Hello, {{receiver}}!',
    subtitle: 'There is a question for you...',
    start: 'Start',
    from: 'From {{sender}}, with all my love',
  },
  question: {
    variants: [
      'Do you love me?',
      'Seriously, do you love me?',
      'Let me ask again... You love me, right?',
      'Why do you keep pressing NO? You love me, right?',
      'One more time... Do you love me?',
      'Think carefully... You do love me, right?',
      'Okay chill... but do you really love me?',
      'Answer honestly this time! Do you love me?',
      "I'll keep asking until you say YES... Do you love me?",
      'Last question (or not)... Do you love me?',
      'Come on, just say YES...',
      'I already know the answer, just say it!',
    ],
    yes: 'Yes, I do!',
    no: 'No',
    noTooltips: [
      'Are you sure?',
      'Try again...',
      'Wrong answer!',
      'Think again!',
      'Hmm... reconsider?',
      'This button is broken',
    ],
  },
  celebration: {
    title: 'Yaaaay!',
    message: 'I knew it! {{receiver}} loves me!',
    subtitle: 'Thank you for saying YES!',
    share: 'Share',
    playAgain: 'Play Again',
  },
  challenge: {
    title: 'Challenge #{{num}}',
    skip: 'Skip',
    complete: 'Complete!',
    timeLeft: '{{seconds}}s left',
    tryAgain: 'Go back & answer',
  },
  settings: {
    title: 'Settings',
    receiverName: 'Receiver name',
    senderName: 'Sender name',
    language: 'Language',
    save: 'Save',
    close: 'Close',
  },
} as const

export default en
