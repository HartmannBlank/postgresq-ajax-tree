function tree(id, url1, url2) {
        var element = document.getElementById(id)
        var xmlhttp;
        if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp=new XMLHttpRequest();
        }else{// code for IE6, IE5
                xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        function hasClass(elem, className) {
                return new RegExp("(^|\\s)"+className+"(\\s|$)").test(elem.className)
        }

        function toggleNode(node) {
                // определить новый класс для узла
                var newClass = hasClass(node, 'ExpandOpen') ? 'ExpandClosed' : 'ExpandOpen'
                var re =  /(^|\s)(ExpandOpen|ExpandClosed)(\s|$)/
                node.className = node.className.replace(re, '$1'+newClass+'$3')
        }
		
        function closeNode(node) {
                // определить новый класс для узла
                var newClass = hasClass(node, 'ExpandOpen' || 'ExpandLeaf') ? 'ExpandClosed' : 'Deleted'
                var re =  /(^|\s)(ExpandOpen|ExpandClosed|ExpandLeaf)(\s|$)/
                node.className = node.className.replace(re, '$1'+newClass+'$3')
                xmlhttp.open("GET",url2+'?q='+node.id,true);
                xmlhttp.send();
        }

        function load(node) {

                function showLoading(on) {
                        var expand = node.getElementsByTagName('DIV')[0]
                        expand.className = on ? 'ExpandLoading' : 'Expand'
                }


                function onSuccess(data) {
                        if (!data.errcode) {
                                onLoaded(data)
                                showLoading(false)
                        } else {
                                showLoading(false)
                                onLoadError(data)
                        }
                }


                function onAjaxError(xhr, status){
                        showLoading(false)
                        var errinfo = { errcode: status }
                        if (xhr.status != 200) {
                                // может быть статус 200, а ошибка
                                // из-за некорректного JSON
                                errinfo.message = xhr.statusText
                        } else {
                                errinfo.message = 'Некорректные данные с сервера'
                        }
                        onLoadError(errinfo)
                }
                function onLoaded(data) {

                        for(var i=0; i<data.length; i++) {
                                var child = data[i]
                                var li = document.createElement('LI')
                                li.id = child.id

                                li.className = "Node Expand" + (child.isFolder ? 'Closed' : 'Leaf')
                                if (i == data.length-1) li.className += ' IsLast'

                                li.innerHTML = '<div class="Expand"></div><div class="Delete"></div><div class="Content">'+child.title+'</div>'
                                if (child.isFolder) {
                                        li.innerHTML += '<ul class="Container"></ul>'
                                }
                                node.getElementsByTagName('UL')[0].appendChild(li)
                        }

                        node.isLoaded = true
                        toggleNode(node)
                }

                function onLoadError(error) {
                        var msg = "Ошибка "+error.errcode
                        if (error.message) msg = msg + ' :'+error.message
                        alert(msg)
                }


                showLoading(true)


                $.ajax({
                        url: url1 + '?id=' + node.id,
                        data: node.id,
                        dataType: "json",
                        success: onSuccess,
                        error: onAjaxError,
                        cache: false
                })
        }
	
        element.onclick = function(event) {
                event = event || window.event
                var clickedElem = event.target || event.srcElement

                if (hasClass(clickedElem, 'Expand')) {
                    var node = clickedElem.parentNode
                        if (hasClass(node, 'ExpandLeaf')) {
                             return // клик на листе
                        }

                        if (node.isLoaded || node.getElementsByTagName('LI').length) {
                            toggleNode(node)
                            return
                        }
                    load(node)
                }

                if (hasClass(clickedElem, 'Delete')) {
                    var node = clickedElem.parentNode
                    closeNode(node)
                    return // клик не там
                }


        }

}


