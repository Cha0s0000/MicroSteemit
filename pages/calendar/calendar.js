// pages/calendar/calendar.js
Page({

  /**
   * The initial data of the page.
   */
  data: {
    day: '',
    year: '',
    month: '',
    date: '2017-01',
    today: '',
    week: ['日', '一', '二', '三', '四', '五', '六'],
    calendar: {
      first: [],
      second: [],
      third: [],
      fourth: []
    },
    swiperMap: ['first', 'second', 'third', 'fourth'],
    swiperIndex: 1,
    showCaldenlar: false
  },

  /**
   * Life cycle function - listen to page load.
   */
  onLoad: function (options) {
    const date = new Date()
      , month = this.formatMonth(date.getMonth() + 1)
      , year = date.getFullYear()
      , day = this.formatDay(date.getDate())
      , today = `${year}-${month}-${day}`
    let calendar = this.generateThreeMonths(year, month)

    this.setData({
      calendar,
      month,
      year,
      day,
      today,
      beSelectDate: today,
      date: `${year}-${month}`
    })  
  },

  /**
   * Life cycle function - the first rendering of the listening page.
   */
  onReady: function () {
  
  },

  /**
   * Life cycle function - monitor page display.
   */
  onShow: function () {
  
  },

  /**
   * Life cycle function - the listening page is hidden.
   */
  onHide: function () {
  
  },

  /**
   * Life cycle function - monitor page uninstall.
   */
  onUnload: function () {
  
  },

  /**
   * Page correlation event handler - listen to the user to pull.
   */
  onPullDownRefresh: function () {
  
  },

  /**
   *The handle function of the bottom event on the page.
   */
  onReachBottom: function () {
  
  },

  /**
   * Users click the top right corner to share.
   */
  onShareAppMessage: function () {
  
  },

  showCaldenlar: function() {
    this.setData({
      showCaldenlar: !this.data.showCaldenlar
    })
  },
  /**
	 * 
	 * Sliding around to change the month
	 */
  swiperChange: function(e) {
    const lastIndex = this.data.swiperIndex
      , currentIndex = e.detail.current
    let flag = false
      , { year, month, day, today, date, calendar, swiperMap } = this.data
      , change = swiperMap[(lastIndex + 2) % 4]
      , time = this.countMonth(year, month)
      , key = 'lastMonth'

    if (lastIndex > currentIndex) {
      lastIndex === 3 && currentIndex === 0
        ? flag = true
        : null
    } else {
      lastIndex === 0 && currentIndex === 3
        ? null
        : flag = true
    }
    if (flag) {
      key = 'nextMonth'
    }

    year = time[key].year
    month = time[key].month
    date = `${year}-${month}`
    day = ''
    if (today.indexOf(date) !== -1) {
      day = today.slice(-2)
    }

    time = this.countMonth(year, month)
    calendar[change] = null
    calendar[change] = this.generateAllDays(time[key].year, time[key].month)

    this.setData({
      swiperIndex: currentIndex,
      year,
      month,
      date,
      day,
      calendar
    })
  },
	/**
	 * 
   * clikc to change the month and the day
	 */
  generateThreeMonths: function(year, month) {
    let { swiperIndex, swiperMap, calendar } = this.data
      , thisKey = swiperMap[swiperIndex]
      , lastKey = swiperMap[swiperIndex - 1 === -1 ? 3 : swiperIndex - 1]
      , nextKey = swiperMap[swiperIndex + 1 === 4 ? 0 : swiperIndex + 1]
      , time = this.countMonth(year, month)
    delete calendar[lastKey]
    calendar[lastKey] = this.generateAllDays(time.lastMonth.year, time.lastMonth.month)
    delete calendar[thisKey]
    calendar[thisKey] = this.generateAllDays(time.thisMonth.year, time.thisMonth.month)
    delete calendar[nextKey]
    calendar[nextKey] = this.generateAllDays(time.nextMonth.year, time.nextMonth.month)
    return calendar
  },
  bindDayTap: function(e) {
    let { month, year } = this.data
      , time = this.countMonth(year, month)
      , tapMon = e.currentTarget.dataset.month
      , day = e.currentTarget.dataset.day
    if (tapMon == time.lastMonth.month) {
      this.changeDate(time.lastMonth.year, time.lastMonth.month)
    } else if (tapMon == time.nextMonth.month) {
      this.changeDate(time.nextMonth.year, time.nextMonth.month)
    } else {
      this.setData({
        day
      })
    }
    let beSelectDate = e.currentTarget.dataset.date;
    this.setData({
      beSelectDate,
      showCaldenlar: false
    })
  },
  bindDateChange: function(e) {
    if (e.detail.value === this.data.date) {
      return
    }

    const month = e.detail.value.slice(-2)
      , year = e.detail.value.slice(0, 4)

    this.changeDate(year, month)
  },
  prevMonth: function(e) {
    let { year, month } = this.data
      , time = this.countMonth(year, month)
    this.changeDate(time.lastMonth.year, time.lastMonth.month)
  },
  nextMonth: function(e) {
    let { year, month } = this.data
      , time = this.countMonth(year, month)
    this.changeDate(time.nextMonth.year, time.nextMonth.month)
  },
	/**
	 * 
	 * Directly change date
	 */
  changeDate: function(year, month) {
    let { day, today } = this.data
      , calendar = this.generateThreeMonths(year, month)
      , date = `${year}-${month}`
    date.indexOf(today) === -1
      ? day = '01'
      : day = today.slice(-2)

    this.setData({
      calendar,
      day,
      date,
      month,
      year,
    })
  },
	/**
	 * 
	 * deal with the month
	 */
  countMonth: function(year, month) {
    let lastMonth = {
      month: this.formatMonth(parseInt(month) - 1)
    }
      , thisMonth = {
        year,
        month,
        num: this.getNumOfDays(year, month)
      }
      , nextMonth = {
        month: this.formatMonth(parseInt(month) + 1)
      }

    lastMonth.year = parseInt(month) === 1 && parseInt(lastMonth.month) === 12
      ? `${parseInt(year) - 1}`
      : year + ''
    lastMonth.num = this.getNumOfDays(lastMonth.year, lastMonth.month)
    nextMonth.year = parseInt(month) === 12 && parseInt(nextMonth.month) === 1
      ? `${parseInt(year) + 1}`
      : year + ''
    nextMonth.num = this.getNumOfDays(nextMonth.year, nextMonth.month)
    return {
      lastMonth,
      thisMonth,
      nextMonth
    }
  },
  currentMonthDays: function(year, month) {
    const numOfDays = this.getNumOfDays(year, month)
    return this.generateDays(year, month, numOfDays)
  },
	/**
	 * calc how many days will show in last month 
	 */
  lastMonthDays: function(year, month) {
    const lastMonth = this.formatMonth(parseInt(month) - 1)
      , lastMonthYear = parseInt(month) === 1 && parseInt(lastMonth) === 12
        ? `${parseInt(year) - 1}`
        : year
      , lastNum = this.getNumOfDays(lastMonthYear, lastMonth) 
    let startWeek = this.getWeekOfDate(year, month - 1, 1) 
      , days = []
    if (startWeek == 7) {
      return days
    }

    const startDay = lastNum - startWeek

    return this.generateDays(lastMonthYear, lastMonth, lastNum, { startNum: startDay, notCurrent: true })
  },
	/**
	 * calc how many days will show in next month
	 */
  nextMonthDays: function(year, month) {
    const nextMonth = this.formatMonth(parseInt(month) + 1)
      , nextMonthYear = parseInt(month) === 12 && parseInt(nextMonth) === 1
        ? `${parseInt(year) + 1}`
        : year
      , nextNum = this.getNumOfDays(nextMonthYear, nextMonth)  
    let endWeek = this.getWeekOfDate(year, month)					
      , days = []
      , daysNum = 0
    if (endWeek == 6) {
      return days
    } else if (endWeek == 7) {
      daysNum = 6
    } else {
      daysNum = 6 - endWeek
    }
    return this.generateDays(nextMonthYear, nextMonth, daysNum, { startNum: 1, notCurrent: true })
  },
	/**
	 * 
	 * show the days in a month
	 */
  generateAllDays: function(year, month) {
    let lastMonth = this.lastMonthDays(year, month)
      , thisMonth = this.currentMonthDays(year, month)
      , nextMonth = this.nextMonthDays(year, month)
      , days = [].concat(lastMonth, thisMonth, nextMonth)
    return days
  },
	/**
	 * 
	 * show the day
	 */
  generateDays: function(year, month, daysNum, option = {
    startNum: 1,
    notCurrent: false
  }) {
    const weekMap = ['一', '二', '三', '四', '五', '六', '日']
    let days = []
    for (let i = option.startNum; i <= daysNum; i++) {
      let week = weekMap[new Date(year, month - 1, i).getUTCDay()]
      let day = this.formatDay(i)
      days.push({
        date: `${year}-${month}-${day}`,
        event: false,
        day,
        week,
        month,
        year
      })
    }
    return days
  },
	/**
	 * 
	 * get date detail of the specified day
	 */
  getWeekOfDate: function(year, month, day = 0) {
    let dateOfMonth = new Date(year, month, 0).getUTCDay() + 1;
    dateOfMonth == 7 ? dateOfMonth = 0 : '';
    return dateOfMonth;
  },
	/**
	 * 
	 * Get how many days in this month
	 */
  getNumOfDays: function(year, month, day = 0) {
    return new Date(year, month, day).getDate()
  },
	/**
	 * 
	 * Deal with the month
	 */
  formatMonth:function(month) {
    let monthStr = ''
    if (month > 12 || month < 1) {
      monthStr = Math.abs(month - 12) + ''
    } else {
      monthStr = month + ''
    }
    monthStr = `${monthStr.length > 1 ? '' : '0'}${monthStr}`
    return monthStr
  },
  formatDay(day) {
    return `${(day + '').length > 1 ? '' : '0'}${day}`
  }
})