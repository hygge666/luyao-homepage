const metaTag = $('<meta>').attr('name', 'referrer').attr('content', 'never')
$('head').append(metaTag)
var protocol = location.protocol
var domain = location.hostname
const xfMeta = $('<meta>').attr('http-equiv', 'Content-Security-Policy').attr('content', 'upgrade-insecure-requests')
if (protocol !== 'http:') $('head').append(xfMeta)
function myBrowser() {
    var userAgent = navigator.userAgent
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera
    var isFirefox = userAgent.indexOf("Firefox") > -1
    if (isFirefox || isIE) {
        swal("您正在使用的浏览器不适配我站源码，为了您的最佳体验，浏览器更换为Chrome或者Edge")
    }
    return false
}
myBrowser()

var $z_xf_above = $('.xf_above')
var $z_xf_home = $('.xf_home, .xf_friend_btn, .xf_friend')
var $z_xf_footer = $('.xf_footer, #xf_top')
const getWindowInfo = () => {
    const windowInfo = {
        width: window.innerWidth
    }
    xf_pageW(windowInfo.width)
}
const debounce = (fn, delay) => {
    var pm_time
    return function () {
        if (pm_time) {
            clearTimeout(pm_time)
        }
        pm_time = setTimeout(() => {
            fn()
        }, delay)
    }
}
const cancalDebounce = debounce(getWindowInfo, 500)
window.addEventListener('resize', cancalDebounce)

function xf_pageW(daf) {
    function setClass(elements, className) {
        if (daf >= 800) {
            elements.addClass(className)
        } else {
            elements.removeClass(className)
        }
    }
    setClass($z_xf_above, 'pc_xf_above')
    setClass($z_xf_home, 'pc_xf_home')
    setClass($z_xf_footer, 'pc_xf_footer')
}
xf_pageW(window.innerWidth)

var $xfLoad = $('.xf_load')
$(window).on('load', () => {
    if ($xfLoad.length) {
        $xfLoad.delay(300).fadeOut(600)
    }
    return false
})

