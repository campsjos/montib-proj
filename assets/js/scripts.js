/**
 * @file Fichero de scripts personalizados
 * @author Atoom Studio <info@atoomstudio.com>
 */

/**
 * @function Implementación de la funcion JS `reduce` para navegadores obsoletos
 */
if (!Array.prototype.reduce) {
	Array.prototype.reduce = function (callback /* , initialValue*/) {
		'use strict';
		if (this == null) {
			throw new TypeError('Array.prototype.reduce called on null or undefined');
		}
		if (typeof callback !== 'function') {
			throw new TypeError(callback + ' is not a function');
		}
		var t = Object(this), len = t.length >>> 0, k = 0, value;
		if (arguments.length == 2) {
			value = arguments[1];
		} else {
			while (k < len && !(k in t)) {
				k++;
			}
			if (k >= len) {
				throw new TypeError('Reduce of empty array with no initial value');
			}
			value = t[k++];
		}
		for (; k < len; k++) {
			if (k in t) {
				value = callback(value, t[k], k, t);
			}
		}
		return value;
	};
}

/**
 * @function Implementación de la funcion JS `indexOf` para navegadores obsoletos
 */
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (elt /* , from*/)
	{
		var len = this.length >>> 0;

		var from = Number(arguments[1]) || 0;
		from = (from < 0)
		 ? Math.ceil(from)
		 : Math.floor(from);
		if (from < 0)
			from += len;

		for (; from < len; from++)
	{
			if (from in this &&
			this[from] === elt)
				return from;
		}
		return -1;
	};
}

/**
 * @function Implementación de la funcion JS `trim` para navegadores obsoletos
 */
if (typeof String.prototype.trim !== 'function') {
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g, '');
	};
}
/* ----------END OF IE8 POLYFILLS-------------*/

var h_win, w_win, date_format = 'DD/MM/YYYY';

// Declaración de breakpoints
var BREAK_XL = 1200,
	BREAK_LG = 1000,
	BREAK_MD = 992,
	BREAK_SM = 768;

var langStrings = ['', '', ''];
window.breakpoint;

/**
* Función lanzada al cargar la página y en el evento `resize`.
* Asigna el valor del breakpoint de Bootstrap a la variable `window.breakpoint`.
* Si el valor de `window.breakpoint` cambia emite el evento `breakpoint_change`.
*/
function getBreakpoint(width) {
	if (isOldIE) {
		return 'lg';
	}
	var currentSize;
	if (width >= BREAK_XL) {
		currentSize = 'xl';
	} else if (width >= BREAK_LG) {
		currentSize = 'lg';
	} else if (width >= BREAK_MD) {
		currentSize = 'md';
	} else if (width >= BREAK_SM) {
		currentSize = 'sm';
	} else {
		currentSize = 'xs';
	}
	if (window.breakpoint !== currentSize) {
		window.breakpoint = currentSize;
		$(document).trigger('breakpoint_change');
	}
}

/**
 * Funcion ejecutada en el evento `ready`del DOM
 * Ejecuta otras funciones en el orden asignado.
 */
function init() {
	getLangSwitcherVals();
	fadeSlider();
	fadeBanner();
	initFixedMenu();

	// Todos los elementos con clase="lazy" se cargarán con lazy load (jQuery.Unveil).
	$('.lazy').unveil();

	ieFix();
	resize();
	initParallax();
	AnimateElements();
	initBookingCal();
	wideTablet();
	setHeaderHeight();
}

// Fix para los glyphicons de Bootstrap para IE
function ieFix() {
	if (isOldIE) {
		var head = document.getElementsByTagName('head')[0],
			style = document.createElement('style');
		style.type = 'text/css';
		style.styleSheet.cssText = ':before,:after{content:none !important';
		head.appendChild(style);
		setTimeout(function () {
			head.removeChild(style);
		}, 0);
	}
}

// Si el User-Agent indica que es una tablet y además tiene un ancho >= BREAK_LG, simula un ancho de 999px.
// Previene que pueda mostrarse el menú 'desktop' (no colapsado) en tablets.
function wideTablet() {
	var md = new MobileDetect(window.navigator.userAgent);
	if (md.tablet() !== null && (window.breakpoint === 'lg' || window.breakpoint === 'xl')) {
		 $('meta[name="viewport"]').prop('content', 'width=999');
	}
}

