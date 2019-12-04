$(function(){
  // the taskHtml method takes in a JavaScript representation
  // of the task and produces and HTML representation using
  // <li> tags
  function taskHtml(task) {
    var checkedStatus = task.done ? "checked" : "";
    var liClass = task.done ? "completed" : "";
    var liElement = '<li id="listItem-' + task.id + '" class="' + liClass + '">' +
    '<div class="view"><input class="toggle" type="checkbox"' +
    ' data-id="' + task.id + '"' +
    checkedStatus +
    '><label>' +
    task.title +
    '</label><button id="' + task.id + '" class="destroy"></button></div></li>';
    
    return liElement;
  }

  // toggleTask takes in an HTML representation of 
  // an event that fires from an HTML representation of
  // the toggle checkbox and performs and API request to toggle
  // the value of the 'done' field
  function toggleTask(e) {
    var itemId = $(e.target).data('id');
    var doneValue = Boolean($(e.target).is(':checked'));

    $.post('/tasks/' + itemId, {
      _method: 'PUT',
      task: {
        done: doneValue
      }
    }).success(function(data) {
      $('#listItem-' + data.id).replaceWith(taskHtml(data));
      $('.toggle').change(toggleTask);
      $('.destroy').click(deleteTask);
    });
  }

  function deleteTask(e) {
    var del = confirm('Are you sure you want to delete this item?');
    if (del===true) {
      $.post('/tasks/' + e.target.id, {
        _method: 'DELETE'
      }).success(function() {
        $('#listItem-' + e.target.id).replaceWith();
      });
    }
    else
      return 
  }

  $.get('/tasks').success( function( data ) {
    var htmlString = '';

    $.each(data, function(index, task) {
      htmlString += taskHtml(task);
    });
    
    $('.todo-list').html(htmlString);

    $('.toggle').change(toggleTask);

    $('.destroy').click(deleteTask);
      
    });

  $('#new-form').submit(function(event){
    event.preventDefault();
    var textbox = $('.new-todo');
    var payload = {
      task: {
        title: textbox.val()
      }
    };
    $.post('/tasks', payload).success(function(data) {
      $('.todo-list').append(taskHtml(data));
      $('.toggle').change(toggleTask);
      $('.destroy').click(deleteTask);
      $('.new-todo').val('');
    });  
  }); 

});