$(function () {
    $(document).bind('contextmenu', () => {
        swal('为了页面的美观,本站禁止右键')
        return false
    })
    function xf_ios() {
        var lastTouchEnd = 0
        document.addEventListener('touchstart', function (e) {
            if (e.touches.length > 1) {
                e.preventDefault()
            }
        })
        document.addEventListener('touchend', function (e) {
            const now = (new Date()).getTime()
            if (now - lastTouchEnd <= 300) {
                e.preventDefault()
            }
            lastTouchEnd = now
        }, false)
        document.addEventListener('gesturestart', function (e) { e.preventDefault() })
        const content = document.querySelector('.content')
        content?.addEventListener('touchmove', e => {
            e.stopPropagation()
        }, { passive: false, capture: false })
    }
    xf_ios()
    function getTpl() {
        const $site = $('#mysite')
        const $friendBox = $('.friend_box')

        if ($site.height() >= 930) {
            $site.height(930)
        }
        FunLazy({
            beforeLazy: function (src) {
                return src + "?id=" + Math.random().toString(36).substr(2, 10)
            }
        })
        if ($friendBox.children().length % 2 != 0) {
            $friendBox.children().last().css('margin-right', 0)
        }
    }
    getTpl()

    function getTime() {
        let myDate = new Date()
        let mon = getZero(myDate.getMonth() + 1)
        let date = getZero(myDate.getDate())
        let h = getZero(myDate.getHours())
        let m = getZero(myDate.getMinutes())
        let s = getZero(myDate.getSeconds())
        let week = myDate.getDay()
        let weeks = ['日', '一', '二', '三', '四', '五', '六']
        $('.xf_clock').html(`${h}:${m}`)
        $('.xf_moon_week').children().eq(0).html(`${mon}/${date}/`)
        $('.xf_moon_week').children().eq(1).html(`星期${weeks[week]}`)
    }
    getTime()
    setInterval(getTime, 2500)
    
    function getZero(zero) {
        zero = zero.toString()
        return zero < 10 ? '0' + zero : zero
    }
    
    function getMode() {
        const myDate = new Date()
        const h = myDate.getHours()
        var oncik = true
        if (h >= 19 || h <= 6) {
            $('body').addClass('xf_dark')
            oncik = !oncik
        } else {
            $('body').removeClass('xf_dark')
        }
        $('.xf_icon_above li').eq(1).on('click', () => {
            oncik ? $('body').addClass('xf_dark') : $('body').removeClass('xf_dark')
            oncik = !oncik
        })
    }
    getMode()
    $('.xf_icon_above').children().eq(2).on('click', function () {
        $('.xf_fade_out_pic').fadeIn(500)
    })
    $('.xf_cha').on('click', function () {
        $('.xf_fade_out_pic').fadeOut(500)
    })
    function xf_ajax(xf_request, xf_url, xf_timeout, xf_callback) {
        $.ajax({
            method: xf_request,
            url: xf_url,
            timeout: xf_timeout,
            dataType: "JSON",
            success: xf_callback,
            complete: function (XMLHttpRequest, status) {
                if (status == 'timeout') {
                    return console.log('接口请求超时')
                }
            }
        })
    }
    xf_ajax('GET', 'https://api.vvhan.com/api/weather', 5000, (res) => {
        if (res.success !== true) {
            $('.xf_city, .xf_high').html('获取出错！')
            console.log('天气接口请求失败')
        }
        $('.xf_city').html(res.city)
        $('.xf_high').html(res.info.high)
    })
    function yiyan() {
        xf_ajax('GET', 'https://api.vvhan.com/api/ian?type=json', 5000, (res) => {
            if (res.success !== true) {
                $('.infos').html('接口请求出错咯~')
                $('.infos_dis').hide()
            }
            $('.infos').html(res.data.vhan)
            $('.infos_dis p').html(res.data.vhan)
            $('.infos_dis').css('top', -($('.infos_dis').height() + 32) + 'px')
            $('.infos, .infos_dis').hover(
                () => { $('.infos_dis').fadeIn(500) },
                () => { $('.infos_dis').fadeOut(800) }
            )
        })
    }
    yiyan()
    var isClick = true
    var xf_alert = '<div class="xf_alert"><p class="sw_txt">点太快了！</p></div>'
    $('body').append(xf_alert)
    $('.Therefresh').on('click', () => {
        if (isClick) {
            isClick = false
            yiyan()
            setTimeout(() => {
                isClick = true
            }, 2000)
        } else {
            $('.xf_alert').stop().animate({ right: 0, }, 500)
            setTimeout(() => {
                $('.xf_alert').stop().animate({ right: '-100%' }, 500)
            }, 2000)
        }
    })
    function rotate3D(param1, param2) {
        $(param1).on('click', function () {
            $(this).toggleClass(param2)
        })
    }
    rotate3D('.weather_and_xf_rest', 'rotateY_3d')
    rotate3D('.fortune_and_information', 'rotateX_3d')
    var btnClick = true
    $('.xf_btn_sw').on('click', function () {
        if (btnClick) {
            btnClick = false
            $(this).toggleClass('xf_active')
            switchContent()
            setTimeout(() => {
                btnClick = true
            }, 500)
        } else {
            return false
        }
    })
    function switchContent() {
        var $home = $('.xf_home'), $friend = $('.xf_friend')
        if ($('.xf_btn_sw').hasClass('xf_active')) {
            $home.fadeOut(500, function () {
                $friend.fadeIn()
                $('.xf_btn_sw span').text('home >')
            })
        } else {
            $friend.fadeOut(500, function () {
                $home.fadeIn()
                $('.xf_btn_sw span').text('my friend >')
            })
        }
    }
    $('.xf_ipt ').children().prop('autocomplete', 'off')

    $('.form_click').on('click', () => {
        $('.sub_friend').slideToggle(500)
        $('.friend_links').toggleClass('xf-bottom-padding')
        $('.friend_links h3 span img').toggleClass('arrow-img')
    })
    
    const $xf_introduce = $('.xf_introduce')
    const $xf_num = $('.xf_num')
    $xf_introduce.bind('input propertychange', function () {
        const num = $(this).val().length
        if (num <= 0) {
            $xf_num.parent().fadeOut()
        } else {
            $xf_num.parent().fadeIn()
            $xf_num.text(num)
        }
    })
    
    const $qqinp = $('.xf_ipt input[name=qq]')
    $qqinp.on('input', function () {
        var text = $(this).val()
        if (text.length > 11) {
            swal('请输入正确的QQ号！')
        }
        $qqinp.val(text.substr(0, 11))
    })
    $qqinp.on('input', function () {
        var inputText = $(this).val().replace(/[^0-9]/g, '')
        $(this).val(inputText)
    })
    
    var $subFriend = $('.sub_friend')
    var $btnFriend = $('.btnFriend')
    var clicks = 0
    $subFriend.on('submit', function (event) {
        event.preventDefault()
        clicks++
        if (clicks > 3) {
            $btnFriend.attr('disabled', true)
            var timer = 4
            var stopTimer = setInterval(() => {
                timer--
                if (timer === 0) {
                    clearInterval(stopTimer)
                }
                swal(`你点的太快了，距离下次点击还剩：${timer} 秒`, {
                    buttons: false,
                    closeOnClickOutside: false,
                    timer: 1000,
                })
            }, 1000)
    
            setTimeout(() => {
                $btnFriend.removeAttr('disabled')
                clicks = 0
            }, 4000)
            return false
        }
        var emptyFields = $(this).find('input[type="text"], textarea').filter(function () {
            return $.trim($(this).val()) === ''
        })
    
        if (emptyFields.length) {
            swal('请填写所有必填字段！')
            return false
        }
    
        if ($qqinp.val().length < 4) {
            swal('请输入正确的QQ号！')
            return false
        }
        
        const data = $(this).serializeArray().reduce((obj, field) => {
            var sanitizedInput = field.value.replace(/[<>"&()$]/g, function (match) {
                switch (match) {
                    case '<':
                        return '&lt;'
                    case '>':
                        return '&gt;'
                    case '"':
                        return '&quot;'
                    case '&':
                        return '&amp;'
                    case '(':
                        return '（'
                    case ')':
                        return '）'
                    case '$':
                        return '￥'
                }
            })
            obj[field.name] = decodeURIComponent(sanitizedInput).trim()
            return obj
        }, {})
        $.ajax({
            type: "POST",
            url: `${protocol}//${domain}/ajax.php?act=shenlink`,
            data: data,
            dataType: "json",
            success: function(data) {
                if (data.code == 1) {
                    swal(data.msg)
                    $('.xf_ipt').children().val('')
                    $('.sub_friend p').fadeOut()
                } else {
                    swal(data.msg)
                    return false
              }
            }
        });
    })
    
    $('.xf_copy').attr('href', `${protocol}//${domain}/`)
    var $xf_icon_above = $('.xf_icon_above')
    var $xf_top = $('#xf_top')
    $(window).scroll(() => {
        $(document).scrollTop() >= $xf_icon_above.offset().top ? $xf_top.fadeIn() : $xf_top.fadeOut()
    })
    let $goTop = $('html')
    $xf_top.on('click', () => {
        $goTop.stop().animate({ scrollTop: 0 }, 500)
    })
    let $xf_title = $('.xf_title')
    console.log(`%c欢迎来到%c ${$xf_title.text()}`, 'padding: 5px 10px; border-radius: 5px 0 0 5px; background-color: #0380f4; font-weight: bold;', 'padding: 5px 10px; border-radius: 0 5px 5px 0; background-color: #03a9f4; font-weight: bold;')
})