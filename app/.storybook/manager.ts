import {addons} from "@storybook/manager-api"
import type { API_SidebarOptions } from "@storybook/types"

import startCase from "lodash/startCase.js"

addons.setConfig({
    sidebar: {
        renderLabel: ({name, type}) =>
            type === "story" ? name : startCase(name),
        renderGroup: ({name}) => startCase(name)
    } as API_SidebarOptions
})