$(document).ready(function() {

    $.ajax({
        url: `/chores/`,
        type: 'GET',
        success: function(result) {
            console.log(result);
            result.map((el, index) => {
                console.log('index', index)
                $('#tbody')
                // .append('<tr scope="row"><td><input id="selected" type="checkbox"></td><td>'+el.title+'</td><td>'+el.description+'</td><td>'+el.priority+'</td></tr>');
                .append('<tr scope="row"><td><input class="checkbox" id="listItem'+ index + '" type="checkbox"></td><td><label for="listItem'+ index + '">'+el.title+'</label></td><td>'+el.description+'</td><td>'+el.priority+'</td></tr>');

                $('tr:last').attr("data-id", el.id);
            })
        },
        error: function(err) {
            console.log(err);
        }
    });

    $('#create').click(function() {
        event.preventDefault();
        $('main').css("visibility", "hidden");
        $('#newForm').css("visibility", "visible");
    })

    $('#createNew').click(function() {
        event.preventDefault();
        let newTitle = $('#newTitle').val();
        let newDescription = $('#newDescription').val();
        let newPriority = $('#newPriority').val();

        $.ajax({
            url: `/chores/`,
            type: 'POST',
            data: {
                title: newTitle,
                description: newDescription,
                priority: newPriority
            },
            success: function(result) {
                location.reload();
                $('#newForm').css("visibility", "hidden");
            },
            error: function(err) {
                console.log(err)
            }
        })
    })

    $('#edit').click(function() {
        event.preventDefault();
        let ids = [];

        $('#tbody').find('input[type="checkbox"]:checked').each(function () {
            let id = $(this).closest('tr').attr("data-id");
            ids.push(id)
         });
         if (ids.length > 1) {
             alert("Please choose just one chore");
             ids.length = 0;
             $('.checkbox').prop('checked', false);
         } else {
            let selectedId = ids[0];
            $('main').css("visibility", "hidden");
            $('#editForm').css("visibility", "visible");
            $('#editForm').attr("data-id", selectedId);
        
            $.ajax({
                url: `/chores/${selectedId}`,
                type: 'GET',
                success: function(result) {
                    console.log(result);
                    $('#editTitle').attr("value", result.title);
                    $('#editDescription').attr("value", result.description);
                    $('#editPriority').attr("value", result.priority);
                },
                error: function(err) {
                    console.log(err)
                }
            })

         }
    })

    $('#newEdit').click(function() {
        event.preventDefault();

        let id = $('#editForm').attr("data-id");
        let newTitle = $('#editTitle').val();
        let newDescription = $('#editDescription').val();
        let newPriority = $('#editPriority').val();

        $.ajax({
            url: `/chores/${id}`,
            type: 'PUT',
            data: {
                id: id,
                title: newTitle,
                description: newDescription,
                priority: newPriority
            },
            success: function(result) {
                location.reload();
                $('#editForm').css("visibility", "hidden");
            },
            error: function(err) {
                console.log(err)
            }
        })
    })

    $('#delete').click(function() {
        event.preventDefault();

        $('#tbody').find('input[type="checkbox"]:checked').each(function () {
            let id = $(this).closest('tr').attr("data-id");
            // ids.push(id)
            $.ajax({
                url: `/chores/${id}`,
                type: 'DELETE',
                success: function(result) {
                    location.reload();
                },
                error: function(err) {
                    console.log(err)
                }
            })
         });

         
    })
});