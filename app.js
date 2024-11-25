$(document).ready(function () {
    $('#loader').show()

    // getting all data of the todo list
    $.ajax({
        method: 'GET',
        url: './actions/all.php',
        dataType: 'json',
        success: (res) => {
            $('#loader').hide()
            console.log(res)
            if (res.success) {
                res.data.map((item, ind) => {
                    let crossOutImg = ""
                    if (item.isDone == 1) {
                        crossOutImg = '<img src="/images/crossout.png" class="crossout" style="width: 100%; display: block;" />'
                    }
                    $('#list').append(
                        `
                            <li color=${item.color} class="${item.color == 1 ? 'colorBlue' : item.color} list" rel=${ind} id=${item.id} style="${item.isDone == 1 ? "opacity: 0.5;" : ""}">
                                <span id="${item.id}listitem" title="Double-click to edit..." style="background-color: ${item.color != 1 ? item.color : ""}">${item.description} ${crossOutImg}</span>
                                <div class="draggertab tab"></div>
                                <div class="colortab tab"></div>
                                <div class="deletetab tab" title="Double click to delete"></div>
                                <div class="donetab tab"></div>
                            </li>
                        `
                    )
                })
            } else if (!res.success) {
                // Showing message if not success
                $('#list').append(
                    `
                        <li class="colorRed list">${res.message}</li>
                    `
                )
            }
        },
        error: function (err) {
            console.log(err)
        }
    })

    $("#list").sortable({
        axis: 'y',
        update: function (e, ui) {

            var data = $(this).sortable('serialize');
            console.log("Serialized Data: ", data);
        }
    });

    // Adding new todo
    $('#add-new').submit(function (e) {
        e.preventDefault()
        $('#add-new-submit').attr('disabled', true).html($('#loader').show())
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
                        <li color="1" class="colorBlue list" rel=${rel} id=${response.data.id}>
                            <span id="${response.data.id}listitem" title="Double-click to edit...">${response.data.description}</span>
                            <div class="draggertab tab"></div>
                            <div class="colortab tab"></div>
                            <div class="deletetab tab" title="Double click to delete"></div>
                            <div class="donetab tab"></div>
                        </li>
                        `
                    )

                    $('#add-new')[0].reset()
                    $('#add-new-submit').attr('disabled', false).html('Add')
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
                    $('#add-new-submit').attr('disabled', false).html('Add')
                }
            },
            error: function (xhr, status, err) {
                console.error(status, err)

                Toastify({
                    text: "Error while adding",
                    duration: 3000,
                    stopOnFocus: true,
                    position: "center",
                    style: {
                        background: "red",
                        borderRadius: "10px",
                    },
                    offset: {
                        y: 30
                    },
                }).showToast();
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
        if (!rowId) return
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
                if (res.success) {
                    list.css({
                        opacity: '0.5'
                    })
                    span.append(
                        `
                            <img src="/images/crossout.png" class="crossout" style="width: 100%; display: block;" />
                        `
                    )
                } else if (!res.success) {
                    Toastify({
                        text: res.message,
                        duration: 3000,
                        stopOnFocus: true,
                        position: "center",
                        style: {
                            background: "red",
                            borderRadius: "10px",
                        },
                        offset: {
                            y: 30
                        },
                    }).showToast();
                }
            },
            error: function (xhr, status, err) {
                console.error(status, err)
                Toastify({
                    text: "Error while updaing",
                    duration: 3000,
                    stopOnFocus: true,
                    position: "center",
                    style: {
                        background: "red",
                        borderRadius: "10px",
                    },
                    offset: {
                        y: 30
                    },
                }).showToast();
            }
        })
    })

    $('#list').on('dblclick', '.deletetab', function () {
        let list = $(this).closest('.list');
        let rowId = list.attr('id')
        if (!rowId) return
        $('#loader').show()
        $.ajax({
            method: 'DELETE',
            url: 'actions/delete.php?id=' + rowId,
            dataType: 'json',
            success: function (res) {
                if (res.success) {
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

                    $('#loader').hide()
                    list.remove();
                } else if (!res.success) {
                    Toastify({
                        text: res.message,
                        duration: 3000,
                        stopOnFocus: true,
                        position: "right",
                        style: {
                            background: "red",
                            borderRadius: "10px",
                        },
                        offset: {
                            y: 30
                        },
                    }).showToast();
                    $('#loader').hide()
                }
            },
            error: function (xhr, status, err) {
                console.error(status, err)
                Toastify({
                    text: 'Error while deleting',
                    duration: 3000,
                    stopOnFocus: true,
                    position: 'center',
                    style: {
                        background: 'red',
                        borderRadius: '10px',
                    },
                    offset: { y: 30 },
                }).showToast();
            }
        })
    });

    $('#list').on('dblclick', 'span', function () {
        let spanValue = $(this).text();
        if (!spanValue) return
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
        if (!rowId) {
            return
        }
        let inputVal = row.find('.editDescription').val()
        row.find('span').html(inputVal)
        $(this).attr('disabled', true).html(
            $('#loader').show()
        );

        $.ajax({
            method: 'POST',
            url: 'actions/update.php?id=' + rowId,
            data: {
                description: inputVal
            },
            dataType: 'json',
            success: function (res) {
                console.log(res)
                if (res.success) {
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
                    $(this).attr('disabled', false).html(
                        `<button class="saveBtn">Save</button>`
                    );
                } else if (!res.success) {
                    Toastify({
                        text: res.message,
                        duration: 3000,
                        stopOnFocus: true,
                        position: "right",
                        style: {
                            background: "red",
                            borderRadius: "10px",
                        },
                        offset: {
                            y: 30
                        },
                    }).showToast();
                    $(this).attr('disabled', false).html(
                        `<button class="saveBtn">Save</button>`
                    );
                }
            },
            error: function (xhr, status, err) {
                console.error(status, err)
                Toastify({
                    text: 'Error while updating...',
                    duration: 3000,
                    stopOnFocus: true,
                    position: 'center',
                    style: {
                        background: 'red',
                        borderRadius: '10px',
                    },
                    offset: { y: 30 },
                }).showToast();
            }
        })
    })

    // $('#list').on('dragover', function (e) {
    //     e.preventDefault()
    //     let elem = e.target
    //     if ($(elem).hasClass('list')) {
    //         let html = $('<div class="drag-indicator"></div>');
    //         html.css({
    //             border: '2px dashed skyblue',
    //             margin: '5px 0',
    //             height: '5px',
    //             backgroundColor: 'transparent',
    //         });

    //         if (!$(elem).next().hasClass('drag-indicator')) {
    //             $(elem).after(html);
    //         }
    //     }
    // })

    // $("#list").on('dragleave', function (e) {
    //     e.preventDefault()
    //     $('.drag-indicator').remove()
    // })

    // $('#list').on('drop', function (e) {
    //     e.preventDefault();
    //     let dropEl = $(e.target);

    //     if (!dropEl.hasClass('list')) {
    //         return;
    //     }

    //     let draggedId = e.originalEvent.dataTransfer.getData('text/plain');
    //     if (!draggedId) return;
    //     let draggedItem = $("#" + draggedId);

    //     // Get the new position of the item in the list
    //     let newPosition = getPositionInList(draggedItem);

    //     $.ajax({
    //         method: 'POST',
    //         url: 'actions/update.php?id=' + draggedId,
    //         dataType: 'json',
    //         data: {
    //             id: draggedId,
    //             itemPosition: newPosition
    //         },
    //         success: function (res) {
    //             if (res.success) {
    //                 Toastify({
    //                     text: res.message,
    //                     duration: 3000,
    //                     stopOnFocus: true,
    //                     position: "right",
    //                     style: {
    //                         borderRadius: "10px",
    //                     },
    //                     offset: {
    //                         y: 30
    //                     },
    //                 }).showToast();
    //                 dropEl.after(draggedItem);
    //             } else if (!res.success) {
    //                 Toastify({
    //                     text: res.message,
    //                     duration: 3000,
    //                     stopOnFocus: true,
    //                     position: "right",
    //                     style: {
    //                         background: "red",
    //                         borderRadius: "10px",
    //                     },
    //                     offset: {
    //                         y: 30
    //                     },
    //                 }).showToast();
    //             }
    //         }
    //     })
    //     $('.drag-indicator').remove();
    // });

    // get the position of the item in the list
    // function getPositionInList(draggedItem) {
    //     let listItems = $('#list .list');
    //     return listItems.index(draggedItem) + 1;
    // }

    // $('#list').on('dragstart', '.list', function (e) {
    //     let draggedId = $(this).attr('id');
    //     e.originalEvent.dataTransfer.setData('text/plain', draggedId);
    // });

    $('#list').on('click', '.colortab', function () {
        let rowId = $(this).closest('.list').attr('id')
        if (!rowId) return;
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
                        if (res.success) {
                            Toastify({
                                text: res.message,
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

                            $('.colorpicker').remove();

                        } else if (!res.success) {
                            Toastify({
                                text: res.message,
                                duration: 3000,
                                stopOnFocus: true,
                                position: "center",
                                style: {
                                    background: "red",
                                    borderRadius: "10px",
                                },
                                offset: {
                                    y: 30
                                },
                            }).showToast();
                        }
                    },
                    error: function (xhr, status, err) {
                        console.error(status, err)
                        Toastify({
                            text: 'Error updating color',
                            duration: 3000,
                            stopOnFocus: true,
                            position: 'center',
                            style: {
                                background: 'red',
                                borderRadius: '10px',
                            },
                            offset: { y: 30 },
                        }).showToast();
                    }
                })
            });
        }
    })
})