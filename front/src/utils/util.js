const padLeft = (value, num = 2, fill = '0') => String(value).padStart(num, fill)

export const formatDate = (date, format) => {
  let originTime = date

  if (typeof date === 'string' || typeof date === 'number') {
    if (originTime.toString().length === 10) {
      originTime = Number(originTime) * 1000
    }
  }

  const d = new Date(originTime)

  const time = {
    YYYY: padLeft(d.getFullYear()),
    MM: padLeft(d.getMonth() + 1),
    DD: padLeft(d.getDate()),
    HH: padLeft(d.getHours()),
    mm: padLeft(d.getMinutes()),
    ss: padLeft(d.getSeconds()),
    M: padLeft(d.getMilliseconds(), 3)
  }
  return format.replace(new RegExp(`${Object.keys(time).join('|')}`, 'g'), subStr => {
    return time[subStr] || ''
  })
}

export const transformFileToBase64 = file => {
  return new Promise(reslove => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      reslove(reader.result)
    }
  })
}

export const setLocal = (key, value) => {
  if (key) {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

export const getLocal = key => {
  if (key) {
    try {
      const value = JSON.parse(localStorage.getItem(key))
      return value
    } catch (error) {}
  }
}

export const deepClone = list => {
  return JSON.parse(JSON.stringify(list))
}

export const getMax = list => {
  console.log(list)
  let max
  if (list.length === 0) {
    max = 1
  }
  else {
    max = list[0].id
    for (let i = 1; i < list.length; i++) {
      if (max < list[i].id) max = list[i].id
    }
  }
  return max
}

export const getFollowers = (list, id) => {
  const _list = deepClone(list)
  let followers = []

  let index = id

  for (let i = 0; i < _list.length; i++) {
    if (followers.length < 3) {
      if (_list[index]) {
        index += 1
        followers.push(_list[index - 1].id)
      } else {
        index = 1
        followers.push(_list[index - 1].id)
      }
    }
  }
  return followers
}

export const getUrlParams = (url) => {
  return (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce((a, v) => {
    const [key, value] = v.split('=')
    if (a[key]) {
      a[key] = ((typeof a[key] === 'string' ? [a[key]] : a[key])).concat(value)
    } else {
      a[key] = value
    }
    return a
  }, {} )
}

