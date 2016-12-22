var total = $(selector).length,
    loaded = 0,
    loading = 0;

function updateProgress() {
    $('#progress').css('width', (loading * 100 / total) + '%');
    $('#progress').val(loaded * 100 / loading);
};

$(selector).unveil({
    offset: 400,
    placeholder: 'http://placehold.it/400x300/C8D3DC?text=placeholder',
    throttle: 200,
    breakpoints: [
        {
            minWidth: 375,
            attribute: 'data-src'
        },
        {
            minWidth: 768,
            attribute: 'data-src-lg'
        }
    ]
}).on('loading.unveil', function () {
    updateProgress(loading++);
}).on('loaded.unveil', function () {
    updateProgress(loaded++);
});