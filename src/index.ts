
import {init} from "@/app";
import * as RequestSniffing from "@/modules/lyrics/requestSniffer"


export default function main() {
    init();
    RequestSniffing.setupRequestSniffer();
}