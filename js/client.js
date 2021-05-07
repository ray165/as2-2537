$(document).ready(function () {
    console.log("hello world!");
  $.ajax({
    url: "/read-table",
    dataType: "json",
    type: "GET",
    success: function (data) {
      console.log("SUCCESS JSON ARRAY:", data);
      // for loop to build the table
      let str = `<table class="table table-striped"><tr>
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
        console.log("row", row);
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

  $("#root").on(function (e) {
    // don't allow the anchor to visit the link
    e.preventDefault();
  });
});