// Calcula el tamaño de la ventada del navegador para aplicarlo en el slider de la home o en headers fullscreen.
function setHeaderHeight() {
	var sel_sections = $('#carousel-home, #carousel-home .carousel-inner, #carousel-home .carousel-inner .item, .banner-fullscreen'),
		new_height = $(window).height();
	if (window.breakpoint !== 'lg' && window.breakpoint !== 'xl' && !isOldIE) {

		header_height = $('#header_wrapper').innerHeight(),
		new_height = $(window).height() - header_height;
	}
	sel_sections.css({'height': new_height + 'px'});
}

/**
 * Funcion llamada con el evento `resize`.
 * Lanza la funcion getBreakpoint().
 * Recalcula el tamaño del overlay de reserva y modifica su formulario.
 * Lanza la funcion blogBlockSize().
 */
function resize() {
	h_win = $(window).height();
	w_win = window.innerWidth;
	getBreakpoint(w_win);

	$('#reservar').css({'min-height': h_win});

	if (w_win < 768) {
		$('#datetimepicker1, #datetimepicker2').removeAttr('disabled');
	} else {
		$('#datetimepicker1, #datetimepicker2').attr('disabled', 'disabled');
	}
	blogBlockSize();

}

/**
 * Calcula y aplica el tamaño de la imagen principal que acompaña cada post del listado de entradas.
 */
function blogBlockSize() {
	if ($('.fila_listado_blog').length > 0) {
		$('.fila_listado_blog').each(function () {
			h = $(this).find('.resumen-post').outerHeight();
			$(this).css({height: h});
		});
	}
}

/**
 * Funcionalidad de menú fijo al hacer scroll
 */
function initFixedMenu()
{
	var menu = jQuery('#header_wrapper'),
		pos = menu.position();

	jQuery(window).scroll(function () {
		if (jQuery(this).scrollTop() > 100) {
			menu.addClass('header-fixed');
		} else {
			menu.removeClass('header-fixed');
		}
	});

}

/**
 * Colección de elementos animados al cargar la página o al llegar a ellos con el scroll
 * Waypoint es el plugin usado para detectar cuando un elemento aparece en la ventana.
 */
function AnimateElements() {

	$('#header_wrapper').addClass('header-wrapper-done');
	$('#main-nav-container .cont-menu').addClass('cont-menu-done');
	$('#logo').addClass('logo-done');

	var espera = 200;

	$('#map').waypoint(function () {
		loadMapsScript(initMap);
		this.destroy();
	}, {offset: '90%'});
	$('#container-video').waypoint(function () {
		var url = $(this.element).data('url');
		createIframe(url, this.element);
		this.destroy();
	}, {offset: '70%'});

	$('.wp-galeria').waypoint(function () {
		if (window.breakpoint !== 'xs' || !$(this.element).hasClass('hidden-xs')) {
			var type = $(this.element).data('type');
			loadImages(type, 3);
		}
		this.destroy();
	}, {offset: '90%'});

	$('#sections-blocks').waypoint(function () {
		$(this.element).find('.load-item').each(function (index) {
			time = 100 * index + espera;
			addItemDoneClass($(this), time);
		});
		this.destroy();
	}, {offset: '90%'});

	$('#listado-ofertas').waypoint(function () {
		$(this.element).find('.load-item').each(function (index) {
			time = 100 * index + espera;
			addItemDoneClass($(this), time);
		});
		this.destroy();
	}, {offset: '90%'});

	$('.prefooter-box').waypoint(function () {
		$(this.element).find('.col').each(function (index) {
			time = 100 * index + espera;
			addItemDoneClass($(this), time);
		});
	}, {offset: '90%'});

	$('#listado-habitaciones').find('.row').waypoint(function () {
		$(this.element).addClass('item-done');
		this.destroy();
	}, {offset: '90%'});

	$('#listado-blog').find('.fila_listado_blog').waypoint(function () {
		$(this.element).addClass('item-done');
		this.destroy();
	}, {offset: '90%'});
}

/**
 * Tiempo de espera para aplicar una animación.
 * Util cuando waypoints detecta que varios elementos aparecen a la vez pero queremos que se animen uno tras otro. (ej.: elementos del pre-footer)
 */
