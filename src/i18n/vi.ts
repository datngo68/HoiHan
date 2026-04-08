const vi = {
  splash: {
    greeting: 'Xin chào, {{receiver}}!',
    subtitle: 'Có một câu hỏi dành cho bạn...',
    start: 'Bắt đầu',
    from: 'Từ {{sender}} với tất cả yêu thương',
  },
  question: {
    variants: [
      '{{receiver}} có yêu {{sender}} không?',
      'Thật sự mà, {{receiver}} có yêu {{sender}} không?',
      'Cho {{sender}} cơ hội trả lời lại nè... {{receiver}} yêu {{sender}} chứ?',
      'Sao vẫn bấm KHÔNG hả? {{receiver}} yêu {{sender}} mà đúng không?',
      '{{sender}} hỏi lại lần nữa nha... {{receiver}} yêu {{sender}} không?',
      'Nè nè, suy nghĩ kỹ đi... {{receiver}} yêu {{sender}} phải không?',
      'Oke chill... nhưng {{receiver}} có yêu {{sender}} không thật?',
      'Lần này trả lời thật nha! {{receiver}} có yêu {{sender}} không?',
      '{{sender}} sẽ hỏi đến khi nào {{receiver}} nói CÓ... {{receiver}} yêu {{sender}} không?',
      'Câu hỏi cuối cùng (hoặc không)... {{receiver}} có yêu {{sender}} không?',
      'Thôi đi mà, nói CÓ đi...',
      '{{sender}} biết câu trả lời rồi, chỉ cần {{receiver}} nói thôi!',
    ],
    yes: 'Có, {{receiver}} yêu!',
    no: 'Không',
    noTooltips: [
      'Chắc chưa?',
      'Bấm lại đi...',
      'Sai rồi!',
      'Thử lại nha!',
      'Hmm... suy nghĩ lại?',
      'Nút này hư rồi',
    ],
  },
  celebration: {
    title: 'Yaaaay!',
    message: '{{sender}} biết mà! {{receiver}} yêu {{sender}}!',
    subtitle: 'Cảm ơn {{receiver}} đã nói CÓ!',
    share: 'Chia sẻ',
    playAgain: 'Chơi lại',
  },
  challenge: {
    title: 'Thử thách #{{num}}',
    skip: 'Bỏ qua',
    complete: 'Hoàn thành!',
    timeLeft: 'Còn {{seconds}}s',
    tryAgain: 'Về trả lời lại',
  },
  settings: {
    title: 'Cài đặt',
    receiverName: 'Tên người nhận',
    senderName: 'Tên người gửi',
    language: 'Ngôn ngữ',
    save: 'Lưu',
    close: 'Đóng',
  },
} as const

export default vi
