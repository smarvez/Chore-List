$(document).ready(function() {

    //$('#tbody').append('<span #loading> loading... </span.')
    // append loading span with id when you make the call
    // remove it on success or failure
    // addLoader() - gets called in every method with an ajax request
    // removeLoader() - gets called on success or failure

    function init() {

        const listItems = []
        fetchListData();
        addEventListenersToPage();
    };

    function addEventListenersToPage() {
        openNewForm();
        createNewItem();
        selectListItemToEdit();
        updateListItem();
        deleteListItem();
    };

    function buildTable(result) {
        let sortedList = sortListItemsByPriority(result);
        emptyTable();
        sortedList.map((el, index) => {
            $('#tbody')
            .append('<tr scope="row"><td><input class="checkbox" id="listItem'+ index + '" type="checkbox"></td><td><label for="listItem'+ index + '">'+el.title+'</label></td><td>'+el.description+'</td><td>'+el.priority+'</td></tr>');
            $('tr:last').attr("data-id", el.id);
        })
    };

    function cancelNewOrEdit(){
        $('.cancel').click(function() {
            showMain();
        })
    }

    function compareItemsForSort(a, b) {
        if (a.priority < b.priority)
            return -1;
        if (a.priority > b.priority)
            return 1;
        return 0;
    };

    function createNewItem() {
        $('#createNew').click(function() {
            event.preventDefault();
            cancelNewOrEdit();

            let newTitle = $('#newTitle').val();
            let newDescription = $('#newDescription').val();
            let newPriority = $('#newPriority').val();
    
            if (newTitle == '' || newTitle == undefined) {
                alert("Please enter a valid title");
            } else {
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
                    },
                    error: function() {
                        showErrorMessage()
                    }
                })
            }
        })
    };

    function deleteListItem() {
        $('#delete').click(function() {
            event.preventDefault();
    
            $('#tbody').find('input[type="checkbox"]:checked').each(function () {
                let id = $(this).closest('tr').attr("data-id");
                
                $.ajax({
                    url: `/chores/${id}`,
                    type: 'DELETE',
                    success: function() {
                        location.reload()
                    },
                    error: function() {
                        showErrorMessage()
                    }
                })
             });  
        })
    };

    function emptyTable() {
        $("#tbody").html("");
    };

    function fetchListData() {
        $.ajax({
            url: `/chores/`,
            type: 'GET',
            success: buildTable(result),
            error: function() {
                showErrorMessage()
            }
        });
    };

    function fetchListItem(id) {
        $.ajax({
            url: `/chores/${id}`,
            type: 'GET',
            success: function(result) {
                populateEditForm(result)
            },
            error: function() {
                showErrorMessage()
            }
        })
    };

    function hideMainOpenNew() {
        $('main').css("visibility", "hidden");
        $('#newForm').css("visibility", "visible");
    };

    function openNewForm() {
        $('#create').click(function() {
            event.preventDefault();
            hideMainOpenNew();
        })
    };

    function populateEditForm(result) {
        $('#editTitle').attr("value", result.title);
        $('#editDescription').attr("value", result.description);
        $('#editPriority').attr("value", result.priority);
    };

    function selectListItemToEdit() {
        $('#edit').click(function() {
            event.preventDefault();
            let ids = [];
    
            $('#tbody').find('input[type="checkbox"]:checked').each(function () {
                let id = $(this).closest('tr').attr("data-id");
                ids.push(id)
             });
             if (ids.length == 0) {
                 alert("Please select an item to edit");
             } else if (ids.length > 1) {
                alert("Please choose just one chore");
                ids.length = 0;
                $('.checkbox').prop('checked', false);
            } else {
               let selectedId = ids[0];
               $('main').css("visibility", "hidden");
               $('#editForm').css("visibility", "visible");
               $('#editForm').attr("data-id", selectedId);
               fetchListItem(selectedId) 
            }
        })
    };

    function showErrorMessage() {
        showMain();
        emptyTable();
        $('#tbody').append('<span class="errorMessage">Oops! Something went wrong..."</span>');
    };

    function showLoadingMessage() {
        emptyTable();
        ('#tbody').append('<span class="loadingMessage">Loading..."</span>');
    };

    function removeLoadingMessage() {
        emptyTable();
    };

    function showMain() {
        $('main').css("visibility", "visible");
        $('#newForm').css("visibility", "hidden");
        $('#editForm').css("visibility", "hidden");
    };

    function sortListItemsByPriority(result) {
        return result.sort(compareItemsForSort);
    };

    function updateListItem() {
        $('#newEdit').click(function() {
            event.preventDefault();
            cancelNewOrEdit();
    
            let id = $('#editForm').attr("data-id");
            let newTitle = $('#editTitle').val();
            let newDescription = $('#editDescription').val();
            let newPriority = $('#editPriority').val();

            if (newTitle == '' || newTitle == undefined) {
                alert("Please enter a valid title");
            } else {
                $.ajax({
                    url: `/chores/${id}`,
                    type: 'PUT',
                    data: {
                        id: id,
                        title: newTitle,
                        description: newDescription,
                        priority: newPriority
                    },
                    success: function() {
                        location.reload();
                    },
                    error: function() {
                        showErrorMessage()
                    }
                })
            }
        })
    };

    init();
});