$('table').on('click', '.deleteBtn', function () {

    let row = $(this).closest('tr');
    let id = row.find('id').txt();

    $.ajax({
        url: "/delete-row/" + id,
        method: 'DELETE',
        contentType: "application/json",
        type: "POST",
        success: function (response) {
            console.log("Deleted? Maybe");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $("#root").text(jqXHR.statusText);
            console.log("ERROR:", jqXHR, textStatus, errorThrown);
        }
    });
});