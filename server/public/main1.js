$(document).ready(() => {

    //to be called on page load
    const init = () => {
        const listItems = []
        fetchListData();
        addEventListenersToPage();
    };

    const addEventListenersToPage = () => {
        openNewForm();
        createNewItem();
        selectListItemToEdit();
        updateListItem();
        deleteListItem();
    };

    //builds the table with items from database
    const buildTable = (result) => {
        let sortedList = sortListItemsByPriority(result);
        emptyTable();
        sortedList.map((el, index) => {
            $('#tbody')
            .append('<tr scope="row"><td><input class="checkbox" id="listItem'+ index + '" type="checkbox"></td><td><label for="listItem'+ index + '">'+el.title+'</label></td><td>'+el.description+'</td><td>'+el.priority+'</td></tr>');
            $('tr:last').attr("data-id", el.id);
        })
    };

    //go back to main view from new or edit
    const cancelNewOrEdit = () => {
        $('.cancel').click(() => {
            showMain();
        })
    }

    //sorts items in list by priority
    const compareItemsForSort = (a, b) => {
        if (a.priority < b.priority)
            return -1;
        if (a.priority > b.priority)
            return 1;
        return 0;
    };

    //post request when new item is created
    const createNewItem = () => {
        $('#createNew').click(() => {
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
                    success: (result) => {
                        location.reload();
                    },
                    error: () => {
                        showErrorMessage()
                    }
                })
            }
        })
    };

    //delete an existing item
    const deleteListItem = () => {
        $('#delete').click(() => {
            event.preventDefault();
    
            $('#tbody').find('input[type="checkbox"]:checked').each(() => {
                let id = $(this).closest('tr').attr("data-id");
                
                $.ajax({
                    url: `/chores/${id}`,
                    type: 'DELETE',
                    success: () => {
                        location.reload()
                    },
                    error: () => {
                        showErrorMessage()
                    }
                })
             });  
        })
    };

    //empties table of all data
    const emptyTable = () => {
        $("#tbody").html("");
    };

    //get request to fetch all list data
    const fetchListData = () => {
        $.ajax({
            url: `/chores/`,
            type: 'GET',
            success: (result) => {
                listItems = result,
                buildTable(result)
            },
            error: () => {
                showErrorMessage()
            }
        });
    };

    //get one item by id
    const fetchListItem = (id) => {
        $.ajax({
            url: `/chores/${id}`,
            type: 'GET',
            success: (result) => {
                populateEditForm(result)
            },
            error: () => {
                showErrorMessage()
            }
        })
    };

    //hides main view and opens a create new view
    const hideMainOpenNew = () => {
        $('main').css("visibility", "hidden");
        $('#newForm').css("visibility", "visible");
    };

    //form for adding a new item to list
    const openNewForm = () => {
        $('#create').click(() => {
            event.preventDefault();
            hideMainOpenNew();
        })
    };

    //populates edit view with current data for one item
    const populateEditForm = (result) => {
        $('#editTitle').attr("value", result.title);
        $('#editDescription').attr("value", result.description);
        $('#editPriority').attr("value", result.priority);
    };

    //handles click function to select one item from list to be edited
    const selectListItemToEdit = () => {
        $('#edit').click(() => {
            event.preventDefault();
            let ids = [];
    
            $('#tbody').find('input[type="checkbox"]:checked').each(() => {
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

    //a work in progress, was trying to add a nicer ui experience for error handling
    // const showErrorMessage = () => {
    //     showMain();
    //     emptyTable();
    //     $('#tbody').append('<span class="errorMessage">Oops! Something went wrong..."</span>');
    // };

    //hoping to add a spinner/loading message for slow browsers
    // const showLoadingMessage = () => {
    //     emptyTable();
    //     ('#tbody').append('<span class="loadingMessage">Loading..."</span>');
    // };

    //same as above
    // const removeLoadingMessage = () => {
    //     emptyTable();
    // };

    //goes from new or edit views back to main
    const showMain = () => {
        $('main').css("visibility", "visible");
        $('#newForm').css("visibility", "hidden");
        $('#editForm').css("visibility", "hidden");
    };

    //calls compare function for priority sort
    const sortListItemsByPriority = (result) => {
        return result.sort(compareItemsForSort);
    };

    //put request to update a list item
    const updateListItem = () => {
        $('#newEdit').click(() => {
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
                    success: () => {
                        location.reload();
                    },
                    error: () => {
                        showErrorMessage()
                    }
                })
            }
        })
    };

    init();
});