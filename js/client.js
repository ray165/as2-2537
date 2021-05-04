$(document).ready(function () {
    console.log("hello world!");
  $.ajax({
    url: "/read-table",
    dataType: "json",
    type: "GET",
    success: function (data) {
      console.log("SUCCESS HTML:", data);
      // for loop to build the table
      let str = `<table class="table table-striped"><tr>
            <th class="id_header"><span>ID</span></th>
            <th class="name_header"><span>Name</span></th>
            <th class="contactNumber_header"><span>Contact Number</span></th>
            <th class="bottlesDonated_header"><span>Bottles Donated</span></th>
            <th class="address_header"><span>Address</span></th>
          </tr>`;
      for (let i = 0; i < data.rows.length; i++) {
        let row = data.rows[i];
        console.log("row", row);
        str +=
          "<tr><td class='id'>" +
          row._ID +
          "</td><td>" +
          row.name +
          "</td><td class='email'><span>" +
          row.contactNumber +
          "</td><td class='bottlesDonated'><span>" +
          row.bottlesDonated +
          "</td><td class='bottlesTaken'><span>" +
          row.bottlesTaken +
          "</td><td class='address'><span>" +
          row.address +
          "</span></td></tr></table>";
      }
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