function addItemDoneClass(element, time) {
	setTimeout(function () {
		element.addClass('item-done');
	}, time);
}

/**
 * Guarda en variables globales los valores del menú de idiomas
 * para modificarlos en otras funciones (changeLangSwitcherLength())
 */
function getLangSwitcherVals() {
	langStrings[0] = $('#language_selector').text();
	langStrings[0] = langStrings[0].trim();
	langStrings[1] = $('.dropdown-language a').eq(0).text();
	langStrings[2] = $('.dropdown-language a').eq(1).text();
	$(document).on('breakpoint_change', function () {
		changeLangSwitcherLength();
		changeHeaderElements();
	});
	$('#language_selector').fadeIn();
}

/**
 * Muestra el idioma completo o su abreviación segun sea vista movil o no.
 * ESPAÑOL -> ES -> ESPAÑOL
 */
function changeLangSwitcherLength() {
	if (window.breakpoint === 'xs') {
		$('#language_selector .main-lang').text(langStrings[0].substring(0, 3));
		$('.dropdown-language a').eq(0).text(langStrings[1].substring(0, 3));
		$('.dropdown-language a').eq(1).text(langStrings[2].substring(0, 3));
	} else {
		$('#language_selector .main-lang').text(langStrings[0]);
		$('.dropdown-language a').eq(0).text(langStrings[1]);
		$('.dropdown-language a').eq(1).text(langStrings[2]);
	}
}

/**
 * Modifica el tamaño de los elementos del header segun el breakpoint en el que se muestre la página.
 */
function changeHeaderElements() {
	if (window.breakpoint === 'lg') {
		$('#lang-wrapper').attr('class', 'col-xs-2 col-lg-2');
		$('#logo-wrapper').attr('class', 'col-xs-8 col-lg-8 text-center');
		$('#book-wrapper').attr('class', 'col-xs-2 col-lg-2 visible-lg');
	} else {
		$('#lang-wrapper').attr('class', 'col-xs-2 col-lg-1');
		$('#logo-wrapper').attr('class', 'col-xs-8 col-lg-10 text-center');
		$('#book-wrapper').attr('class', 'col-xs-2 col-lg-1 visible-lg');
	}
}

/**
 * Inicializa la funcion `parallax` en los elementos .banner-pagina-interior y #cont-form-contacto
 * sólo en vista 'desktop'
 */
function initParallax() {
	if (window.breakpoint !== 'sm' && window.breakpoint !== 'xs') {
		$('.banner-pagina-interior').parallax('50%', -0.5);
		$('#cont-form-contacto').parallax('50%', 0.2);
	}
}

/**
 * Carga las imágenes de las distintas galerías al hacer scroll o al pulsar sobre el botón de "Cargar más imágenes"
 * Genera un carusel en vista móvil o una galeria (Blueimp Gallery) en las demás vistas.
 */
var galleryObj = null;
function loadImages(type, num) {
	if (typeof num === 'undefined') {
		num = 6;
	}
	var images = [];
	var links = [];
	var type_id = type.split('-');
	var container = '#links';
	if (type_id[1] !== 'default') {
		container += '-' + type_id[1];
	}

	if (type === 'galeria-panoramicas') {
		images = $(container).data('items');
		images = images.split(',');
		generateGallery(images, container, 6);
	} else if (type === 'galeria-videos') {
		galeria_videos = $(container).data('items');
		galeria_videos = galeria_videos.split(',');
		generateGallery(galeria_videos, container, 6);
	} else {
		images = $(container).data('items');
		console.log(images);
		images = images.split(',');
		if (window.breakpoint === 'xs') {
			generateCarousel(images, container);
		} else {
			generateGallery(images, container, num);
		}
	}
}

/**
 * Modifica el nombre de la imagen a cargar segun los parametros que se le indiquen.
 * Usado para cargar distintos tamaños de imagen segun el breakpoint.
 * Ejemplo: mi_imagen.jpg -> mi_imagen@sm.jpg
 */
function addImageSuffix(image, suffix) {
	if (typeof image !== 'undefined') {
		var image_array = image.split('.');
		if (image_array[0] === 'https://img') {
			return image;
		}
		var first = image_array.slice(0, -1).join('.') + suffix;
		return [first, image_array[image_array.length - 1]].join('.');
	}
}

