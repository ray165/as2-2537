$(document).ready(function () {
  console.log("hello world!");

  function readTable() {
    $.ajax({
      url: "/read-table",
      dataType: "json",
      type: "GET",
      success: function (data) {
        console.log("SUCCESS JSON ARRAY:", data);
        // for loop to build the table
        let str = `<table class="table table-striped" id="dataTable"><tr>
              <th class="id_header"><span>ID</span></th>
              <th class="name_header"><span>Name</span></th>
              <th class="contactNumber_header"><span>Contact Number</span></th>
              <th class="bottlesDonated_header"><span>Bottles Donated</span></th>
              <th class="bottlesTaken_header"><span>Bottles Taken</span></th>
              <th class="address_header"><span>Address</span></th>
              <th class="deleteRow"><span>Delete Row</span></th>
            </tr>`;
        // console.log(data[0]);
        for (let i = 0; i < data.length; i++) {
          let row = data[i];
          // console.log("row", row);
          str +=
            "<tr><td class='id'>" +
            row._id +
            "</td><td class='name'><span>" +
            row.name +
            "</span></td><td class='contactNumber'><span>" +
            row.contactNumber +
            "</span></td><td class='bottlesDonated'><span>" +
            row.bottlesDonated +
            "</span></td><td class='bottlesTaken'><span>" +
            row.bottlesTaken +
            "</span></td><td class='address'><span>" +
            row.address +
            "</span></td><td class='deleteBtn'>" +
            `<button type="button" class="delete-button" id="${row._id}">Delete Row</button></td>`;
        }
        str += "</tr></table>";
        $("#root").html(str);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#root").text(jqXHR.statusText);
        console.log("ERROR:", jqXHR, textStatus, errorThrown);
      },
    });
  }
  readTable();

  // *******************************
  // UPDATE SECITON INDIVIDUAL CELLS
  // *******************************
  $(document).on("click", "span", function () {
    if (
      $(this).parent().attr("class") === "address" ||
      $(this).parent().attr("class") === "name" ||
      $(this).parent().attr("class") === "contactNumber" ||
      $(this).parent().attr("class") === "bottlesTaken" ||
      $(this).parent().attr("class") === "bottlesDonated"
    ) {
      let spanText = $(this).text();
      let td = $(this).parent();
      let clickedClass = $(this).parent().attr("class");
      let input = $("<input type='text' class=" + `${td.attr("class")}` + " value='" + spanText + "'>");

      td.html(input);
      console.log(td.html());
      $(input).keyup(function (e) {
        let val = null;
        let span = null;
        if (e.which == 13) {
          //console.log(td);

          val = $(input).val();
          span = $("<span>" + val + "</span>");
          td.html(span);
          // lastly, send the update:

          console.log("The class name of the column", clickedClass);

          //Record the ObjectID of the user we are updating
          let inputID = (td.parent().find("[class='id']").text());
          
          // All i need is to get the ID, the class name of the id and its new value then send it over in a json object
          let updatedData = {
            "id": inputID,
            "data": {
              [clickedClass]: val
            }
          };
          console.log(updatedData, inputID);

          //Send the updatedData object to the server to update the db
          $.ajax({
            url: "/update-table/",
            data: updatedData,
            dataType: "json",
            type: "POST",
            success: function (data) {
              console.log(data);
              readTable();
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.log("Error:", jqXHR, textStatus, errorThrown);
            },

          })
        }
      });

    }
    console.log("table clicked!");
  });

  $("#createTable").click(function (e) {
    e.preventDefault();

    $("#name").val("");
    $("#contactNumber").val("");
    $("#bottleDonated").val("");
    $("#bottlesTaken").val("");
    $("#address").val("");

    $.ajax({
      url: "/create-table",
      dataType: "json",
      type: "POST",
      data: formData,
      success: function (data) {
        $("#status").html("DB updated.");
        //getTable
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#p2").text(jqXHR.statusText);
        console.log("ERROR:", jqXHR, textStatus, errorThrown);
      },
    });
  });
  $("#root").on(function (e) {
    // don't allow the anchor to visit the link
    e.preventDefault();
  });
});

$(".delete-button").click(function (e) {
  e.preventDefault();
  console.log("Pressed delete.");

  let rowId = $(this).find("id").txt();
  console.log(rowId);

  // $.ajax({
  //   url: "/delete-row/" + rowId,
  //   method: 'DELETE',
  //   contentType: "application/json",
  //   type: "POST",
  //   success: function (response) {
  //     console.log("Deleted? Maybe");
  //     client.db("WecycleMain").collection("Users").findOneAndDelete({
  //       _id: rowId
  //     });
  //   },
  //   error: function (jqXHR, textStatus, errorThrown) {
  //     $("#root").text(jqXHR.statusText);
  //     console.log("ERROR:", jqXHR, textStatus, errorThrown);
  //   }
  // });
});