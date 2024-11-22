$(document).ready(function () {

    $.ajax({
        method: 'GET',
        url: './actions/all.php',
        dataType: 'json',
        success: (res) => {
            console.log(res)
            res.data.map((item, ind) => {
                let crossOutImg = ""
                if (item.isDone == 1) {
                    crossOutImg = '<img src="/images/crossout.png" class="crossout" style="width: 100%; display: block;" />'
                }
                $('#list').append(
                    `
                        <li color=${item.color} class="${item.color == 1 ? 'colorBlue' : item.color} list" rel=${ind} id=${item.id} style="${item.isDone == 1 ? "opacity: 0.5;" : ""}" draggable="true">
                            <span id="${item.id}listitem" title="Double-click to edit..." style="background-color: ${item.color != 1 ? item.color : ""}">${item.description} ${crossOutImg}</span>
                            <div class="draggertab tab"></div>
                            <div class="colortab tab"></div>
                            <div class="deletetab tab" title="Double click to delete"></div>
                            <div class="donetab tab"></div>
                        </li>
                    `
                )
            })
        },
        error: function (err) {
            console.log(err)
        }
    })

    $('#add-new').submit(function (e) {
        e.preventDefault()
        let formData = $(this).serialize();

        $.ajax({
            method: "POST",
            url: "./actions/create.php",
            data: formData,
            dataType: "json",
            success: (response) => {
                console.log(response)
                if (response.success) {
                    Toastify({
                        text: response.message,
                        duration: 3000,
                        stopOnFocus: true,
                        position: "center",
                        style: {
                            borderRadius: "10px",
                        },
                        offset: {
                            y: 30
                        },
                    }).showToast();

                    let rel = $('#list .list').length
                    $('#list').append(
                        `
                        <li color="1" class="colorBlue list" rel=${rel} id=${response.data.id} draggable="true">
                            <span id="${response.data.id}listitem" title="Double-click to edit...">${response.data.description}</span>
                            <div class="draggertab tab"></div>
                            <div class="colortab tab"></div>
                            <div class="deletetab tab" title="Double click to delete"></div>
                            <div class="donetab tab"></div>
                        </li>
                        `
                    )

                    $('#add-new')[0].reset()
                } else if (!response.success) {
                    Toastify({
                        text: response.message,
                        duration: 3000,
                        stopOnFocus: true,
                        position: "right",
                        backgroundColor: "red",
                        style: {
                            borderRadius: "10px",
                        },
                        offset: {
                            y: 30
                        },
                    }).showToast();
                }
            }
        });
    })

    $('#list').on('mouseenter', '.deletetab', function () {
        $(this).css({
            width: '44px',
            display: 'block',
            right: '-64px'
        });
    }).on('mouseleave', '.deletetab', function () {
        $(this).css({
            width: '',
            display: '',
            right: ''
        });
    });

    $('#list').on('dblclick', '.donetab', function () {
        let list = $(this).closest('.list');
        let span = list.find('span')
        let rowId = list.attr('id')
        if (span.find('img').length > 0) {
            return;
        }

        $.ajax({
            method: 'POST',
            url: 'actions/update.php?id=' + rowId,
            data: {
                isDone: 1
            },
            dataType: 'json',
            success: function (res) {
                console.log(res)
                list.css({
                    opacity: '0.5'
                })
                span.append(
                    `
                        <img src="/images/crossout.png" class="crossout" style="width: 100%; display: block;" />
                    `
                )
            }
        })
    })

    $('#list').on('dblclick', '.deletetab', function () {
        let list = $(this).closest('.list');
        let rowId = list.attr('id')
        $.ajax({
            method: 'DELETE',
            url: 'actions/delete.php?id=' + rowId,
            dataType: 'json',
            success: function (res) {
                Toastify({
                    text: res.message,
                    duration: 3000,
                    stopOnFocus: true,
                    position: "right",
                    style: {
                        borderRadius: "10px",
                    },
                    offset: {
                        y: 30
                    },
                }).showToast();

                list.remove();
            }
        })
    });

    $('#list').on('dblclick', 'span', function () {
        let spanValue = $(this).text();
        $(this).html(
            `
                <input type="text" class="editDescription" value=${spanValue} />
                <button class="saveBtn">Save</button>
            `
        )
    });

    $('#list').on('click', '.saveBtn', function () {
        let row = $(this).closest('.list')
        let rowId = row.attr('id')
        let inputVal = row.find('.editDescription').val()
        row.find('span').html(inputVal)

        $.ajax({
            method: 'POST',
            url: 'actions/update.php?id=' + rowId,
            data: {
                description: inputVal
            },
            dataType: 'json',
            success: function (res) {
                console.log(res)
                Toastify({
                    text: res.message,
                    duration: 3000,
                    stopOnFocus: true,
                    position: "right",
                    style: {
                        borderRadius: "10px",
                    },
                    offset: {
                        y: 30
                    },
                }).showToast();
            }
        })
    })

    $('#list').on('dragover', function (e) {
        e.preventDefault()
        let elem = e.target
        if ($(elem).hasClass('list')) {
            let html = $('<div class="drag-indicator"></div>');
            html.css({
                border: '2px dashed skyblue',
                margin: '5px 0',
                height: '5px',
                backgroundColor: 'transparent',
            });

            if (!$(elem).next().hasClass('drag-indicator')) {
                $(elem).after(html);
            }
        }
    })

    $("#list").on('dragleave', function (e) {
        e.preventDefault()
        $('.drag-indicator').remove()
    })

    $('#list').on('drop', function (e) {
        e.preventDefault()
        let dropEl = $(e.target);

        if (!dropEl.hasClass('list')) {
            return
        }

        let draggedId = e.originalEvent.dataTransfer.getData('text/plain');
        let draggedItem = $("#" + draggedId);

        dropEl.after(draggedItem)
        $('.drag-indicator').remove()
    })

    $('#list').on('dragstart', '.list', function (e) {
        let draggedId = $(this).attr('id');
        e.originalEvent.dataTransfer.setData('text/plain', draggedId);
    });

    $('#list').on('click', '.colortab', function () {
        let rowId = $(this).closest('.list').attr('id')
        if ($(this).find('.colorpicker').length == 0) {
            let colorPicker = $('<input class="colorpicker" type="color" />')
            $(this).append(colorPicker)

            let colorVal;

            colorPicker.on('input', function () {
                colorVal = $(this).val()
                console.log(colorVal)
                $(this).closest('li').find('span').css({
                    background: colorVal
                })
            })

            colorPicker.on('change', function () {
                $.ajax({
                    method: 'POST',
                    url: 'actions/update.php?id=' + rowId,
                    data: {
                        color: colorVal
                    },
                    dataType: 'json',
                    success: function (res) {
                        console.log(res)
                    }
                })
                $(this).remove();
            });
        }
    })

})