$(document).ready(function () {

    $.ajax({
        method: 'GET',
        url: './actions/all.php',
        dataType: 'json',
        success: (res) => {
            console.log(res)
            res.data.map((item, ind) => {
                $('#list').append(
                    `
                        <li color=${item.color} class="colorBlue list" rel="4" id=${item.id} draggable="true">
                            <span id="${item.id}listitem" title="Double-click to edit...">${item.description}</span>
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
        list.css({
            opacity: '0.5'
        })
        span.append(
            `
                <img src="/images/crossout.png" class="crossout" style="width: 100%; display: block;" />
            `
        )
    })

    $('#list').on('dblclick', '.deletetab', function () {
        let list = $(this).closest('.list');
        list.remove();
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
        console.log("Save");
    })

    $('#list').on('dragover', function (e) {
        e.preventDefault()
    })

    $("#list").on('dragleave', function (e) {
        e.preventDefault()
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
    })

    $('#list').on('dragstart', '.list', function (e) {
        let draggedId = $(this).attr('id'); 1
        e.originalEvent.dataTransfer.setData('text/plain', draggedId);
    });

})