(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);


    // Fixed Navbar
    $(window).scroll(function () {
        if ($(window).width() < 992) {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow');
            } else {
                $('.fixed-top').removeClass('shadow');
            }
        } else {
            if ($(this).scrollTop() > 55) {
                $('.fixed-top').addClass('shadow').css('top', -55);
            } else {
                $('.fixed-top').removeClass('shadow').css('top', 0);
            }
        } 
    });
    
    
   // Back to top button
   $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
        $('.back-to-top').fadeIn('slow');
    } else {
        $('.back-to-top').fadeOut('slow');
    }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonial carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 2000,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:1
            },
            992:{
                items:2
            },
            1200:{
                items:2
            }
        }
    });


    // vegetable carousel
    $(".vegetable-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            },
            1200:{
                items:4
            }
        }
    });


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });



    // Product Quantity (Tăng / Giảm số lượng)
    $('.quantity button').on('click', function () {
        var button = $(this);
        var input = button.closest('.quantity').find('input');
        var oldValue = parseFloat(input.val()) || 1;
        var newVal = 1;

        if (button.hasClass('btn-plus')) {
            newVal = oldValue + 1;
        } else {
            // "1 là hết đát": nếu đang là 1 thì giữ nguyên 1, không cho về 0 hay số âm
            if (oldValue > 1) {
                newVal = oldValue - 1;
            } else {
                newVal = 1;
            }
        }

        input.val(newVal).trigger('change');
    });

    // Lắng nghe sự kiện khi số lượng thay đổi (bấm nút hoặc tự nhập tay)
    $('.quantity input').on('change', function () {
        var input = $(this);
        var val = parseFloat(input.val());

        // Kiểm tra hợp lệ: nếu nhập chữ hoặc số <= 0 thì tự reset về 1
        if (isNaN(val) || val < 1) {
            val = 1;
            input.val(1);
        }

        // Nếu input nằm trong dòng sản phẩm giỏ hàng (thẻ tr có data-price)
        var row = input.closest('tr[data-price]');
        if (row.length > 0) {
            var price = parseFloat(row.data('price')) || 0;
            var subtotal = price * val;

            // 1. Cập nhật thành tiền của dòng đó
            row.find('.cart-item-total').text(new Intl.NumberFormat('vi-VN').format(subtotal) + ' đ');

            // 2. Cập nhật lại tổng đơn hàng bên dưới
            updateCartOrderSummary();
        }
    });

    // Hàm tính lại Tạm Tính và Tổng Đơn Hàng
    function updateCartOrderSummary() {
        var grandTotal = 0;
        $('tr[data-price]').each(function () {
            var row = $(this);
            var price = parseFloat(row.data('price')) || 0;
            var qty = parseFloat(row.find('.cart-qty-input').val()) || 1;
            grandTotal += price * qty;
        });

        var formattedTotal = new Intl.NumberFormat('vi-VN').format(grandTotal) + ' đ';
        $('#order-subtotal').text(formattedTotal);
        $('#order-total').text(formattedTotal);
    }

})(jQuery);

