await document.querySelector("button[data-calendar-view='day']").click()
await document.querySelector("button[data-calendar-nav='today']").click()

let enddate = "2025-12-31T00:00:00"
let cal = []

while (new Date(document.querySelectorAll("h3")[1].innerText.replace(/,/g, "")).getTime() != new Date(enddate).getTime()) {
    let current_date = new Date(document.querySelectorAll("h3")[1].innerText.replace(/,/g, ""))

    let spans = document.querySelectorAll("span.cal-hours")
    if (!spans) {
        document.querySelector("button[data-calendar-nav='next']").click()
    } else {
        for (let span of spans) {

            let ev_name = span.nextSibling.nextSibling.innerText

            if (span.innerText.includes("-")) {
                let hours_string = span.innerText.split(" - ")
                let start_hhmm_string = hours_string[0].split(":")
                let end_hhmm_string = hours_string[1].split(":")
                let start_h = parseInt(start_hhmm_string[0])
                let start_m = parseInt(start_hhmm_string[1])
                let end_h = parseInt(end_hhmm_string[0])
                let end_m = parseInt(end_hhmm_string[1])

                let start_js_date = new Date( new Date(current_date).setHours(start_h, start_m) )
                let end_js_date = new Date( new Date(current_date).setHours(end_h, end_m) )

                let ics_string_start = `DTSTART;TZID=Asia/Ho_Chi_Minh:${start_js_date.getFullYear()}${ String( start_js_date.getMonth()+1).padStart(2, '0') }${ String( start_js_date.getDate()).padStart(2, '0')}T${  String( start_js_date.getHours()).padStart(2, '0')  }${ String( start_js_date.getMinutes()).padStart(2, '0')}00`

                let ics_string_end = `DTEND;TZID=Asia/Ho_Chi_Minh:${end_js_date.getFullYear()}${ String( end_js_date.getMonth()+1 ).padStart(2, '0')}${ String( end_js_date.getDate() ).padStart(2, '0') }T${ String( end_js_date.getHours()).padStart(2, '0')}${ String(end_js_date.getMinutes()).padStart(2, '0')}00`

                //     TODO: Get event name
                cal.push({start: ics_string_start, end: ics_string_end, eventName: ev_name})
            } else {
                let ics_string_start = `DTSTART;VALUE=DATE:${current_date.getFullYear()}${ String( current_date.getMonth()+1).padStart(2, '0')}${ String( current_date.getDate()).padStart(2, '0')}`
                let ics_string_end = `DTEND;VALUE=DATE:${current_date.getFullYear()}${ String( current_date.getMonth()+1).padStart(2, '0')}${ String( current_date.getDate()).padStart(2, '0')}`

//                 All day events
                cal.push({start: ics_string_start, end: ics_string_end, eventName: ev_name})

            }

            //     TODO: Get event name
        }
        document.querySelector("button[data-calendar-nav='next']").click()


    }


}

let ics_file_start = "BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\n\n"
let ics_file_end = "\n\nEND:VCALENDAR"

let ics_stream = ics_file_start

let cdate = new Date()
let dtstamp = `DTSTAMP;TZID=Asia/Ho_Chi_Minh:${cdate.getFullYear()}${ String( cdate.getMonth()).padStart(2, '0') }${ String( cdate.getDate()).padStart(2, '0')}T000000`

for (let calevent of cal) {
    const id = crypto.randomUUID()
    let ics_entry = `BEGIN:VEVENT\nUID:${id}\n${dtstamp}\n${calevent.start}\n${calevent.end}\nSUMMARY:${calevent.eventName}\nEND:VEVENT\n\n`
    ics_stream += ics_entry
}
ics_stream += ics_file_end

// Download file

var element = document.createElement('a');
element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(ics_stream));
element.setAttribute('download', 'sis.ics');

element.style.display = 'none';
document.body.appendChild(element);

element.click();

document.body.removeChild(element);
