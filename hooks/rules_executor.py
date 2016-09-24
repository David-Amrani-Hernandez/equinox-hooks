
import requests
import logging
import re
from hooks.models import Hook


__logger__ = logging.getLogger(__name__)

HOOK_ID = "id"
HOOK_LATCH_STATUS = "latch_status"
HOOK_REQUEST = "request"
HOOK_REQUEST_METHOD = "method"
HOOK_REQUEST_HEADERS = "headers"
HOOK_REQUEST_BODY = "body"
HOOK_REQUEST_URL = "url"

HOOK_REQUEST_METHOD2 = "method2"
HOOK_REQUEST_HEADERS2 = "headers2"
HOOK_REQUEST_BODY2 = "body2"
HOOK_REQUEST_URL2 = "url2"

HOOK_REQUEST_REGEX = "regex"
HOOK_REQUEST_REGEX2 = "regex2"





HOOK_REGEX_ENABLE = "regex_enable"
HOOK_REGEX = "regex"
HOOK_RESPONSE_ENABLE = "response_enable"

LATCH_STATUS_ON = "on"
LATCH_STATUS_OFF = "off"


def get_raw_headers(header_list):
    full_response_raw = ""
    for header in header_list:
        full_response_raw += "{key}: {value}\n".format(key=header, value=header_list[header])

    return full_response_raw


def execute_hook(hook_list, status):
    proxies = {"http": "localhost:8080", "https": "localhost:8080"}
    for hook in hook_list:
        if hook[HOOK_LATCH_STATUS] == status:
            request_data = hook
            print ("Executing request: %s" % request_data)


            # Request 1
            response = requests.request(method=request_data[HOOK_REQUEST_METHOD],
                                        url=request_data[HOOK_REQUEST_URL],
                                        data=request_data[HOOK_REQUEST_BODY],
                                        #headers=request_data[HOOK_REQUEST_HEADERS],
                                        verify=False,
                                        headers={"content-type": "application/x-www-form-urlencoded"})
            cookies = response.cookies
            full_response_raw = get_raw_headers(response.headers)
            full_response_raw += response.text
            print(full_response_raw)
            match_result_list = re.findall(request_data[HOOK_REQUEST_REGEX], full_response_raw)
            print "Match list1:", match_result_list
            if match_result_list:
                match_result_list_raw = ""
                for match_result in match_result_list:
                    match_result_list_raw += match_result + "\n"
                print ("Match: %s" % match_result_list_raw)
            else:
                print ("no matching")

            print ("--------------------------------")
            print(match_result_list_raw)
            match_result_list_raw = match_result_list_raw.split("\n")[0]
            print ("--------------------------------")
            print(match_result_list_raw)

            if request_data[HOOK_REQUEST_METHOD2]:
                response2 = requests.request(method=request_data[HOOK_REQUEST_METHOD2].replace("${VAR}",
                                                                                               match_result_list_raw),
                                            url=request_data[HOOK_REQUEST_URL2],
                                            data=request_data[HOOK_REQUEST_BODY2].replace("${VAR}",
                                                                                          match_result_list_raw),
                                            #headers=request_data[HOOK_REQUEST_HEADERS],
                                            verify=False,
                                             cookies=cookies,
                                             headers={"content-type": "application/x-www-form-urlencoded"})

                print ("> Response status: \n%s" % response2.status_code)
                print ("> Response headers: \n%s" % response2.headers)
                print ("> Response body: \n%s" % response2.text)

                full_response_raw = get_raw_headers(response2.headers)
                full_response_raw += response2.text

                print ("> Full response: \n%s" % full_response_raw)

                # Save response into BD after matching Regex
                match_result_list = re.findall(request_data[HOOK_REQUEST_REGEX2], full_response_raw)
                print "Match list:", match_result_list
                if match_result_list:
                    match_result_list_raw = ""
                    for match_result in match_result_list:
                        match_result_list_raw += match_result + "\n"
                    print ("Match: %s" % match_result_list_raw)
                else:
                    print ("no matching")

                # TO BD match_result_list_raw
                hook_object = Hook.objects.get(pk=request_data['id'])
                hook_object.response = match_result_list_raw
                hook_object.save()


if __name__ == '__main__':

    hook_list = [
        {
            "id": 1,
            "latch_status": "ON",
            "request": {
                "method": "POST",
                "url": "http://demo8299546.mockable.io/test1",
                "headers": {"Content-Type": "application/json", "Token": "lalalala"},
                "body": " {\"\"} "
            },
            "response_enable": False,
            "regex_enable": True,
            "regex": "Content-Type: (.*)"
        },
        {
            "id": 2,
            "latch_status": "OFF",
            "request": {
                "method": "POST",
                "url": "http://demo8299546.mockable.io/test1",
                "headers": {"Content-Type": "application/json", "Token": "lalalala"},
                "body": " {\"\"} "
            },
            "response_enable": True,
            "regex_enable": True,
            "regex": "{}"
        },
        {
            "id": 3,
            "latch_status": "OFF",
            "request": {
                "method": "POST",
                "url": "http://demo8299546.mockable.io/test1",
                "headers": {"Content-Type": "application/json", "Token": "lalalala"},
                "body": " {\"\"} "
            },
            "response_enable": True,
            "regex_enable": True,
            "regex": "{}"
        }
    ]

    #execute_hook(hook_list, LATCH_STATUS_ON)

    string = """ </div>
                <div class="col-xs-12 col-sm-9 col-md-9 col-lg-9">
                    <!-- MAIN CONTAINER -->
                    <link rel="stylesheet" type="text/css" href="/public/stylesheets/basic.css" charset="utf-8" ></link>
<link rel="stylesheet" type="text/css" href="/public/stylesheets/custom.css" charset="utf-8" ></link>


<form action="/login" method="post" accept-charset="utf-8" enctype="application/x-www-form-urlencoded" ><input type="hidden" name="authenticityToken" value="af3ed851fc781bda69bb7285f3a44a9d88250ed9">
<div class="row"> """

    print re.findall("name=\"authenticityToken\" value=\"([A-Za-z0-9]*)\"", string)