/**
 * Crea una galería de imagenes en formato carousel
 */
function generateCarousel(images, container) {
	var carousel_inner = $('<div />', {
		'class': 'carousel-inner'
	});
	$.each(images, function (index, val) {
		var img = $('<img />', {
			src: (window.breakpoint == 'xs') ? addImageSuffix(images[index], '@sm') : images[index],
			'class': 'img-responsive'
		});
		var item = $('<div />', {
			'class': (index === 0) ? 'item active' : 'item'
		});
		img.appendTo(item);
		item.appendTo(carousel_inner);
	});
	var carousel = $('<div />', {
		'class': 'carousel slide carousel-galeria carousel-' + container.substring(1)
	});
	carousel_inner.appendTo(carousel);
	carousel.append('<a class="left carousel-control" href=".carousel-' + container.substring(1) + '" role="button" data-slide="prev"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span><span class="sr-only">Previous</span></a><a class="right carousel-control" href=".carousel-' + container.substring(1) + '" role="button" data-slide="next"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span><span class="sr-only">Next</span></a>');
	carousel.appendTo(container + ' .gallery-carousel');
	$(container).find('.gallery-content').carousel();
}

/**
 * Crea una galería de imagenes estándar con el plugin Blueimp Gallery
 */
function generateGallery(images, container, number) {
	var current_images = $(container).find('.galeria').length;
	var loop_length = number;
	if (images.length - current_images < 6) {
		loop_length = images.length - current_images;
		$(container).find('.load-images').hide();
	}

	for (var i = current_images; i < loop_length + current_images; i++) {
		var cell_div = $('<div />', {
			'class': 'col-xs-6 col-sm-4 load-item item'
		});
		var img_link = $('<a />', {
			href: images[i],
			'data-gallery': container,
			'class': 'galeria image-effect-link'
		});
		if (container === '#links-videos') {
			img_link.attr('data-youtube-id', images[i]);
			img_link.attr('href', 'https://www.youtube.com/watch?v=' + images[i]);

			images[i] = 'https://img.youtube.com/vi/' + images[i] + '/hqdefault.jpg';
		}

		picture = $('<img />', {
			src: addImageSuffix(images[i], '@sm'),
			'class': 'img-responsive-100x100'
		});

		picture.appendTo(img_link);
		img_link.appendTo(cell_div);
		cell_div.appendTo(container + ' .gallery-content');
	}
	$(container).find('.load-item').each(function (index) {
		time = 100 * index;
		addItemDoneClass($(this), time);
	});
}

/**
 * Aplica un efecto 'fade in` en el slider de la home
 */
