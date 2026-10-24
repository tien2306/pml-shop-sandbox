(function ($) {
  "use strict";

  // Spinner
  var spinner = function () {
    setTimeout(function () {
      if ($("#spinner").length > 0) {
        $("#spinner").removeClass("show");
      }
    }, 1);
  };
  spinner(0);

  // Fixed Navbar
  $(window).scroll(function () {
    if ($(window).width() < 992) {
      if ($(this).scrollTop() > 55) {
        $(".fixed-top").addClass("shadow");
      } else {
        $(".fixed-top").removeClass("shadow");
      }
    } else {
      if ($(this).scrollTop() > 55) {
        $(".fixed-top").addClass("shadow").css("top", -55);
      } else {
        $(".fixed-top").removeClass("shadow").css("top", 0);
      }
    }
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
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
    nav: true,
    navText: [
      '<i class="bi bi-arrow-left"></i>',
      '<i class="bi bi-arrow-right"></i>',
    ],
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 1,
      },
      768: {
        items: 1,
      },
      992: {
        items: 2,
      },
      1200: {
        items: 2,
      },
    },
  });

  // vegetable carousel
  $(".vegetable-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1500,
    center: false,
    dots: true,
    loop: true,
    margin: 25,
    nav: true,
    navText: [
      '<i class="bi bi-arrow-left"></i>',
      '<i class="bi bi-arrow-right"></i>',
    ],
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 1,
      },
      768: {
        items: 2,
      },
      992: {
        items: 3,
      },
      1200: {
        items: 4,
      },
    },
  });

  // Modal Video
  $(document).ready(function () {
    var $videoSrc;
    $(".btn-play").click(function () {
      $videoSrc = $(this).data("src");
    });
    console.log($videoSrc);

    $("#videoModal").on("shown.bs.modal", function (e) {
      $("#video").attr(
        "src",
        $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0",
      );
    });

    $("#videoModal").on("hide.bs.modal", function (e) {
      $("#video").attr("src", $videoSrc);
    });
  });

  // Product Quantity (Tăng / Giảm số lượng)
  $(".quantity button").on("click", function () {
    var button = $(this);
    var input = button.closest(".quantity").find('input:not([type="hidden"])');
    var oldValue = parseFloat(input.val()) || 1;
    var newVal = 1;

    if (button.hasClass("btn-plus")) {
      newVal = oldValue + 1;
    } else {
      // "1 là hết đát": nếu đang là 1 thì giữ nguyên 1, không cho về 0 hay số âm
      if (oldValue > 1) {
        newVal = oldValue - 1;
      } else {
        newVal = 1;
      }
    }

    input.val(newVal).trigger("change");
  });

  // Lắng nghe sự kiện khi số lượng thay đổi (bấm nút hoặc tự nhập tay)
  $('.quantity input:not([type="hidden"])').on("change", function () {
    var input = $(this);
    var val = parseFloat(input.val());

    // Kiểm tra hợp lệ: nếu nhập chữ hoặc số <= 0 thì tự reset về 1
    if (isNaN(val) || val < 1) {
      val = 1;
      input.val(1);
    }

    // Nếu input nằm trong dòng sản phẩm giỏ hàng (thẻ tr có data-price)
    var row = input.closest("tr[data-price]");
    if (row.length > 0) {
      var price = parseFloat(row.data("price")) || 0;
      var subtotal = price * val;

      // 1. Cập nhật thành tiền của dòng đó
      row
        .find(".cart-item-total")
        .text(new Intl.NumberFormat("vi-VN").format(subtotal) + " đ");

      // 2. Cập nhật lại tổng đơn hàng bên dưới
      updateCartOrderSummary();
    }
  });

  // Hàm tính lại Tạm Tính và Tổng Đơn Hàng
  function updateCartOrderSummary() {
    var grandTotal = 0;
    $("tr[data-price]").each(function () {
      var row = $(this);
      var price = parseFloat(row.data("price")) || 0;
      var qty = parseFloat(row.find(".cart-qty-input").val()) || 1;
      grandTotal += price * qty;
    });

    var formattedTotal =
      new Intl.NumberFormat("vi-VN").format(grandTotal) + " đ";
    $("#order-subtotal").text(formattedTotal);
    $("#order-total").text(formattedTotal);
  }

  const navElement = $("#navbarCollapse");
  const currentUrl = window.location.pathname;
  navElement.find("a.nav-link").each(function () {
    const link = $(this); // Get the current link in the loop
    const href = link.attr("href"); // Get the href attribute of the link

    if (href === currentUrl) {
      link.addClass("active"); // Add 'active' class if the href matches the current URL
    } else {
      link.removeClass("active"); // Remove 'active' class if the href does not match
    }
  });

  //handle filter products
  $("#btnFilter").click(function (event) {
    event.preventDefault();

    let factoryArr = [];
    let targetArr = [];
    let priceArr = [];
    //factory filter
    $("#factoryFilter .form-check-input:checked").each(function () {
      factoryArr.push($(this).val());
    });

    //target filter
    $("#targetFilter .form-check-input:checked").each(function () {
      targetArr.push($(this).val());
    });

    //price filter
    $("#priceFilter .form-check-input:checked").each(function () {
      priceArr.push($(this).val());
    });

    //sort order
    let sortValue = $('input[name="radio-sort"]:checked').val();

    const currentUrl = new URL(window.location.href);
    const searchParams = currentUrl.searchParams;

    const currentPage = searchParams?.get("page") ?? "1";
    // Add or update query parameters
    searchParams.set("page", currentPage);
    searchParams.set("sort", sortValue);

    //reset
    searchParams.delete("factory");
    searchParams.delete("target");
    searchParams.delete("price");

    if (factoryArr.length > 0) {
      searchParams.set("factory", factoryArr.join(","));
    }

    if (targetArr.length > 0) {
      searchParams.set("target", targetArr.join(","));
    }

    if (priceArr.length > 0) {
      searchParams.set("price", priceArr.join(","));
    }

    // Update the URL and reload the page
    window.location.href = currentUrl.toString();
  });

  //handle auto checkbox after page loading
  // Parse the URL parameters
  const params = new URLSearchParams(window.location.search);

  // Set checkboxes for 'factory'
  if (params.has("factory")) {
    const factories = params.get("factory").split(",");
    factories.forEach((factory) => {
      $(`#factoryFilter .form-check-input[value="${factory}"]`).prop(
        "checked",
        true,
      );
    });
  }

  // Set checkboxes for 'target'
  if (params.has("target")) {
    const targets = params.get("target").split(",");
    targets.forEach((target) => {
      $(`#targetFilter .form-check-input[value="${target}"]`).prop(
        "checked",
        true,
      );
    });
  }

  // Set checkboxes for 'price'
  if (params.has("price")) {
    const prices = params.get("price").split(",");
    prices.forEach((price) => {
      $(`#priceFilter .form-check-input[value="${price}"]`).prop(
        "checked",
        true,
      );
    });
  }

  // Set radio buttons for 'sort'
  if (params.has("sort")) {
    const sort = params.get("sort");
    $(`input[type="radio"][name="radio-sort"][value="${sort}"]`).prop(
      "checked",
      true,
    );
  }
})(jQuery);
