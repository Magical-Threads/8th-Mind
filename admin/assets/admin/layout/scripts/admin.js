/**
 * Additional admin JS
 * 
 * @author Ray Dollete <ray@raydollete.com>
 */

 function deletePrompt(element, targetUrl) {

     if(confirm('Are you sure you want to delete this item? This cannot be undone.')) {

        $.ajax({ url: targetUrl }).done(function() {
            // get table object
            var table = $('#sample_1').DataTable();          
            
            // remove the row from the UI
            table.row(element.closest('tr')).remove().draw();
        });


     }
 }