function fadeSlider() {
	var first_slider_img = $('#carousel-home .item').first().css('background-image');
	if (typeof first_slider_img !== 'undefined') {
		first_slider_img = first_slider_img.replace('url(', '').replace(')', '').replace(/\"/gi, '');
		if (first_slider_img !== 'none') {
			$('<img/>').attr('src', first_slider_img).load(function () {
				$(this).remove();
				$('#carousel-home .carousel-inner').animate({opacity: 1});
			});
		} else {
			$('#carousel-home .carousel-inner').animate({opacity: 1});
		}
	}
}

/**
 * Aplica un efecto 'fade in` en los banners principales
 */
function fadeBanner() {
	var first_banner_img = $('.banner-pagina-interior').first().css('background-image');
	if (typeof first_banner_img !== 'undefined') {
		first_banner_img = first_banner_img.replace('url(', '').replace(')', '').replace(/\"/gi, '');
		if (first_banner_img !== 'none') {
			$('<img/>').attr('src', first_banner_img).load(function () {
				$(this).remove();
				$('.banner-pagina-interior').animate({opacity: 1});
			});
		} else {
			$('.banner-pagina-interior').animate({opacity: 1});
		}
	}
}

/**
 * Funcionalidad de cambio de tarifa en la página de tarifas en vista móvil
 */
function initTarifas() {
	$('.tarifas-button').on('click', function (e) {
		e.preventDefault();
		var column = $('.table-tarifas').attr('data-visible-column');
		if ($(this).hasClass('tarifas-button-right')) {
			column++;
		} else {
			column--;
		}
		$('.table-tarifas').attr('data-visible-column', column);
	});
}

/**
 * Calcula y muestra las noches segun los dias seleccionados en los calendarios de reserva.
 */
function setNights(from, to) {
	var noches_el = $('.noches'),
		noches_strs =
		{
			singular: '% ' + window.localeStr.NOCHE,
			plural: '% ' + window.localeStr.NOCHES
		};
	var days = to.diff(from, 'days');
	var output = '';
	if (days === 1) {
		output = noches_strs.singular.replace('%', days);
	} else {
		output = noches_strs.plural.replace('%', days);
	}
	noches_el.text(output);
}

/**
 * Inicializa los calendarios de reserva.
 */
function initBookingCal() {
	var isSingle = false;
	if (window.breakpoint === 'sm' || window.breakpoint === 'xs') {
		isSingle = true;
	}
	$('#bookingrangepicker').dateRangePicker({
		stickyMonths: true,
		language: window.localeStr.lang,
		alwaysOpen: true,
		startDate: new Date(),
		selectForward: false,
		inline: true,
		container: '#bookingrangepicker',
		format: 'D/M/YYYY',
		showTopbar: false,
		startOfWeek: 'monday',
		singleMonth: isSingle,
		setValue: function (s, s1, s2)
		{
			var from = moment(s1, 'D/M/YYYY'),
				to = moment(s2, 'D/M/YYYY');
			setNights(from, to);
			$('#fecha_entrada').val(s1);
			$('#fecha_salida').val(s2);
		},
		hoveringTooltip: false
	});
	$('#bookingrangepicker').data('dateRangePicker').setDateRange(moment().startOf('day').format('D/M/YYYY'), moment().add(1, 'd').format('D/M/YYYY'));
}

$(document).ready(function () {

	init();

	$(window).load(function () {
		blogBlockSize();
	});

	$(window).resize(function () {
		resize();
	});

	/**
	 * Muestra el primer elemento expandido en la página galeria-multimedia (vista móvil).
	 */
	if ($('#page-reserva') && window.breakpoint !== 'xs') {
		$('#fotografias').addClass('in active');
	}

	/**
	 * Plugin para habilitar el 'placeholder' en navegadores obsoletos
	 */
	$('input, textarea').placeholder();

	/**
	 * Clases en diferentes elementos del DOM segun el menú principal esté colapsado o expandido.
	 */
	$('#bs-example-navbar-collapse-1').on('show.bs.collapse', function (e) {
		if ($(this).is(e.target)) {
			$('#main-nav-container').addClass('open');
			$('body').addClass('main-nav-open');
		}
	})
	.on('hidden.bs.collapse', function (e) {
		if ($(this).is(e.target)) {
			$('#main-nav-container').removeClass('open');
			$('body').removeClass('main-nav-open');
		}
	});

	/**
	 * Funcionalidad de colapsación/expansión en la página de galería multimedia (vista móvil)
	 */
	$('#page-reserva').find('.collap-btn').on('click', function (event) {
		var target = $($(this).data('target'));
		var openTabs = $('.tab-pane.in').length;
		if (target.hasClass('in')) {
			target.removeClass('in').slideUp();
		} else if (openTabs > 0) {
			target.removeClass('in').slideUp(400, function () {
				target.addClass('in').slideDown();
			});
		} else {
			target.addClass('in').slideDown();
		}
	});

	/**
	 * Comportamiento de las galerías Blueimp Gallery
	 */
	$('.container-detalle-galeria').on('click', '.gallery-content', function (event) {
		var target = event.target || event.srcElement;
		var type = $(this).parent().data('type');
		var link = $(event.target).parent().parent().index();
		if (type === 'galeria-panoramicas' && window.breakpoint === 'xs') {
			var url = location.href;
			location.href = '#panoramicas-button';
		}
		if (type === 'galeria-videos') {
			event.preventDefault();
			var links = [];
			var galeria_videos = $('#links-videos .galeria');
			$.each(galeria_videos, function (index, value) {
				var id = $(value).data('youtube-id');
				var poster = 'https://img.youtube.com/vi/' + id + '/hqdefault.jpg';
				links.push({
					title: 'Titol',
					href: 'https://www.youtube.com/watch?v=' + id,
					type: 'text/html',
					poster: poster,
					youtube: id
				});
			});
			var options = {event: event, index: link};
		} else if (type === 'galeria-panoramicas' && window.breakpoint === 'xs') {
			event.preventDefault();
			var img = $('<img />');
			img.attr('src', $(target).parent().attr('href'));
			img.on('load', function () {
				$('.panorama').html(img);
			});

			return false;
		} else {
			var options = {
				index: link,
				event: event
			};
			var links = this.getElementsByTagName('a');
		}
		galleryObj = blueimp.Gallery(links, options);
	});

	/**
	 * Botón "Cargar más imágenes"
	 */
	$('.load-images').on('click', function (e) {
		e.preventDefault();
		var type = $(this).data('type');
		loadImages(type, 6);
	});

	/**
	 * Botón "Reservar"
	 */
	$('.b_reservar').click(function () {
		$('body').addClass('reservar-body');
		$('#reservar').fadeIn(400);
	});

	/**
	 * Botón de cierre de ventana reservas
	 */
	$('.b_cerrar_reservas').click(function () {
		$('#reservar').fadeOut(400);
		$('body').removeClass('reservar-body');
	});

	/**
	 * Inicialización de datepickers
	 */
	$('.datetimepicker').datetimepicker({
		locale: window.localeStr.lang,
		ignoreReadonly: true,
		format: date_format,
		minDate: moment().startOf('day'),
		defaultDate: moment().startOf('day'),
		useCurrent: false // Important! See issue #1075
	});

	$('#datetimepicker1').datetimepicker({
		locale: window.localeStr.lang,
		ignoreReadonly: true,
		format: date_format,
		minDate: moment().startOf('day'),
		defaultDate: moment().startOf('day'),
		useCurrent: false // Important! See issue #1075
	});

	$('#datetimepicker2').datetimepicker({
		locale: window.localeStr.lang,
		ignoreReadonly: true,
		format: date_format,
		minDate: moment().startOf('day').add(1, 'd'),
		defaultDate: moment().add(1, 'd'),
		useCurrent: false // Important! See issue #1075
	});

	// Datepicker events
	$('#datetimepicker1').on('dp.change', function (e) {
		var selected = e.date.startOf('day'),
			new_date = moment(selected).add(1, 'd');
		$('#datetimepicker2').val(new_date.format('DD/MM/YYYY')).data('DateTimePicker').minDate(new_date);
		setNights(e.date, $('#datetimepicker2').data('DateTimePicker').viewDate());
	});

	$('#datetimepicker2').on('dp.change', function (e) {
		var selected = e.date.startOf('day');
		$('#datetimepicker1').data('DateTimePicker').maxDate(moment(selected).subtract(1, 'd'));
		setNights($('#datetimepicker1').data('DateTimePicker').viewDate(), e.date);
	});

	/**
	 * Generación de selects segun el numero de huéspedes
	 */
	$('select[name="habitaciones"]').change(function () {
		num = $(this).val();
		codi = '';
		for (i = 1; i <= num; i++) {
			codi += '<div>\
						<div class="titol-habitacion">' + window.localeStr.HABITACION + ' ' + i + '</div>\
						<select class="select01" name="adultos[]">\
							<option value="">' + window.localeStr.ADULTOS + '</option>\
							<option value="1">1 ' + window.localeStr.ADULTO + '</option>\
							<option value="2">2 ' + window.localeStr.ADULTOS + '</option>\
							<option value="3">3 ' + window.localeStr.ADULTOS + '</option>\
							<option value="4">4 ' + window.localeStr.ADULTOS + '</option>\
							<option value="5">5 ' + window.localeStr.ADULTOS + '</option>\
							<option value="6">6 ' + window.localeStr.ADULTOS + '</option>\
							<option value="7">7 ' + window.localeStr.ADULTOS + '</option>\
							<option value="8">8 ' + window.localeStr.ADULTOS + '</option>\
						</select>\
						<select class="select01" name="peques[]">\
							<option value="">' + window.localeStr.NINOS + '</option>\
							<option value="1">1 ' + window.localeStr.NINO + '</option>\
							<option value="2">2 ' + window.localeStr.NINOS + '</option>\
							<option value="3">3 ' + window.localeStr.NINOS + '</option>\
							<option value="4">4 ' + window.localeStr.NINOS + '</option>\
							<option value="5">5 ' + window.localeStr.NINOS + '</option>\
							<option value="6">6 ' + window.localeStr.NINOS + '</option>\
							<option value="7">7 ' + window.localeStr.NINOS + '</option>\
							<option value="8">8 ' + window.localeStr.NINOS + '</option>\
						</select>\
						<select class="select01" name="bebes[]">\
							<option value="">' + window.localeStr.BEBES + '</option>\
							<option value="1">1 ' + window.localeStr.BEBE + '</option>\
							<option value="2">2 ' + window.localeStr.BEBES + '</option>\
							<option value="3">3 ' + window.localeStr.BEBES + '</option>\
							<option value="4">4 ' + window.localeStr.BEBES + '</option>\
							<option value="5">5 ' + window.localeStr.BEBES + '</option>\
							<option value="6">6 ' + window.localeStr.BEBES + '</option>\
							<option value="7">7 ' + window.localeStr.BEBES + '</option>\
							<option value="8">8 ' + window.localeStr.BEBES + '</option>\
						</select>\
						<div class="clear"></div>\
						<div class="edad_peques clearfix"></div>\
					</div>';
		}
		$('.habitaciones').html(codi);

		/**
		 * Generación de selects segun el numero de niños
		 */
		$('select[name="peques[]"]').change(function () {
			num = $(this).val();
			codi = '';
			for (i = 1; i <= num; i++) {
				codi += '<div class="children">\
							<div class="titol-habitacion">' + window.localeStr.NINO_CAP + ' ' + i + '</div>\
							<select class="select01" name="edad_peque[]">\
								<option value="">' + window.localeStr.EDAD + '</option>\
								<option value="2">2 ' + window.localeStr.ANOS + '</option>\
								<option value="3">3 ' + window.localeStr.ANOS + '</option>\
								<option value="4">4 ' + window.localeStr.ANOS + '</option>\
								<option value="5">5 ' + window.localeStr.ANOS + '</option>\
								<option value="6">6 ' + window.localeStr.ANOS + '</option>\
								<option value="7">7 ' + window.localeStr.ANOS + '</option>\
								<option value="8">8 ' + window.localeStr.ANOS + '</option>\
								<option value="9">9 ' + window.localeStr.ANOS + '</option>\
								<option value="10">10 ' + window.localeStr.ANOS + '</option>\
								<option value="11">11 ' + window.localeStr.ANOS + '</option>\
								<option value="12">12 ' + window.localeStr.ANOS + '</option>\
							</select>\
						</div>';
			}
			$(this).parent().find('.edad_peques').html(codi);
		});

	});

	$('.b_scroll').click(function () {
		$('html, body').animate({scrollTop: $('#section-content').offset().top}, 1000);
	});

	$('.b_volver_arriba').click(function () {
		$('html, body').animate({scrollTop: 0}, 1000);
	});

});

/**
 * Inicialización del mapa
 */
var map;
function initMap() {
	var location = {lat: 38.4948313, lng: -0.2713278};
	var options = {
		center: location,
		zoom: 13,
		streetViewControl: false,
		mapTypeControl: false
	};
	options.draggable = (window.breakpoint === 'lg');

	map = new google.maps.Map(document.getElementById('map'), options);
	var marker = new google.maps.Marker({
		position: location,
		map: map
	});

}

/**
 * Carga asíncrona del script de Google Maps
 */
function loadMapsScript(callback) {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	if (callback) {
		if (isOldIE) {
			script.onreadystatechange = function () {
				if (this.readyState === 'complete') {
					setTimeout(callback, 1500);
				}
			};
		}
		script.onload = callback;
	}
	document.getElementsByTagName('head')[0].appendChild(script);
	script.src = 'https://maps.googleapis.com/maps/api/js';
}

/**
 * Lazy load en iframes.
 */
function createIframe(url, selector) {
	if (!isOldIE) {
		var iframe = $('<iframe />');
		iframe.attr('src', url);
		iframe.attr('frameborder', 0);
		iframe.attr('allowfullscreen', true);
		iframe.addClass('detail-video');
	}
	$(selector).append(iframe);
	return iframe;
}
