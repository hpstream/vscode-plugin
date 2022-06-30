import {
  Uri,
  QuickPickItem,
  window,
  QuickInputButtons,
  ExtensionContext,
  QuickInputButton,
} from "vscode";

let context!: ExtensionContext;

console.log(context.asAbsolutePath("media/resources/dark/add.svg"));

class MyButton implements QuickInputButton {
  constructor(
    public iconPath: {light: Uri; dark: Uri},
    public tooltip: string
  ) {}
}

const createResourceGroupButton = new MyButton(
  {
    dark: Uri.file(context.asAbsolutePath("media/resources/dark/add.svg")),
    light: Uri.file(context.asAbsolutePath("media/resources/light/add.svg")),
  },
  "Create Resource Group"
);

const resourceGroups: QuickPickItem[] = [
  "vscode-data-function",
  "vscode-appservice-microservices",
  "vscode-appservice-monitor",
  "vscode-appservice-preview",
  "vscode-appservice-prod",
].map((label) => ({label}));
const input = window.createQuickPick<QuickPickItem>();
input.title = "hp";
// input.ignoreFocusOut = true;
input.placeholder = "please hp";

input.step = 1;
input.totalSteps = 3;
input.buttons = [
  QuickInputButtons.Back,
  createResourceGroupButton,
  QuickInputButtons.Back,
  createResourceGroupButton,
];
input.items = resourceGroups;

// input.onDidHide(() => input.show());
input.show();

// console.log(input);
