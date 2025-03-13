#!/usr/bin/env node
"use strict";
var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _hupSig, _emitter, _process, _originalProcessEmit, _originalProcessReallyExit, _sigListeners, _loaded, _SignalExit_instances, processReallyExit_fn, processEmit_fn;
const require$$0$1 = require("node:events");
const require$$1$1 = require("node:child_process");
const require$$2$1 = require("node:path");
const require$$3$2 = require("node:fs");
const process$2 = require("node:process");
const readline$1 = require("node:readline");
const require$$1$2 = require("stream");
const require$$0$2 = require("node:tty");
const node_async_hooks = require("node:async_hooks");
const node_util = require("node:util");
const require$$0$3 = require("tty");
const fs = require("fs");
const require$$0$4 = require("util");
const require$$1$4 = require("child_process");
const require$$0$5 = require("buffer");
const require$$1$3 = require("string_decoder");
const path = require("path");
const require$$2$2 = require("crypto");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const readline__namespace = /* @__PURE__ */ _interopNamespaceDefault(readline$1);
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var commander$1 = {};
var argument = {};
var error = {};
var hasRequiredError;
function requireError() {
  if (hasRequiredError) return error;
  hasRequiredError = 1;
  class CommanderError2 extends Error {
    /**
     * Constructs the CommanderError class
     * @param {number} exitCode suggested exit code which could be used with process.exit
     * @param {string} code an id string representing the error
     * @param {string} message human-readable description of the error
     */
    constructor(exitCode, code, message) {
      super(message);
      Error.captureStackTrace(this, this.constructor);
      this.name = this.constructor.name;
      this.code = code;
      this.exitCode = exitCode;
      this.nestedError = void 0;
    }
  }
  class InvalidArgumentError2 extends CommanderError2 {
    /**
     * Constructs the InvalidArgumentError class
     * @param {string} [message] explanation of why argument is invalid
     */
    constructor(message) {
      super(1, "commander.invalidArgument", message);
      Error.captureStackTrace(this, this.constructor);
      this.name = this.constructor.name;
    }
  }
  error.CommanderError = CommanderError2;
  error.InvalidArgumentError = InvalidArgumentError2;
  return error;
}
var hasRequiredArgument;
function requireArgument() {
  if (hasRequiredArgument) return argument;
  hasRequiredArgument = 1;
  const { InvalidArgumentError: InvalidArgumentError2 } = requireError();
  class Argument2 {
    /**
     * Initialize a new command argument with the given name and description.
     * The default is that the argument is required, and you can explicitly
     * indicate this with <> around the name. Put [] around the name for an optional argument.
     *
     * @param {string} name
     * @param {string} [description]
     */
    constructor(name, description) {
      this.description = description || "";
      this.variadic = false;
      this.parseArg = void 0;
      this.defaultValue = void 0;
      this.defaultValueDescription = void 0;
      this.argChoices = void 0;
      switch (name[0]) {
        case "<":
          this.required = true;
          this._name = name.slice(1, -1);
          break;
        case "[":
          this.required = false;
          this._name = name.slice(1, -1);
          break;
        default:
          this.required = true;
          this._name = name;
          break;
      }
      if (this._name.length > 3 && this._name.slice(-3) === "...") {
        this.variadic = true;
        this._name = this._name.slice(0, -3);
      }
    }
    /**
     * Return argument name.
     *
     * @return {string}
     */
    name() {
      return this._name;
    }
    /**
     * @package
     */
    _concatValue(value, previous) {
      if (previous === this.defaultValue || !Array.isArray(previous)) {
        return [value];
      }
      return previous.concat(value);
    }
    /**
     * Set the default value, and optionally supply the description to be displayed in the help.
     *
     * @param {*} value
     * @param {string} [description]
     * @return {Argument}
     */
    default(value, description) {
      this.defaultValue = value;
      this.defaultValueDescription = description;
      return this;
    }
    /**
     * Set the custom handler for processing CLI command arguments into argument values.
     *
     * @param {Function} [fn]
     * @return {Argument}
     */
    argParser(fn) {
      this.parseArg = fn;
      return this;
    }
    /**
     * Only allow argument value to be one of choices.
     *
     * @param {string[]} values
     * @return {Argument}
     */
    choices(values) {
      this.argChoices = values.slice();
      this.parseArg = (arg, previous) => {
        if (!this.argChoices.includes(arg)) {
          throw new InvalidArgumentError2(
            `Allowed choices are ${this.argChoices.join(", ")}.`
          );
        }
        if (this.variadic) {
          return this._concatValue(arg, previous);
        }
        return arg;
      };
      return this;
    }
    /**
     * Make argument required.
     *
     * @returns {Argument}
     */
    argRequired() {
      this.required = true;
      return this;
    }
    /**
     * Make argument optional.
     *
     * @returns {Argument}
     */
    argOptional() {
      this.required = false;
      return this;
    }
  }
  function humanReadableArgName(arg) {
    const nameOutput = arg.name() + (arg.variadic === true ? "..." : "");
    return arg.required ? "<" + nameOutput + ">" : "[" + nameOutput + "]";
  }
  argument.Argument = Argument2;
  argument.humanReadableArgName = humanReadableArgName;
  return argument;
}
var command = {};
var help = {};
var hasRequiredHelp;
function requireHelp() {
  if (hasRequiredHelp) return help;
  hasRequiredHelp = 1;
  const { humanReadableArgName } = requireArgument();
  class Help2 {
    constructor() {
      this.helpWidth = void 0;
      this.minWidthToWrap = 40;
      this.sortSubcommands = false;
      this.sortOptions = false;
      this.showGlobalOptions = false;
    }
    /**
     * prepareContext is called by Commander after applying overrides from `Command.configureHelp()`
     * and just before calling `formatHelp()`.
     *
     * Commander just uses the helpWidth and the rest is provided for optional use by more complex subclasses.
     *
     * @param {{ error?: boolean, helpWidth?: number, outputHasColors?: boolean }} contextOptions
     */
    prepareContext(contextOptions) {
      this.helpWidth = this.helpWidth ?? contextOptions.helpWidth ?? 80;
    }
    /**
     * Get an array of the visible subcommands. Includes a placeholder for the implicit help command, if there is one.
     *
     * @param {Command} cmd
     * @returns {Command[]}
     */
    visibleCommands(cmd) {
      const visibleCommands = cmd.commands.filter((cmd2) => !cmd2._hidden);
      const helpCommand = cmd._getHelpCommand();
      if (helpCommand && !helpCommand._hidden) {
        visibleCommands.push(helpCommand);
      }
      if (this.sortSubcommands) {
        visibleCommands.sort((a, b) => {
          return a.name().localeCompare(b.name());
        });
      }
      return visibleCommands;
    }
    /**
     * Compare options for sort.
     *
     * @param {Option} a
     * @param {Option} b
     * @returns {number}
     */
    compareOptions(a, b) {
      const getSortKey = (option2) => {
        return option2.short ? option2.short.replace(/^-/, "") : option2.long.replace(/^--/, "");
      };
      return getSortKey(a).localeCompare(getSortKey(b));
    }
    /**
     * Get an array of the visible options. Includes a placeholder for the implicit help option, if there is one.
     *
     * @param {Command} cmd
     * @returns {Option[]}
     */
    visibleOptions(cmd) {
      const visibleOptions = cmd.options.filter((option2) => !option2.hidden);
      const helpOption = cmd._getHelpOption();
      if (helpOption && !helpOption.hidden) {
        const removeShort = helpOption.short && cmd._findOption(helpOption.short);
        const removeLong = helpOption.long && cmd._findOption(helpOption.long);
        if (!removeShort && !removeLong) {
          visibleOptions.push(helpOption);
        } else if (helpOption.long && !removeLong) {
          visibleOptions.push(
            cmd.createOption(helpOption.long, helpOption.description)
          );
        } else if (helpOption.short && !removeShort) {
          visibleOptions.push(
            cmd.createOption(helpOption.short, helpOption.description)
          );
        }
      }
      if (this.sortOptions) {
        visibleOptions.sort(this.compareOptions);
      }
      return visibleOptions;
    }
    /**
     * Get an array of the visible global options. (Not including help.)
     *
     * @param {Command} cmd
     * @returns {Option[]}
     */
    visibleGlobalOptions(cmd) {
      if (!this.showGlobalOptions) return [];
      const globalOptions = [];
      for (let ancestorCmd = cmd.parent; ancestorCmd; ancestorCmd = ancestorCmd.parent) {
        const visibleOptions = ancestorCmd.options.filter(
          (option2) => !option2.hidden
        );
        globalOptions.push(...visibleOptions);
      }
      if (this.sortOptions) {
        globalOptions.sort(this.compareOptions);
      }
      return globalOptions;
    }
    /**
     * Get an array of the arguments if any have a description.
     *
     * @param {Command} cmd
     * @returns {Argument[]}
     */
    visibleArguments(cmd) {
      if (cmd._argsDescription) {
        cmd.registeredArguments.forEach((argument2) => {
          argument2.description = argument2.description || cmd._argsDescription[argument2.name()] || "";
        });
      }
      if (cmd.registeredArguments.find((argument2) => argument2.description)) {
        return cmd.registeredArguments;
      }
      return [];
    }
    /**
     * Get the command term to show in the list of subcommands.
     *
     * @param {Command} cmd
     * @returns {string}
     */
    subcommandTerm(cmd) {
      const args2 = cmd.registeredArguments.map((arg) => humanReadableArgName(arg)).join(" ");
      return cmd._name + (cmd._aliases[0] ? "|" + cmd._aliases[0] : "") + (cmd.options.length ? " [options]" : "") + // simplistic check for non-help option
      (args2 ? " " + args2 : "");
    }
    /**
     * Get the option term to show in the list of options.
     *
     * @param {Option} option
     * @returns {string}
     */
    optionTerm(option2) {
      return option2.flags;
    }
    /**
     * Get the argument term to show in the list of arguments.
     *
     * @param {Argument} argument
     * @returns {string}
     */
    argumentTerm(argument2) {
      return argument2.name();
    }
    /**
     * Get the longest command term length.
     *
     * @param {Command} cmd
     * @param {Help} helper
     * @returns {number}
     */
    longestSubcommandTermLength(cmd, helper) {
      return helper.visibleCommands(cmd).reduce((max2, command2) => {
        return Math.max(
          max2,
          this.displayWidth(
            helper.styleSubcommandTerm(helper.subcommandTerm(command2))
          )
        );
      }, 0);
    }
    /**
     * Get the longest option term length.
     *
     * @param {Command} cmd
     * @param {Help} helper
     * @returns {number}
     */
    longestOptionTermLength(cmd, helper) {
      return helper.visibleOptions(cmd).reduce((max2, option2) => {
        return Math.max(
          max2,
          this.displayWidth(helper.styleOptionTerm(helper.optionTerm(option2)))
        );
      }, 0);
    }
    /**
     * Get the longest global option term length.
     *
     * @param {Command} cmd
     * @param {Help} helper
     * @returns {number}
     */
    longestGlobalOptionTermLength(cmd, helper) {
      return helper.visibleGlobalOptions(cmd).reduce((max2, option2) => {
        return Math.max(
          max2,
          this.displayWidth(helper.styleOptionTerm(helper.optionTerm(option2)))
        );
      }, 0);
    }
    /**
     * Get the longest argument term length.
     *
     * @param {Command} cmd
     * @param {Help} helper
     * @returns {number}
     */
    longestArgumentTermLength(cmd, helper) {
      return helper.visibleArguments(cmd).reduce((max2, argument2) => {
        return Math.max(
          max2,
          this.displayWidth(
            helper.styleArgumentTerm(helper.argumentTerm(argument2))
          )
        );
      }, 0);
    }
    /**
     * Get the command usage to be displayed at the top of the built-in help.
     *
     * @param {Command} cmd
     * @returns {string}
     */
    commandUsage(cmd) {
      let cmdName = cmd._name;
      if (cmd._aliases[0]) {
        cmdName = cmdName + "|" + cmd._aliases[0];
      }
      let ancestorCmdNames = "";
      for (let ancestorCmd = cmd.parent; ancestorCmd; ancestorCmd = ancestorCmd.parent) {
        ancestorCmdNames = ancestorCmd.name() + " " + ancestorCmdNames;
      }
      return ancestorCmdNames + cmdName + " " + cmd.usage();
    }
    /**
     * Get the description for the command.
     *
     * @param {Command} cmd
     * @returns {string}
     */
    commandDescription(cmd) {
      return cmd.description();
    }
    /**
     * Get the subcommand summary to show in the list of subcommands.
     * (Fallback to description for backwards compatibility.)
     *
     * @param {Command} cmd
     * @returns {string}
     */
    subcommandDescription(cmd) {
      return cmd.summary() || cmd.description();
    }
    /**
     * Get the option description to show in the list of options.
     *
     * @param {Option} option
     * @return {string}
     */
    optionDescription(option2) {
      const extraInfo = [];
      if (option2.argChoices) {
        extraInfo.push(
          // use stringify to match the display of the default value
          `choices: ${option2.argChoices.map((choice) => JSON.stringify(choice)).join(", ")}`
        );
      }
      if (option2.defaultValue !== void 0) {
        const showDefault = option2.required || option2.optional || option2.isBoolean() && typeof option2.defaultValue === "boolean";
        if (showDefault) {
          extraInfo.push(
            `default: ${option2.defaultValueDescription || JSON.stringify(option2.defaultValue)}`
          );
        }
      }
      if (option2.presetArg !== void 0 && option2.optional) {
        extraInfo.push(`preset: ${JSON.stringify(option2.presetArg)}`);
      }
      if (option2.envVar !== void 0) {
        extraInfo.push(`env: ${option2.envVar}`);
      }
      if (extraInfo.length > 0) {
        return `${option2.description} (${extraInfo.join(", ")})`;
      }
      return option2.description;
    }
    /**
     * Get the argument description to show in the list of arguments.
     *
     * @param {Argument} argument
     * @return {string}
     */
    argumentDescription(argument2) {
      const extraInfo = [];
      if (argument2.argChoices) {
        extraInfo.push(
          // use stringify to match the display of the default value
          `choices: ${argument2.argChoices.map((choice) => JSON.stringify(choice)).join(", ")}`
        );
      }
      if (argument2.defaultValue !== void 0) {
        extraInfo.push(
          `default: ${argument2.defaultValueDescription || JSON.stringify(argument2.defaultValue)}`
        );
      }
      if (extraInfo.length > 0) {
        const extraDescription = `(${extraInfo.join(", ")})`;
        if (argument2.description) {
          return `${argument2.description} ${extraDescription}`;
        }
        return extraDescription;
      }
      return argument2.description;
    }
    /**
     * Generate the built-in help text.
     *
     * @param {Command} cmd
     * @param {Help} helper
     * @returns {string}
     */
    formatHelp(cmd, helper) {
      const termWidth = helper.padWidth(cmd, helper);
      const helpWidth = helper.helpWidth ?? 80;
      function callFormatItem(term, description) {
        return helper.formatItem(term, termWidth, description, helper);
      }
      let output = [
        `${helper.styleTitle("Usage:")} ${helper.styleUsage(helper.commandUsage(cmd))}`,
        ""
      ];
      const commandDescription = helper.commandDescription(cmd);
      if (commandDescription.length > 0) {
        output = output.concat([
          helper.boxWrap(
            helper.styleCommandDescription(commandDescription),
            helpWidth
          ),
          ""
        ]);
      }
      const argumentList = helper.visibleArguments(cmd).map((argument2) => {
        return callFormatItem(
          helper.styleArgumentTerm(helper.argumentTerm(argument2)),
          helper.styleArgumentDescription(helper.argumentDescription(argument2))
        );
      });
      if (argumentList.length > 0) {
        output = output.concat([
          helper.styleTitle("Arguments:"),
          ...argumentList,
          ""
        ]);
      }
      const optionList = helper.visibleOptions(cmd).map((option2) => {
        return callFormatItem(
          helper.styleOptionTerm(helper.optionTerm(option2)),
          helper.styleOptionDescription(helper.optionDescription(option2))
        );
      });
      if (optionList.length > 0) {
        output = output.concat([
          helper.styleTitle("Options:"),
          ...optionList,
          ""
        ]);
      }
      if (helper.showGlobalOptions) {
        const globalOptionList = helper.visibleGlobalOptions(cmd).map((option2) => {
          return callFormatItem(
            helper.styleOptionTerm(helper.optionTerm(option2)),
            helper.styleOptionDescription(helper.optionDescription(option2))
          );
        });
        if (globalOptionList.length > 0) {
          output = output.concat([
            helper.styleTitle("Global Options:"),
            ...globalOptionList,
            ""
          ]);
        }
      }
      const commandList = helper.visibleCommands(cmd).map((cmd2) => {
        return callFormatItem(
          helper.styleSubcommandTerm(helper.subcommandTerm(cmd2)),
          helper.styleSubcommandDescription(helper.subcommandDescription(cmd2))
        );
      });
      if (commandList.length > 0) {
        output = output.concat([
          helper.styleTitle("Commands:"),
          ...commandList,
          ""
        ]);
      }
      return output.join("\n");
    }
    /**
     * Return display width of string, ignoring ANSI escape sequences. Used in padding and wrapping calculations.
     *
     * @param {string} str
     * @returns {number}
     */
    displayWidth(str) {
      return stripColor(str).length;
    }
    /**
     * Style the title for displaying in the help. Called with 'Usage:', 'Options:', etc.
     *
     * @param {string} str
     * @returns {string}
     */
    styleTitle(str) {
      return str;
    }
    styleUsage(str) {
      return str.split(" ").map((word) => {
        if (word === "[options]") return this.styleOptionText(word);
        if (word === "[command]") return this.styleSubcommandText(word);
        if (word[0] === "[" || word[0] === "<")
          return this.styleArgumentText(word);
        return this.styleCommandText(word);
      }).join(" ");
    }
    styleCommandDescription(str) {
      return this.styleDescriptionText(str);
    }
    styleOptionDescription(str) {
      return this.styleDescriptionText(str);
    }
    styleSubcommandDescription(str) {
      return this.styleDescriptionText(str);
    }
    styleArgumentDescription(str) {
      return this.styleDescriptionText(str);
    }
    styleDescriptionText(str) {
      return str;
    }
    styleOptionTerm(str) {
      return this.styleOptionText(str);
    }
    styleSubcommandTerm(str) {
      return str.split(" ").map((word) => {
        if (word === "[options]") return this.styleOptionText(word);
        if (word[0] === "[" || word[0] === "<")
          return this.styleArgumentText(word);
        return this.styleSubcommandText(word);
      }).join(" ");
    }
    styleArgumentTerm(str) {
      return this.styleArgumentText(str);
    }
    styleOptionText(str) {
      return str;
    }
    styleArgumentText(str) {
      return str;
    }
    styleSubcommandText(str) {
      return str;
    }
    styleCommandText(str) {
      return str;
    }
    /**
     * Calculate the pad width from the maximum term length.
     *
     * @param {Command} cmd
     * @param {Help} helper
     * @returns {number}
     */
    padWidth(cmd, helper) {
      return Math.max(
        helper.longestOptionTermLength(cmd, helper),
        helper.longestGlobalOptionTermLength(cmd, helper),
        helper.longestSubcommandTermLength(cmd, helper),
        helper.longestArgumentTermLength(cmd, helper)
      );
    }
    /**
     * Detect manually wrapped and indented strings by checking for line break followed by whitespace.
     *
     * @param {string} str
     * @returns {boolean}
     */
    preformatted(str) {
      return /\n[^\S\r\n]/.test(str);
    }
    /**
     * Format the "item", which consists of a term and description. Pad the term and wrap the description, indenting the following lines.
     *
     * So "TTT", 5, "DDD DDDD DD DDD" might be formatted for this.helpWidth=17 like so:
     *   TTT  DDD DDDD
     *        DD DDD
     *
     * @param {string} term
     * @param {number} termWidth
     * @param {string} description
     * @param {Help} helper
     * @returns {string}
     */
    formatItem(term, termWidth, description, helper) {
      const itemIndent = 2;
      const itemIndentStr = " ".repeat(itemIndent);
      if (!description) return itemIndentStr + term;
      const paddedTerm = term.padEnd(
        termWidth + term.length - helper.displayWidth(term)
      );
      const spacerWidth = 2;
      const helpWidth = this.helpWidth ?? 80;
      const remainingWidth = helpWidth - termWidth - spacerWidth - itemIndent;
      let formattedDescription;
      if (remainingWidth < this.minWidthToWrap || helper.preformatted(description)) {
        formattedDescription = description;
      } else {
        const wrappedDescription = helper.boxWrap(description, remainingWidth);
        formattedDescription = wrappedDescription.replace(
          /\n/g,
          "\n" + " ".repeat(termWidth + spacerWidth)
        );
      }
      return itemIndentStr + paddedTerm + " ".repeat(spacerWidth) + formattedDescription.replace(/\n/g, `
${itemIndentStr}`);
    }
    /**
     * Wrap a string at whitespace, preserving existing line breaks.
     * Wrapping is skipped if the width is less than `minWidthToWrap`.
     *
     * @param {string} str
     * @param {number} width
     * @returns {string}
     */
    boxWrap(str, width) {
      if (width < this.minWidthToWrap) return str;
      const rawLines = str.split(/\r\n|\n/);
      const chunkPattern = /[\s]*[^\s]+/g;
      const wrappedLines = [];
      rawLines.forEach((line) => {
        const chunks = line.match(chunkPattern);
        if (chunks === null) {
          wrappedLines.push("");
          return;
        }
        let sumChunks = [chunks.shift()];
        let sumWidth = this.displayWidth(sumChunks[0]);
        chunks.forEach((chunk) => {
          const visibleWidth = this.displayWidth(chunk);
          if (sumWidth + visibleWidth <= width) {
            sumChunks.push(chunk);
            sumWidth += visibleWidth;
            return;
          }
          wrappedLines.push(sumChunks.join(""));
          const nextChunk = chunk.trimStart();
          sumChunks = [nextChunk];
          sumWidth = this.displayWidth(nextChunk);
        });
        wrappedLines.push(sumChunks.join(""));
      });
      return wrappedLines.join("\n");
    }
  }
  function stripColor(str) {
    const sgrPattern = /\x1b\[\d*(;\d*)*m/g;
    return str.replace(sgrPattern, "");
  }
  help.Help = Help2;
  help.stripColor = stripColor;
  return help;
}
var option = {};
var hasRequiredOption;
function requireOption() {
  if (hasRequiredOption) return option;
  hasRequiredOption = 1;
  const { InvalidArgumentError: InvalidArgumentError2 } = requireError();
  class Option2 {
    /**
     * Initialize a new `Option` with the given `flags` and `description`.
     *
     * @param {string} flags
     * @param {string} [description]
     */
    constructor(flags, description) {
      this.flags = flags;
      this.description = description || "";
      this.required = flags.includes("<");
      this.optional = flags.includes("[");
      this.variadic = /\w\.\.\.[>\]]$/.test(flags);
      this.mandatory = false;
      const optionFlags = splitOptionFlags(flags);
      this.short = optionFlags.shortFlag;
      this.long = optionFlags.longFlag;
      this.negate = false;
      if (this.long) {
        this.negate = this.long.startsWith("--no-");
      }
      this.defaultValue = void 0;
      this.defaultValueDescription = void 0;
      this.presetArg = void 0;
      this.envVar = void 0;
      this.parseArg = void 0;
      this.hidden = false;
      this.argChoices = void 0;
      this.conflictsWith = [];
      this.implied = void 0;
    }
    /**
     * Set the default value, and optionally supply the description to be displayed in the help.
     *
     * @param {*} value
     * @param {string} [description]
     * @return {Option}
     */
    default(value, description) {
      this.defaultValue = value;
      this.defaultValueDescription = description;
      return this;
    }
    /**
     * Preset to use when option used without option-argument, especially optional but also boolean and negated.
     * The custom processing (parseArg) is called.
     *
     * @example
     * new Option('--color').default('GREYSCALE').preset('RGB');
     * new Option('--donate [amount]').preset('20').argParser(parseFloat);
     *
     * @param {*} arg
     * @return {Option}
     */
    preset(arg) {
      this.presetArg = arg;
      return this;
    }
    /**
     * Add option name(s) that conflict with this option.
     * An error will be displayed if conflicting options are found during parsing.
     *
     * @example
     * new Option('--rgb').conflicts('cmyk');
     * new Option('--js').conflicts(['ts', 'jsx']);
     *
     * @param {(string | string[])} names
     * @return {Option}
     */
    conflicts(names) {
      this.conflictsWith = this.conflictsWith.concat(names);
      return this;
    }
    /**
     * Specify implied option values for when this option is set and the implied options are not.
     *
     * The custom processing (parseArg) is not called on the implied values.
     *
     * @example
     * program
     *   .addOption(new Option('--log', 'write logging information to file'))
     *   .addOption(new Option('--trace', 'log extra details').implies({ log: 'trace.txt' }));
     *
     * @param {object} impliedOptionValues
     * @return {Option}
     */
    implies(impliedOptionValues) {
      let newImplied = impliedOptionValues;
      if (typeof impliedOptionValues === "string") {
        newImplied = { [impliedOptionValues]: true };
      }
      this.implied = Object.assign(this.implied || {}, newImplied);
      return this;
    }
    /**
     * Set environment variable to check for option value.
     *
     * An environment variable is only used if when processed the current option value is
     * undefined, or the source of the current value is 'default' or 'config' or 'env'.
     *
     * @param {string} name
     * @return {Option}
     */
    env(name) {
      this.envVar = name;
      return this;
    }
    /**
     * Set the custom handler for processing CLI option arguments into option values.
     *
     * @param {Function} [fn]
     * @return {Option}
     */
    argParser(fn) {
      this.parseArg = fn;
      return this;
    }
    /**
     * Whether the option is mandatory and must have a value after parsing.
     *
     * @param {boolean} [mandatory=true]
     * @return {Option}
     */
    makeOptionMandatory(mandatory = true) {
      this.mandatory = !!mandatory;
      return this;
    }
    /**
     * Hide option in help.
     *
     * @param {boolean} [hide=true]
     * @return {Option}
     */
    hideHelp(hide = true) {
      this.hidden = !!hide;
      return this;
    }
    /**
     * @package
     */
    _concatValue(value, previous) {
      if (previous === this.defaultValue || !Array.isArray(previous)) {
        return [value];
      }
      return previous.concat(value);
    }
    /**
     * Only allow option value to be one of choices.
     *
     * @param {string[]} values
     * @return {Option}
     */
    choices(values) {
      this.argChoices = values.slice();
      this.parseArg = (arg, previous) => {
        if (!this.argChoices.includes(arg)) {
          throw new InvalidArgumentError2(
            `Allowed choices are ${this.argChoices.join(", ")}.`
          );
        }
        if (this.variadic) {
          return this._concatValue(arg, previous);
        }
        return arg;
      };
      return this;
    }
    /**
     * Return option name.
     *
     * @return {string}
     */
    name() {
      if (this.long) {
        return this.long.replace(/^--/, "");
      }
      return this.short.replace(/^-/, "");
    }
    /**
     * Return option name, in a camelcase format that can be used
     * as an object attribute key.
     *
     * @return {string}
     */
    attributeName() {
      if (this.negate) {
        return camelcase(this.name().replace(/^no-/, ""));
      }
      return camelcase(this.name());
    }
    /**
     * Check if `arg` matches the short or long flag.
     *
     * @param {string} arg
     * @return {boolean}
     * @package
     */
    is(arg) {
      return this.short === arg || this.long === arg;
    }
    /**
     * Return whether a boolean option.
     *
     * Options are one of boolean, negated, required argument, or optional argument.
     *
     * @return {boolean}
     * @package
     */
    isBoolean() {
      return !this.required && !this.optional && !this.negate;
    }
  }
  class DualOptions {
    /**
     * @param {Option[]} options
     */
    constructor(options) {
      this.positiveOptions = /* @__PURE__ */ new Map();
      this.negativeOptions = /* @__PURE__ */ new Map();
      this.dualOptions = /* @__PURE__ */ new Set();
      options.forEach((option2) => {
        if (option2.negate) {
          this.negativeOptions.set(option2.attributeName(), option2);
        } else {
          this.positiveOptions.set(option2.attributeName(), option2);
        }
      });
      this.negativeOptions.forEach((value, key) => {
        if (this.positiveOptions.has(key)) {
          this.dualOptions.add(key);
        }
      });
    }
    /**
     * Did the value come from the option, and not from possible matching dual option?
     *
     * @param {*} value
     * @param {Option} option
     * @returns {boolean}
     */
    valueFromOption(value, option2) {
      const optionKey = option2.attributeName();
      if (!this.dualOptions.has(optionKey)) return true;
      const preset = this.negativeOptions.get(optionKey).presetArg;
      const negativeValue = preset !== void 0 ? preset : false;
      return option2.negate === (negativeValue === value);
    }
  }
  function camelcase(str) {
    return str.split("-").reduce((str2, word) => {
      return str2 + word[0].toUpperCase() + word.slice(1);
    });
  }
  function splitOptionFlags(flags) {
    let shortFlag;
    let longFlag;
    const shortFlagExp = /^-[^-]$/;
    const longFlagExp = /^--[^-]/;
    const flagParts = flags.split(/[ |,]+/).concat("guard");
    if (shortFlagExp.test(flagParts[0])) shortFlag = flagParts.shift();
    if (longFlagExp.test(flagParts[0])) longFlag = flagParts.shift();
    if (!shortFlag && shortFlagExp.test(flagParts[0]))
      shortFlag = flagParts.shift();
    if (!shortFlag && longFlagExp.test(flagParts[0])) {
      shortFlag = longFlag;
      longFlag = flagParts.shift();
    }
    if (flagParts[0].startsWith("-")) {
      const unsupportedFlag = flagParts[0];
      const baseError = `option creation failed due to '${unsupportedFlag}' in option flags '${flags}'`;
      if (/^-[^-][^-]/.test(unsupportedFlag))
        throw new Error(
          `${baseError}
- a short flag is a single dash and a single character
  - either use a single dash and a single character (for a short flag)
  - or use a double dash for a long option (and can have two, like '--ws, --workspace')`
        );
      if (shortFlagExp.test(unsupportedFlag))
        throw new Error(`${baseError}
- too many short flags`);
      if (longFlagExp.test(unsupportedFlag))
        throw new Error(`${baseError}
- too many long flags`);
      throw new Error(`${baseError}
- unrecognised flag format`);
    }
    if (shortFlag === void 0 && longFlag === void 0)
      throw new Error(
        `option creation failed due to no flags found in '${flags}'.`
      );
    return { shortFlag, longFlag };
  }
  option.Option = Option2;
  option.DualOptions = DualOptions;
  return option;
}
var suggestSimilar = {};
var hasRequiredSuggestSimilar;
function requireSuggestSimilar() {
  if (hasRequiredSuggestSimilar) return suggestSimilar;
  hasRequiredSuggestSimilar = 1;
  const maxDistance = 3;
  function editDistance(a, b) {
    if (Math.abs(a.length - b.length) > maxDistance)
      return Math.max(a.length, b.length);
    const d = [];
    for (let i = 0; i <= a.length; i++) {
      d[i] = [i];
    }
    for (let j = 0; j <= b.length; j++) {
      d[0][j] = j;
    }
    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        let cost = 1;
        if (a[i - 1] === b[j - 1]) {
          cost = 0;
        } else {
          cost = 1;
        }
        d[i][j] = Math.min(
          d[i - 1][j] + 1,
          // deletion
          d[i][j - 1] + 1,
          // insertion
          d[i - 1][j - 1] + cost
          // substitution
        );
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
          d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
        }
      }
    }
    return d[a.length][b.length];
  }
  function suggestSimilar$1(word, candidates) {
    if (!candidates || candidates.length === 0) return "";
    candidates = Array.from(new Set(candidates));
    const searchingOptions = word.startsWith("--");
    if (searchingOptions) {
      word = word.slice(2);
      candidates = candidates.map((candidate) => candidate.slice(2));
    }
    let similar = [];
    let bestDistance = maxDistance;
    const minSimilarity = 0.4;
    candidates.forEach((candidate) => {
      if (candidate.length <= 1) return;
      const distance = editDistance(word, candidate);
      const length = Math.max(word.length, candidate.length);
      const similarity = (length - distance) / length;
      if (similarity > minSimilarity) {
        if (distance < bestDistance) {
          bestDistance = distance;
          similar = [candidate];
        } else if (distance === bestDistance) {
          similar.push(candidate);
        }
      }
    });
    similar.sort((a, b) => a.localeCompare(b));
    if (searchingOptions) {
      similar = similar.map((candidate) => `--${candidate}`);
    }
    if (similar.length > 1) {
      return `
(Did you mean one of ${similar.join(", ")}?)`;
    }
    if (similar.length === 1) {
      return `
(Did you mean ${similar[0]}?)`;
    }
    return "";
  }
  suggestSimilar.suggestSimilar = suggestSimilar$1;
  return suggestSimilar;
}
var hasRequiredCommand;
function requireCommand() {
  if (hasRequiredCommand) return command;
  hasRequiredCommand = 1;
  const EventEmitter = require$$0$1.EventEmitter;
  const childProcess = require$$1$1;
  const path2 = require$$2$1;
  const fs2 = require$$3$2;
  const process2 = process$2;
  const { Argument: Argument2, humanReadableArgName } = requireArgument();
  const { CommanderError: CommanderError2 } = requireError();
  const { Help: Help2, stripColor } = requireHelp();
  const { Option: Option2, DualOptions } = requireOption();
  const { suggestSimilar: suggestSimilar2 } = requireSuggestSimilar();
  class Command2 extends EventEmitter {
    /**
     * Initialize a new `Command`.
     *
     * @param {string} [name]
     */
    constructor(name) {
      super();
      this.commands = [];
      this.options = [];
      this.parent = null;
      this._allowUnknownOption = false;
      this._allowExcessArguments = false;
      this.registeredArguments = [];
      this._args = this.registeredArguments;
      this.args = [];
      this.rawArgs = [];
      this.processedArgs = [];
      this._scriptPath = null;
      this._name = name || "";
      this._optionValues = {};
      this._optionValueSources = {};
      this._storeOptionsAsProperties = false;
      this._actionHandler = null;
      this._executableHandler = false;
      this._executableFile = null;
      this._executableDir = null;
      this._defaultCommandName = null;
      this._exitCallback = null;
      this._aliases = [];
      this._combineFlagAndOptionalValue = true;
      this._description = "";
      this._summary = "";
      this._argsDescription = void 0;
      this._enablePositionalOptions = false;
      this._passThroughOptions = false;
      this._lifeCycleHooks = {};
      this._showHelpAfterError = false;
      this._showSuggestionAfterError = true;
      this._savedState = null;
      this._outputConfiguration = {
        writeOut: (str) => process2.stdout.write(str),
        writeErr: (str) => process2.stderr.write(str),
        outputError: (str, write) => write(str),
        getOutHelpWidth: () => process2.stdout.isTTY ? process2.stdout.columns : void 0,
        getErrHelpWidth: () => process2.stderr.isTTY ? process2.stderr.columns : void 0,
        getOutHasColors: () => useColor() ?? (process2.stdout.isTTY && process2.stdout.hasColors?.()),
        getErrHasColors: () => useColor() ?? (process2.stderr.isTTY && process2.stderr.hasColors?.()),
        stripColor: (str) => stripColor(str)
      };
      this._hidden = false;
      this._helpOption = void 0;
      this._addImplicitHelpCommand = void 0;
      this._helpCommand = void 0;
      this._helpConfiguration = {};
    }
    /**
     * Copy settings that are useful to have in common across root command and subcommands.
     *
     * (Used internally when adding a command using `.command()` so subcommands inherit parent settings.)
     *
     * @param {Command} sourceCommand
     * @return {Command} `this` command for chaining
     */
    copyInheritedSettings(sourceCommand) {
      this._outputConfiguration = sourceCommand._outputConfiguration;
      this._helpOption = sourceCommand._helpOption;
      this._helpCommand = sourceCommand._helpCommand;
      this._helpConfiguration = sourceCommand._helpConfiguration;
      this._exitCallback = sourceCommand._exitCallback;
      this._storeOptionsAsProperties = sourceCommand._storeOptionsAsProperties;
      this._combineFlagAndOptionalValue = sourceCommand._combineFlagAndOptionalValue;
      this._allowExcessArguments = sourceCommand._allowExcessArguments;
      this._enablePositionalOptions = sourceCommand._enablePositionalOptions;
      this._showHelpAfterError = sourceCommand._showHelpAfterError;
      this._showSuggestionAfterError = sourceCommand._showSuggestionAfterError;
      return this;
    }
    /**
     * @returns {Command[]}
     * @private
     */
    _getCommandAndAncestors() {
      const result = [];
      for (let command2 = this; command2; command2 = command2.parent) {
        result.push(command2);
      }
      return result;
    }
    /**
     * Define a command.
     *
     * There are two styles of command: pay attention to where to put the description.
     *
     * @example
     * // Command implemented using action handler (description is supplied separately to `.command`)
     * program
     *   .command('clone <source> [destination]')
     *   .description('clone a repository into a newly created directory')
     *   .action((source, destination) => {
     *     console.log('clone command called');
     *   });
     *
     * // Command implemented using separate executable file (description is second parameter to `.command`)
     * program
     *   .command('start <service>', 'start named service')
     *   .command('stop [service]', 'stop named service, or all if no name supplied');
     *
     * @param {string} nameAndArgs - command name and arguments, args are `<required>` or `[optional]` and last may also be `variadic...`
     * @param {(object | string)} [actionOptsOrExecDesc] - configuration options (for action), or description (for executable)
     * @param {object} [execOpts] - configuration options (for executable)
     * @return {Command} returns new command for action handler, or `this` for executable command
     */
    command(nameAndArgs, actionOptsOrExecDesc, execOpts) {
      let desc = actionOptsOrExecDesc;
      let opts = execOpts;
      if (typeof desc === "object" && desc !== null) {
        opts = desc;
        desc = null;
      }
      opts = opts || {};
      const [, name, args2] = nameAndArgs.match(/([^ ]+) *(.*)/);
      const cmd = this.createCommand(name);
      if (desc) {
        cmd.description(desc);
        cmd._executableHandler = true;
      }
      if (opts.isDefault) this._defaultCommandName = cmd._name;
      cmd._hidden = !!(opts.noHelp || opts.hidden);
      cmd._executableFile = opts.executableFile || null;
      if (args2) cmd.arguments(args2);
      this._registerCommand(cmd);
      cmd.parent = this;
      cmd.copyInheritedSettings(this);
      if (desc) return this;
      return cmd;
    }
    /**
     * Factory routine to create a new unattached command.
     *
     * See .command() for creating an attached subcommand, which uses this routine to
     * create the command. You can override createCommand to customise subcommands.
     *
     * @param {string} [name]
     * @return {Command} new command
     */
    createCommand(name) {
      return new Command2(name);
    }
    /**
     * You can customise the help with a subclass of Help by overriding createHelp,
     * or by overriding Help properties using configureHelp().
     *
     * @return {Help}
     */
    createHelp() {
      return Object.assign(new Help2(), this.configureHelp());
    }
    /**
     * You can customise the help by overriding Help properties using configureHelp(),
     * or with a subclass of Help by overriding createHelp().
     *
     * @param {object} [configuration] - configuration options
     * @return {(Command | object)} `this` command for chaining, or stored configuration
     */
    configureHelp(configuration) {
      if (configuration === void 0) return this._helpConfiguration;
      this._helpConfiguration = configuration;
      return this;
    }
    /**
     * The default output goes to stdout and stderr. You can customise this for special
     * applications. You can also customise the display of errors by overriding outputError.
     *
     * The configuration properties are all functions:
     *
     *     // change how output being written, defaults to stdout and stderr
     *     writeOut(str)
     *     writeErr(str)
     *     // change how output being written for errors, defaults to writeErr
     *     outputError(str, write) // used for displaying errors and not used for displaying help
     *     // specify width for wrapping help
     *     getOutHelpWidth()
     *     getErrHelpWidth()
     *     // color support, currently only used with Help
     *     getOutHasColors()
     *     getErrHasColors()
     *     stripColor() // used to remove ANSI escape codes if output does not have colors
     *
     * @param {object} [configuration] - configuration options
     * @return {(Command | object)} `this` command for chaining, or stored configuration
     */
    configureOutput(configuration) {
      if (configuration === void 0) return this._outputConfiguration;
      Object.assign(this._outputConfiguration, configuration);
      return this;
    }
    /**
     * Display the help or a custom message after an error occurs.
     *
     * @param {(boolean|string)} [displayHelp]
     * @return {Command} `this` command for chaining
     */
    showHelpAfterError(displayHelp = true) {
      if (typeof displayHelp !== "string") displayHelp = !!displayHelp;
      this._showHelpAfterError = displayHelp;
      return this;
    }
    /**
     * Display suggestion of similar commands for unknown commands, or options for unknown options.
     *
     * @param {boolean} [displaySuggestion]
     * @return {Command} `this` command for chaining
     */
    showSuggestionAfterError(displaySuggestion = true) {
      this._showSuggestionAfterError = !!displaySuggestion;
      return this;
    }
    /**
     * Add a prepared subcommand.
     *
     * See .command() for creating an attached subcommand which inherits settings from its parent.
     *
     * @param {Command} cmd - new subcommand
     * @param {object} [opts] - configuration options
     * @return {Command} `this` command for chaining
     */
    addCommand(cmd, opts) {
      if (!cmd._name) {
        throw new Error(`Command passed to .addCommand() must have a name
- specify the name in Command constructor or using .name()`);
      }
      opts = opts || {};
      if (opts.isDefault) this._defaultCommandName = cmd._name;
      if (opts.noHelp || opts.hidden) cmd._hidden = true;
      this._registerCommand(cmd);
      cmd.parent = this;
      cmd._checkForBrokenPassThrough();
      return this;
    }
    /**
     * Factory routine to create a new unattached argument.
     *
     * See .argument() for creating an attached argument, which uses this routine to
     * create the argument. You can override createArgument to return a custom argument.
     *
     * @param {string} name
     * @param {string} [description]
     * @return {Argument} new argument
     */
    createArgument(name, description) {
      return new Argument2(name, description);
    }
    /**
     * Define argument syntax for command.
     *
     * The default is that the argument is required, and you can explicitly
     * indicate this with <> around the name. Put [] around the name for an optional argument.
     *
     * @example
     * program.argument('<input-file>');
     * program.argument('[output-file]');
     *
     * @param {string} name
     * @param {string} [description]
     * @param {(Function|*)} [fn] - custom argument processing function
     * @param {*} [defaultValue]
     * @return {Command} `this` command for chaining
     */
    argument(name, description, fn, defaultValue) {
      const argument2 = this.createArgument(name, description);
      if (typeof fn === "function") {
        argument2.default(defaultValue).argParser(fn);
      } else {
        argument2.default(fn);
      }
      this.addArgument(argument2);
      return this;
    }
    /**
     * Define argument syntax for command, adding multiple at once (without descriptions).
     *
     * See also .argument().
     *
     * @example
     * program.arguments('<cmd> [env]');
     *
     * @param {string} names
     * @return {Command} `this` command for chaining
     */
    arguments(names) {
      names.trim().split(/ +/).forEach((detail) => {
        this.argument(detail);
      });
      return this;
    }
    /**
     * Define argument syntax for command, adding a prepared argument.
     *
     * @param {Argument} argument
     * @return {Command} `this` command for chaining
     */
    addArgument(argument2) {
      const previousArgument = this.registeredArguments.slice(-1)[0];
      if (previousArgument && previousArgument.variadic) {
        throw new Error(
          `only the last argument can be variadic '${previousArgument.name()}'`
        );
      }
      if (argument2.required && argument2.defaultValue !== void 0 && argument2.parseArg === void 0) {
        throw new Error(
          `a default value for a required argument is never used: '${argument2.name()}'`
        );
      }
      this.registeredArguments.push(argument2);
      return this;
    }
    /**
     * Customise or override default help command. By default a help command is automatically added if your command has subcommands.
     *
     * @example
     *    program.helpCommand('help [cmd]');
     *    program.helpCommand('help [cmd]', 'show help');
     *    program.helpCommand(false); // suppress default help command
     *    program.helpCommand(true); // add help command even if no subcommands
     *
     * @param {string|boolean} enableOrNameAndArgs - enable with custom name and/or arguments, or boolean to override whether added
     * @param {string} [description] - custom description
     * @return {Command} `this` command for chaining
     */
    helpCommand(enableOrNameAndArgs, description) {
      if (typeof enableOrNameAndArgs === "boolean") {
        this._addImplicitHelpCommand = enableOrNameAndArgs;
        return this;
      }
      enableOrNameAndArgs = enableOrNameAndArgs ?? "help [command]";
      const [, helpName, helpArgs] = enableOrNameAndArgs.match(/([^ ]+) *(.*)/);
      const helpDescription = description ?? "display help for command";
      const helpCommand = this.createCommand(helpName);
      helpCommand.helpOption(false);
      if (helpArgs) helpCommand.arguments(helpArgs);
      if (helpDescription) helpCommand.description(helpDescription);
      this._addImplicitHelpCommand = true;
      this._helpCommand = helpCommand;
      return this;
    }
    /**
     * Add prepared custom help command.
     *
     * @param {(Command|string|boolean)} helpCommand - custom help command, or deprecated enableOrNameAndArgs as for `.helpCommand()`
     * @param {string} [deprecatedDescription] - deprecated custom description used with custom name only
     * @return {Command} `this` command for chaining
     */
    addHelpCommand(helpCommand, deprecatedDescription) {
      if (typeof helpCommand !== "object") {
        this.helpCommand(helpCommand, deprecatedDescription);
        return this;
      }
      this._addImplicitHelpCommand = true;
      this._helpCommand = helpCommand;
      return this;
    }
    /**
     * Lazy create help command.
     *
     * @return {(Command|null)}
     * @package
     */
    _getHelpCommand() {
      const hasImplicitHelpCommand = this._addImplicitHelpCommand ?? (this.commands.length && !this._actionHandler && !this._findCommand("help"));
      if (hasImplicitHelpCommand) {
        if (this._helpCommand === void 0) {
          this.helpCommand(void 0, void 0);
        }
        return this._helpCommand;
      }
      return null;
    }
    /**
     * Add hook for life cycle event.
     *
     * @param {string} event
     * @param {Function} listener
     * @return {Command} `this` command for chaining
     */
    hook(event, listener) {
      const allowedValues = ["preSubcommand", "preAction", "postAction"];
      if (!allowedValues.includes(event)) {
        throw new Error(`Unexpected value for event passed to hook : '${event}'.
Expecting one of '${allowedValues.join("', '")}'`);
      }
      if (this._lifeCycleHooks[event]) {
        this._lifeCycleHooks[event].push(listener);
      } else {
        this._lifeCycleHooks[event] = [listener];
      }
      return this;
    }
    /**
     * Register callback to use as replacement for calling process.exit.
     *
     * @param {Function} [fn] optional callback which will be passed a CommanderError, defaults to throwing
     * @return {Command} `this` command for chaining
     */
    exitOverride(fn) {
      if (fn) {
        this._exitCallback = fn;
      } else {
        this._exitCallback = (err) => {
          if (err.code !== "commander.executeSubCommandAsync") {
            throw err;
          }
        };
      }
      return this;
    }
    /**
     * Call process.exit, and _exitCallback if defined.
     *
     * @param {number} exitCode exit code for using with process.exit
     * @param {string} code an id string representing the error
     * @param {string} message human-readable description of the error
     * @return never
     * @private
     */
    _exit(exitCode, code, message) {
      if (this._exitCallback) {
        this._exitCallback(new CommanderError2(exitCode, code, message));
      }
      process2.exit(exitCode);
    }
    /**
     * Register callback `fn` for the command.
     *
     * @example
     * program
     *   .command('serve')
     *   .description('start service')
     *   .action(function() {
     *      // do work here
     *   });
     *
     * @param {Function} fn
     * @return {Command} `this` command for chaining
     */
    action(fn) {
      const listener = (args2) => {
        const expectedArgsCount = this.registeredArguments.length;
        const actionArgs = args2.slice(0, expectedArgsCount);
        if (this._storeOptionsAsProperties) {
          actionArgs[expectedArgsCount] = this;
        } else {
          actionArgs[expectedArgsCount] = this.opts();
        }
        actionArgs.push(this);
        return fn.apply(this, actionArgs);
      };
      this._actionHandler = listener;
      return this;
    }
    /**
     * Factory routine to create a new unattached option.
     *
     * See .option() for creating an attached option, which uses this routine to
     * create the option. You can override createOption to return a custom option.
     *
     * @param {string} flags
     * @param {string} [description]
     * @return {Option} new option
     */
    createOption(flags, description) {
      return new Option2(flags, description);
    }
    /**
     * Wrap parseArgs to catch 'commander.invalidArgument'.
     *
     * @param {(Option | Argument)} target
     * @param {string} value
     * @param {*} previous
     * @param {string} invalidArgumentMessage
     * @private
     */
    _callParseArg(target, value, previous, invalidArgumentMessage) {
      try {
        return target.parseArg(value, previous);
      } catch (err) {
        if (err.code === "commander.invalidArgument") {
          const message = `${invalidArgumentMessage} ${err.message}`;
          this.error(message, { exitCode: err.exitCode, code: err.code });
        }
        throw err;
      }
    }
    /**
     * Check for option flag conflicts.
     * Register option if no conflicts found, or throw on conflict.
     *
     * @param {Option} option
     * @private
     */
    _registerOption(option2) {
      const matchingOption = option2.short && this._findOption(option2.short) || option2.long && this._findOption(option2.long);
      if (matchingOption) {
        const matchingFlag = option2.long && this._findOption(option2.long) ? option2.long : option2.short;
        throw new Error(`Cannot add option '${option2.flags}'${this._name && ` to command '${this._name}'`} due to conflicting flag '${matchingFlag}'
-  already used by option '${matchingOption.flags}'`);
      }
      this.options.push(option2);
    }
    /**
     * Check for command name and alias conflicts with existing commands.
     * Register command if no conflicts found, or throw on conflict.
     *
     * @param {Command} command
     * @private
     */
    _registerCommand(command2) {
      const knownBy = (cmd) => {
        return [cmd.name()].concat(cmd.aliases());
      };
      const alreadyUsed = knownBy(command2).find(
        (name) => this._findCommand(name)
      );
      if (alreadyUsed) {
        const existingCmd = knownBy(this._findCommand(alreadyUsed)).join("|");
        const newCmd = knownBy(command2).join("|");
        throw new Error(
          `cannot add command '${newCmd}' as already have command '${existingCmd}'`
        );
      }
      this.commands.push(command2);
    }
    /**
     * Add an option.
     *
     * @param {Option} option
     * @return {Command} `this` command for chaining
     */
    addOption(option2) {
      this._registerOption(option2);
      const oname = option2.name();
      const name = option2.attributeName();
      if (option2.negate) {
        const positiveLongFlag = option2.long.replace(/^--no-/, "--");
        if (!this._findOption(positiveLongFlag)) {
          this.setOptionValueWithSource(
            name,
            option2.defaultValue === void 0 ? true : option2.defaultValue,
            "default"
          );
        }
      } else if (option2.defaultValue !== void 0) {
        this.setOptionValueWithSource(name, option2.defaultValue, "default");
      }
      const handleOptionValue = (val, invalidValueMessage, valueSource) => {
        if (val == null && option2.presetArg !== void 0) {
          val = option2.presetArg;
        }
        const oldValue = this.getOptionValue(name);
        if (val !== null && option2.parseArg) {
          val = this._callParseArg(option2, val, oldValue, invalidValueMessage);
        } else if (val !== null && option2.variadic) {
          val = option2._concatValue(val, oldValue);
        }
        if (val == null) {
          if (option2.negate) {
            val = false;
          } else if (option2.isBoolean() || option2.optional) {
            val = true;
          } else {
            val = "";
          }
        }
        this.setOptionValueWithSource(name, val, valueSource);
      };
      this.on("option:" + oname, (val) => {
        const invalidValueMessage = `error: option '${option2.flags}' argument '${val}' is invalid.`;
        handleOptionValue(val, invalidValueMessage, "cli");
      });
      if (option2.envVar) {
        this.on("optionEnv:" + oname, (val) => {
          const invalidValueMessage = `error: option '${option2.flags}' value '${val}' from env '${option2.envVar}' is invalid.`;
          handleOptionValue(val, invalidValueMessage, "env");
        });
      }
      return this;
    }
    /**
     * Internal implementation shared by .option() and .requiredOption()
     *
     * @return {Command} `this` command for chaining
     * @private
     */
    _optionEx(config2, flags, description, fn, defaultValue) {
      if (typeof flags === "object" && flags instanceof Option2) {
        throw new Error(
          "To add an Option object use addOption() instead of option() or requiredOption()"
        );
      }
      const option2 = this.createOption(flags, description);
      option2.makeOptionMandatory(!!config2.mandatory);
      if (typeof fn === "function") {
        option2.default(defaultValue).argParser(fn);
      } else if (fn instanceof RegExp) {
        const regex = fn;
        fn = (val, def) => {
          const m = regex.exec(val);
          return m ? m[0] : def;
        };
        option2.default(defaultValue).argParser(fn);
      } else {
        option2.default(fn);
      }
      return this.addOption(option2);
    }
    /**
     * Define option with `flags`, `description`, and optional argument parsing function or `defaultValue` or both.
     *
     * The `flags` string contains the short and/or long flags, separated by comma, a pipe or space. A required
     * option-argument is indicated by `<>` and an optional option-argument by `[]`.
     *
     * See the README for more details, and see also addOption() and requiredOption().
     *
     * @example
     * program
     *     .option('-p, --pepper', 'add pepper')
     *     .option('--pt, --pizza-type <TYPE>', 'type of pizza') // required option-argument
     *     .option('-c, --cheese [CHEESE]', 'add extra cheese', 'mozzarella') // optional option-argument with default
     *     .option('-t, --tip <VALUE>', 'add tip to purchase cost', parseFloat) // custom parse function
     *
     * @param {string} flags
     * @param {string} [description]
     * @param {(Function|*)} [parseArg] - custom option processing function or default value
     * @param {*} [defaultValue]
     * @return {Command} `this` command for chaining
     */
    option(flags, description, parseArg, defaultValue) {
      return this._optionEx({}, flags, description, parseArg, defaultValue);
    }
    /**
     * Add a required option which must have a value after parsing. This usually means
     * the option must be specified on the command line. (Otherwise the same as .option().)
     *
     * The `flags` string contains the short and/or long flags, separated by comma, a pipe or space.
     *
     * @param {string} flags
     * @param {string} [description]
     * @param {(Function|*)} [parseArg] - custom option processing function or default value
     * @param {*} [defaultValue]
     * @return {Command} `this` command for chaining
     */
    requiredOption(flags, description, parseArg, defaultValue) {
      return this._optionEx(
        { mandatory: true },
        flags,
        description,
        parseArg,
        defaultValue
      );
    }
    /**
     * Alter parsing of short flags with optional values.
     *
     * @example
     * // for `.option('-f,--flag [value]'):
     * program.combineFlagAndOptionalValue(true);  // `-f80` is treated like `--flag=80`, this is the default behaviour
     * program.combineFlagAndOptionalValue(false) // `-fb` is treated like `-f -b`
     *
     * @param {boolean} [combine] - if `true` or omitted, an optional value can be specified directly after the flag.
     * @return {Command} `this` command for chaining
     */
    combineFlagAndOptionalValue(combine = true) {
      this._combineFlagAndOptionalValue = !!combine;
      return this;
    }
    /**
     * Allow unknown options on the command line.
     *
     * @param {boolean} [allowUnknown] - if `true` or omitted, no error will be thrown for unknown options.
     * @return {Command} `this` command for chaining
     */
    allowUnknownOption(allowUnknown = true) {
      this._allowUnknownOption = !!allowUnknown;
      return this;
    }
    /**
     * Allow excess command-arguments on the command line. Pass false to make excess arguments an error.
     *
     * @param {boolean} [allowExcess] - if `true` or omitted, no error will be thrown for excess arguments.
     * @return {Command} `this` command for chaining
     */
    allowExcessArguments(allowExcess = true) {
      this._allowExcessArguments = !!allowExcess;
      return this;
    }
    /**
     * Enable positional options. Positional means global options are specified before subcommands which lets
     * subcommands reuse the same option names, and also enables subcommands to turn on passThroughOptions.
     * The default behaviour is non-positional and global options may appear anywhere on the command line.
     *
     * @param {boolean} [positional]
     * @return {Command} `this` command for chaining
     */
    enablePositionalOptions(positional = true) {
      this._enablePositionalOptions = !!positional;
      return this;
    }
    /**
     * Pass through options that come after command-arguments rather than treat them as command-options,
     * so actual command-options come before command-arguments. Turning this on for a subcommand requires
     * positional options to have been enabled on the program (parent commands).
     * The default behaviour is non-positional and options may appear before or after command-arguments.
     *
     * @param {boolean} [passThrough] for unknown options.
     * @return {Command} `this` command for chaining
     */
    passThroughOptions(passThrough = true) {
      this._passThroughOptions = !!passThrough;
      this._checkForBrokenPassThrough();
      return this;
    }
    /**
     * @private
     */
    _checkForBrokenPassThrough() {
      if (this.parent && this._passThroughOptions && !this.parent._enablePositionalOptions) {
        throw new Error(
          `passThroughOptions cannot be used for '${this._name}' without turning on enablePositionalOptions for parent command(s)`
        );
      }
    }
    /**
     * Whether to store option values as properties on command object,
     * or store separately (specify false). In both cases the option values can be accessed using .opts().
     *
     * @param {boolean} [storeAsProperties=true]
     * @return {Command} `this` command for chaining
     */
    storeOptionsAsProperties(storeAsProperties = true) {
      if (this.options.length) {
        throw new Error("call .storeOptionsAsProperties() before adding options");
      }
      if (Object.keys(this._optionValues).length) {
        throw new Error(
          "call .storeOptionsAsProperties() before setting option values"
        );
      }
      this._storeOptionsAsProperties = !!storeAsProperties;
      return this;
    }
    /**
     * Retrieve option value.
     *
     * @param {string} key
     * @return {object} value
     */
    getOptionValue(key) {
      if (this._storeOptionsAsProperties) {
        return this[key];
      }
      return this._optionValues[key];
    }
    /**
     * Store option value.
     *
     * @param {string} key
     * @param {object} value
     * @return {Command} `this` command for chaining
     */
    setOptionValue(key, value) {
      return this.setOptionValueWithSource(key, value, void 0);
    }
    /**
     * Store option value and where the value came from.
     *
     * @param {string} key
     * @param {object} value
     * @param {string} source - expected values are default/config/env/cli/implied
     * @return {Command} `this` command for chaining
     */
    setOptionValueWithSource(key, value, source) {
      if (this._storeOptionsAsProperties) {
        this[key] = value;
      } else {
        this._optionValues[key] = value;
      }
      this._optionValueSources[key] = source;
      return this;
    }
    /**
     * Get source of option value.
     * Expected values are default | config | env | cli | implied
     *
     * @param {string} key
     * @return {string}
     */
    getOptionValueSource(key) {
      return this._optionValueSources[key];
    }
    /**
     * Get source of option value. See also .optsWithGlobals().
     * Expected values are default | config | env | cli | implied
     *
     * @param {string} key
     * @return {string}
     */
    getOptionValueSourceWithGlobals(key) {
      let source;
      this._getCommandAndAncestors().forEach((cmd) => {
        if (cmd.getOptionValueSource(key) !== void 0) {
          source = cmd.getOptionValueSource(key);
        }
      });
      return source;
    }
    /**
     * Get user arguments from implied or explicit arguments.
     * Side-effects: set _scriptPath if args included script. Used for default program name, and subcommand searches.
     *
     * @private
     */
    _prepareUserArgs(argv, parseOptions) {
      if (argv !== void 0 && !Array.isArray(argv)) {
        throw new Error("first parameter to parse must be array or undefined");
      }
      parseOptions = parseOptions || {};
      if (argv === void 0 && parseOptions.from === void 0) {
        if (process2.versions?.electron) {
          parseOptions.from = "electron";
        }
        const execArgv = process2.execArgv ?? [];
        if (execArgv.includes("-e") || execArgv.includes("--eval") || execArgv.includes("-p") || execArgv.includes("--print")) {
          parseOptions.from = "eval";
        }
      }
      if (argv === void 0) {
        argv = process2.argv;
      }
      this.rawArgs = argv.slice();
      let userArgs;
      switch (parseOptions.from) {
        case void 0:
        case "node":
          this._scriptPath = argv[1];
          userArgs = argv.slice(2);
          break;
        case "electron":
          if (process2.defaultApp) {
            this._scriptPath = argv[1];
            userArgs = argv.slice(2);
          } else {
            userArgs = argv.slice(1);
          }
          break;
        case "user":
          userArgs = argv.slice(0);
          break;
        case "eval":
          userArgs = argv.slice(1);
          break;
        default:
          throw new Error(
            `unexpected parse option { from: '${parseOptions.from}' }`
          );
      }
      if (!this._name && this._scriptPath)
        this.nameFromFilename(this._scriptPath);
      this._name = this._name || "program";
      return userArgs;
    }
    /**
     * Parse `argv`, setting options and invoking commands when defined.
     *
     * Use parseAsync instead of parse if any of your action handlers are async.
     *
     * Call with no parameters to parse `process.argv`. Detects Electron and special node options like `node --eval`. Easy mode!
     *
     * Or call with an array of strings to parse, and optionally where the user arguments start by specifying where the arguments are `from`:
     * - `'node'`: default, `argv[0]` is the application and `argv[1]` is the script being run, with user arguments after that
     * - `'electron'`: `argv[0]` is the application and `argv[1]` varies depending on whether the electron application is packaged
     * - `'user'`: just user arguments
     *
     * @example
     * program.parse(); // parse process.argv and auto-detect electron and special node flags
     * program.parse(process.argv); // assume argv[0] is app and argv[1] is script
     * program.parse(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
     *
     * @param {string[]} [argv] - optional, defaults to process.argv
     * @param {object} [parseOptions] - optionally specify style of options with from: node/user/electron
     * @param {string} [parseOptions.from] - where the args are from: 'node', 'user', 'electron'
     * @return {Command} `this` command for chaining
     */
    parse(argv, parseOptions) {
      this._prepareForParse();
      const userArgs = this._prepareUserArgs(argv, parseOptions);
      this._parseCommand([], userArgs);
      return this;
    }
    /**
     * Parse `argv`, setting options and invoking commands when defined.
     *
     * Call with no parameters to parse `process.argv`. Detects Electron and special node options like `node --eval`. Easy mode!
     *
     * Or call with an array of strings to parse, and optionally where the user arguments start by specifying where the arguments are `from`:
     * - `'node'`: default, `argv[0]` is the application and `argv[1]` is the script being run, with user arguments after that
     * - `'electron'`: `argv[0]` is the application and `argv[1]` varies depending on whether the electron application is packaged
     * - `'user'`: just user arguments
     *
     * @example
     * await program.parseAsync(); // parse process.argv and auto-detect electron and special node flags
     * await program.parseAsync(process.argv); // assume argv[0] is app and argv[1] is script
     * await program.parseAsync(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
     *
     * @param {string[]} [argv]
     * @param {object} [parseOptions]
     * @param {string} parseOptions.from - where the args are from: 'node', 'user', 'electron'
     * @return {Promise}
     */
    async parseAsync(argv, parseOptions) {
      this._prepareForParse();
      const userArgs = this._prepareUserArgs(argv, parseOptions);
      await this._parseCommand([], userArgs);
      return this;
    }
    _prepareForParse() {
      if (this._savedState === null) {
        this.saveStateBeforeParse();
      } else {
        this.restoreStateBeforeParse();
      }
    }
    /**
     * Called the first time parse is called to save state and allow a restore before subsequent calls to parse.
     * Not usually called directly, but available for subclasses to save their custom state.
     *
     * This is called in a lazy way. Only commands used in parsing chain will have state saved.
     */
    saveStateBeforeParse() {
      this._savedState = {
        // name is stable if supplied by author, but may be unspecified for root command and deduced during parsing
        _name: this._name,
        // option values before parse have default values (including false for negated options)
        // shallow clones
        _optionValues: { ...this._optionValues },
        _optionValueSources: { ...this._optionValueSources }
      };
    }
    /**
     * Restore state before parse for calls after the first.
     * Not usually called directly, but available for subclasses to save their custom state.
     *
     * This is called in a lazy way. Only commands used in parsing chain will have state restored.
     */
    restoreStateBeforeParse() {
      if (this._storeOptionsAsProperties)
        throw new Error(`Can not call parse again when storeOptionsAsProperties is true.
- either make a new Command for each call to parse, or stop storing options as properties`);
      this._name = this._savedState._name;
      this._scriptPath = null;
      this.rawArgs = [];
      this._optionValues = { ...this._savedState._optionValues };
      this._optionValueSources = { ...this._savedState._optionValueSources };
      this.args = [];
      this.processedArgs = [];
    }
    /**
     * Throw if expected executable is missing. Add lots of help for author.
     *
     * @param {string} executableFile
     * @param {string} executableDir
     * @param {string} subcommandName
     */
    _checkForMissingExecutable(executableFile, executableDir, subcommandName) {
      if (fs2.existsSync(executableFile)) return;
      const executableDirMessage = executableDir ? `searched for local subcommand relative to directory '${executableDir}'` : "no directory for search for local subcommand, use .executableDir() to supply a custom directory";
      const executableMissing = `'${executableFile}' does not exist
 - if '${subcommandName}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${executableDirMessage}`;
      throw new Error(executableMissing);
    }
    /**
     * Execute a sub-command executable.
     *
     * @private
     */
    _executeSubCommand(subcommand, args2) {
      args2 = args2.slice();
      let launchWithNode = false;
      const sourceExt = [".js", ".ts", ".tsx", ".mjs", ".cjs"];
      function findFile(baseDir, baseName) {
        const localBin = path2.resolve(baseDir, baseName);
        if (fs2.existsSync(localBin)) return localBin;
        if (sourceExt.includes(path2.extname(baseName))) return void 0;
        const foundExt = sourceExt.find(
          (ext) => fs2.existsSync(`${localBin}${ext}`)
        );
        if (foundExt) return `${localBin}${foundExt}`;
        return void 0;
      }
      this._checkForMissingMandatoryOptions();
      this._checkForConflictingOptions();
      let executableFile = subcommand._executableFile || `${this._name}-${subcommand._name}`;
      let executableDir = this._executableDir || "";
      if (this._scriptPath) {
        let resolvedScriptPath;
        try {
          resolvedScriptPath = fs2.realpathSync(this._scriptPath);
        } catch {
          resolvedScriptPath = this._scriptPath;
        }
        executableDir = path2.resolve(
          path2.dirname(resolvedScriptPath),
          executableDir
        );
      }
      if (executableDir) {
        let localFile = findFile(executableDir, executableFile);
        if (!localFile && !subcommand._executableFile && this._scriptPath) {
          const legacyName = path2.basename(
            this._scriptPath,
            path2.extname(this._scriptPath)
          );
          if (legacyName !== this._name) {
            localFile = findFile(
              executableDir,
              `${legacyName}-${subcommand._name}`
            );
          }
        }
        executableFile = localFile || executableFile;
      }
      launchWithNode = sourceExt.includes(path2.extname(executableFile));
      let proc;
      if (process2.platform !== "win32") {
        if (launchWithNode) {
          args2.unshift(executableFile);
          args2 = incrementNodeInspectorPort(process2.execArgv).concat(args2);
          proc = childProcess.spawn(process2.argv[0], args2, { stdio: "inherit" });
        } else {
          proc = childProcess.spawn(executableFile, args2, { stdio: "inherit" });
        }
      } else {
        this._checkForMissingExecutable(
          executableFile,
          executableDir,
          subcommand._name
        );
        args2.unshift(executableFile);
        args2 = incrementNodeInspectorPort(process2.execArgv).concat(args2);
        proc = childProcess.spawn(process2.execPath, args2, { stdio: "inherit" });
      }
      if (!proc.killed) {
        const signals2 = ["SIGUSR1", "SIGUSR2", "SIGTERM", "SIGINT", "SIGHUP"];
        signals2.forEach((signal) => {
          process2.on(signal, () => {
            if (proc.killed === false && proc.exitCode === null) {
              proc.kill(signal);
            }
          });
        });
      }
      const exitCallback = this._exitCallback;
      proc.on("close", (code) => {
        code = code ?? 1;
        if (!exitCallback) {
          process2.exit(code);
        } else {
          exitCallback(
            new CommanderError2(
              code,
              "commander.executeSubCommandAsync",
              "(close)"
            )
          );
        }
      });
      proc.on("error", (err) => {
        if (err.code === "ENOENT") {
          this._checkForMissingExecutable(
            executableFile,
            executableDir,
            subcommand._name
          );
        } else if (err.code === "EACCES") {
          throw new Error(`'${executableFile}' not executable`);
        }
        if (!exitCallback) {
          process2.exit(1);
        } else {
          const wrappedError = new CommanderError2(
            1,
            "commander.executeSubCommandAsync",
            "(error)"
          );
          wrappedError.nestedError = err;
          exitCallback(wrappedError);
        }
      });
      this.runningCommand = proc;
    }
    /**
     * @private
     */
    _dispatchSubcommand(commandName, operands, unknown) {
      const subCommand = this._findCommand(commandName);
      if (!subCommand) this.help({ error: true });
      subCommand._prepareForParse();
      let promiseChain;
      promiseChain = this._chainOrCallSubCommandHook(
        promiseChain,
        subCommand,
        "preSubcommand"
      );
      promiseChain = this._chainOrCall(promiseChain, () => {
        if (subCommand._executableHandler) {
          this._executeSubCommand(subCommand, operands.concat(unknown));
        } else {
          return subCommand._parseCommand(operands, unknown);
        }
      });
      return promiseChain;
    }
    /**
     * Invoke help directly if possible, or dispatch if necessary.
     * e.g. help foo
     *
     * @private
     */
    _dispatchHelpCommand(subcommandName) {
      if (!subcommandName) {
        this.help();
      }
      const subCommand = this._findCommand(subcommandName);
      if (subCommand && !subCommand._executableHandler) {
        subCommand.help();
      }
      return this._dispatchSubcommand(
        subcommandName,
        [],
        [this._getHelpOption()?.long ?? this._getHelpOption()?.short ?? "--help"]
      );
    }
    /**
     * Check this.args against expected this.registeredArguments.
     *
     * @private
     */
    _checkNumberOfArguments() {
      this.registeredArguments.forEach((arg, i) => {
        if (arg.required && this.args[i] == null) {
          this.missingArgument(arg.name());
        }
      });
      if (this.registeredArguments.length > 0 && this.registeredArguments[this.registeredArguments.length - 1].variadic) {
        return;
      }
      if (this.args.length > this.registeredArguments.length) {
        this._excessArguments(this.args);
      }
    }
    /**
     * Process this.args using this.registeredArguments and save as this.processedArgs!
     *
     * @private
     */
    _processArguments() {
      const myParseArg = (argument2, value, previous) => {
        let parsedValue = value;
        if (value !== null && argument2.parseArg) {
          const invalidValueMessage = `error: command-argument value '${value}' is invalid for argument '${argument2.name()}'.`;
          parsedValue = this._callParseArg(
            argument2,
            value,
            previous,
            invalidValueMessage
          );
        }
        return parsedValue;
      };
      this._checkNumberOfArguments();
      const processedArgs = [];
      this.registeredArguments.forEach((declaredArg, index) => {
        let value = declaredArg.defaultValue;
        if (declaredArg.variadic) {
          if (index < this.args.length) {
            value = this.args.slice(index);
            if (declaredArg.parseArg) {
              value = value.reduce((processed, v) => {
                return myParseArg(declaredArg, v, processed);
              }, declaredArg.defaultValue);
            }
          } else if (value === void 0) {
            value = [];
          }
        } else if (index < this.args.length) {
          value = this.args[index];
          if (declaredArg.parseArg) {
            value = myParseArg(declaredArg, value, declaredArg.defaultValue);
          }
        }
        processedArgs[index] = value;
      });
      this.processedArgs = processedArgs;
    }
    /**
     * Once we have a promise we chain, but call synchronously until then.
     *
     * @param {(Promise|undefined)} promise
     * @param {Function} fn
     * @return {(Promise|undefined)}
     * @private
     */
    _chainOrCall(promise, fn) {
      if (promise && promise.then && typeof promise.then === "function") {
        return promise.then(() => fn());
      }
      return fn();
    }
    /**
     *
     * @param {(Promise|undefined)} promise
     * @param {string} event
     * @return {(Promise|undefined)}
     * @private
     */
    _chainOrCallHooks(promise, event) {
      let result = promise;
      const hooks = [];
      this._getCommandAndAncestors().reverse().filter((cmd) => cmd._lifeCycleHooks[event] !== void 0).forEach((hookedCommand) => {
        hookedCommand._lifeCycleHooks[event].forEach((callback) => {
          hooks.push({ hookedCommand, callback });
        });
      });
      if (event === "postAction") {
        hooks.reverse();
      }
      hooks.forEach((hookDetail) => {
        result = this._chainOrCall(result, () => {
          return hookDetail.callback(hookDetail.hookedCommand, this);
        });
      });
      return result;
    }
    /**
     *
     * @param {(Promise|undefined)} promise
     * @param {Command} subCommand
     * @param {string} event
     * @return {(Promise|undefined)}
     * @private
     */
    _chainOrCallSubCommandHook(promise, subCommand, event) {
      let result = promise;
      if (this._lifeCycleHooks[event] !== void 0) {
        this._lifeCycleHooks[event].forEach((hook) => {
          result = this._chainOrCall(result, () => {
            return hook(this, subCommand);
          });
        });
      }
      return result;
    }
    /**
     * Process arguments in context of this command.
     * Returns action result, in case it is a promise.
     *
     * @private
     */
    _parseCommand(operands, unknown) {
      const parsed = this.parseOptions(unknown);
      this._parseOptionsEnv();
      this._parseOptionsImplied();
      operands = operands.concat(parsed.operands);
      unknown = parsed.unknown;
      this.args = operands.concat(unknown);
      if (operands && this._findCommand(operands[0])) {
        return this._dispatchSubcommand(operands[0], operands.slice(1), unknown);
      }
      if (this._getHelpCommand() && operands[0] === this._getHelpCommand().name()) {
        return this._dispatchHelpCommand(operands[1]);
      }
      if (this._defaultCommandName) {
        this._outputHelpIfRequested(unknown);
        return this._dispatchSubcommand(
          this._defaultCommandName,
          operands,
          unknown
        );
      }
      if (this.commands.length && this.args.length === 0 && !this._actionHandler && !this._defaultCommandName) {
        this.help({ error: true });
      }
      this._outputHelpIfRequested(parsed.unknown);
      this._checkForMissingMandatoryOptions();
      this._checkForConflictingOptions();
      const checkForUnknownOptions = () => {
        if (parsed.unknown.length > 0) {
          this.unknownOption(parsed.unknown[0]);
        }
      };
      const commandEvent = `command:${this.name()}`;
      if (this._actionHandler) {
        checkForUnknownOptions();
        this._processArguments();
        let promiseChain;
        promiseChain = this._chainOrCallHooks(promiseChain, "preAction");
        promiseChain = this._chainOrCall(
          promiseChain,
          () => this._actionHandler(this.processedArgs)
        );
        if (this.parent) {
          promiseChain = this._chainOrCall(promiseChain, () => {
            this.parent.emit(commandEvent, operands, unknown);
          });
        }
        promiseChain = this._chainOrCallHooks(promiseChain, "postAction");
        return promiseChain;
      }
      if (this.parent && this.parent.listenerCount(commandEvent)) {
        checkForUnknownOptions();
        this._processArguments();
        this.parent.emit(commandEvent, operands, unknown);
      } else if (operands.length) {
        if (this._findCommand("*")) {
          return this._dispatchSubcommand("*", operands, unknown);
        }
        if (this.listenerCount("command:*")) {
          this.emit("command:*", operands, unknown);
        } else if (this.commands.length) {
          this.unknownCommand();
        } else {
          checkForUnknownOptions();
          this._processArguments();
        }
      } else if (this.commands.length) {
        checkForUnknownOptions();
        this.help({ error: true });
      } else {
        checkForUnknownOptions();
        this._processArguments();
      }
    }
    /**
     * Find matching command.
     *
     * @private
     * @return {Command | undefined}
     */
    _findCommand(name) {
      if (!name) return void 0;
      return this.commands.find(
        (cmd) => cmd._name === name || cmd._aliases.includes(name)
      );
    }
    /**
     * Return an option matching `arg` if any.
     *
     * @param {string} arg
     * @return {Option}
     * @package
     */
    _findOption(arg) {
      return this.options.find((option2) => option2.is(arg));
    }
    /**
     * Display an error message if a mandatory option does not have a value.
     * Called after checking for help flags in leaf subcommand.
     *
     * @private
     */
    _checkForMissingMandatoryOptions() {
      this._getCommandAndAncestors().forEach((cmd) => {
        cmd.options.forEach((anOption) => {
          if (anOption.mandatory && cmd.getOptionValue(anOption.attributeName()) === void 0) {
            cmd.missingMandatoryOptionValue(anOption);
          }
        });
      });
    }
    /**
     * Display an error message if conflicting options are used together in this.
     *
     * @private
     */
    _checkForConflictingLocalOptions() {
      const definedNonDefaultOptions = this.options.filter((option2) => {
        const optionKey = option2.attributeName();
        if (this.getOptionValue(optionKey) === void 0) {
          return false;
        }
        return this.getOptionValueSource(optionKey) !== "default";
      });
      const optionsWithConflicting = definedNonDefaultOptions.filter(
        (option2) => option2.conflictsWith.length > 0
      );
      optionsWithConflicting.forEach((option2) => {
        const conflictingAndDefined = definedNonDefaultOptions.find(
          (defined) => option2.conflictsWith.includes(defined.attributeName())
        );
        if (conflictingAndDefined) {
          this._conflictingOption(option2, conflictingAndDefined);
        }
      });
    }
    /**
     * Display an error message if conflicting options are used together.
     * Called after checking for help flags in leaf subcommand.
     *
     * @private
     */
    _checkForConflictingOptions() {
      this._getCommandAndAncestors().forEach((cmd) => {
        cmd._checkForConflictingLocalOptions();
      });
    }
    /**
     * Parse options from `argv` removing known options,
     * and return argv split into operands and unknown arguments.
     *
     * Side effects: modifies command by storing options. Does not reset state if called again.
     *
     * Examples:
     *
     *     argv => operands, unknown
     *     --known kkk op => [op], []
     *     op --known kkk => [op], []
     *     sub --unknown uuu op => [sub], [--unknown uuu op]
     *     sub -- --unknown uuu op => [sub --unknown uuu op], []
     *
     * @param {string[]} argv
     * @return {{operands: string[], unknown: string[]}}
     */
    parseOptions(argv) {
      const operands = [];
      const unknown = [];
      let dest = operands;
      const args2 = argv.slice();
      function maybeOption(arg) {
        return arg.length > 1 && arg[0] === "-";
      }
      let activeVariadicOption = null;
      while (args2.length) {
        const arg = args2.shift();
        if (arg === "--") {
          if (dest === unknown) dest.push(arg);
          dest.push(...args2);
          break;
        }
        if (activeVariadicOption && !maybeOption(arg)) {
          this.emit(`option:${activeVariadicOption.name()}`, arg);
          continue;
        }
        activeVariadicOption = null;
        if (maybeOption(arg)) {
          const option2 = this._findOption(arg);
          if (option2) {
            if (option2.required) {
              const value = args2.shift();
              if (value === void 0) this.optionMissingArgument(option2);
              this.emit(`option:${option2.name()}`, value);
            } else if (option2.optional) {
              let value = null;
              if (args2.length > 0 && !maybeOption(args2[0])) {
                value = args2.shift();
              }
              this.emit(`option:${option2.name()}`, value);
            } else {
              this.emit(`option:${option2.name()}`);
            }
            activeVariadicOption = option2.variadic ? option2 : null;
            continue;
          }
        }
        if (arg.length > 2 && arg[0] === "-" && arg[1] !== "-") {
          const option2 = this._findOption(`-${arg[1]}`);
          if (option2) {
            if (option2.required || option2.optional && this._combineFlagAndOptionalValue) {
              this.emit(`option:${option2.name()}`, arg.slice(2));
            } else {
              this.emit(`option:${option2.name()}`);
              args2.unshift(`-${arg.slice(2)}`);
            }
            continue;
          }
        }
        if (/^--[^=]+=/.test(arg)) {
          const index = arg.indexOf("=");
          const option2 = this._findOption(arg.slice(0, index));
          if (option2 && (option2.required || option2.optional)) {
            this.emit(`option:${option2.name()}`, arg.slice(index + 1));
            continue;
          }
        }
        if (maybeOption(arg)) {
          dest = unknown;
        }
        if ((this._enablePositionalOptions || this._passThroughOptions) && operands.length === 0 && unknown.length === 0) {
          if (this._findCommand(arg)) {
            operands.push(arg);
            if (args2.length > 0) unknown.push(...args2);
            break;
          } else if (this._getHelpCommand() && arg === this._getHelpCommand().name()) {
            operands.push(arg);
            if (args2.length > 0) operands.push(...args2);
            break;
          } else if (this._defaultCommandName) {
            unknown.push(arg);
            if (args2.length > 0) unknown.push(...args2);
            break;
          }
        }
        if (this._passThroughOptions) {
          dest.push(arg);
          if (args2.length > 0) dest.push(...args2);
          break;
        }
        dest.push(arg);
      }
      return { operands, unknown };
    }
    /**
     * Return an object containing local option values as key-value pairs.
     *
     * @return {object}
     */
    opts() {
      if (this._storeOptionsAsProperties) {
        const result = {};
        const len = this.options.length;
        for (let i = 0; i < len; i++) {
          const key = this.options[i].attributeName();
          result[key] = key === this._versionOptionName ? this._version : this[key];
        }
        return result;
      }
      return this._optionValues;
    }
    /**
     * Return an object containing merged local and global option values as key-value pairs.
     *
     * @return {object}
     */
    optsWithGlobals() {
      return this._getCommandAndAncestors().reduce(
        (combinedOptions, cmd) => Object.assign(combinedOptions, cmd.opts()),
        {}
      );
    }
    /**
     * Display error message and exit (or call exitOverride).
     *
     * @param {string} message
     * @param {object} [errorOptions]
     * @param {string} [errorOptions.code] - an id string representing the error
     * @param {number} [errorOptions.exitCode] - used with process.exit
     */
    error(message, errorOptions) {
      this._outputConfiguration.outputError(
        `${message}
`,
        this._outputConfiguration.writeErr
      );
      if (typeof this._showHelpAfterError === "string") {
        this._outputConfiguration.writeErr(`${this._showHelpAfterError}
`);
      } else if (this._showHelpAfterError) {
        this._outputConfiguration.writeErr("\n");
        this.outputHelp({ error: true });
      }
      const config2 = errorOptions || {};
      const exitCode = config2.exitCode || 1;
      const code = config2.code || "commander.error";
      this._exit(exitCode, code, message);
    }
    /**
     * Apply any option related environment variables, if option does
     * not have a value from cli or client code.
     *
     * @private
     */
    _parseOptionsEnv() {
      this.options.forEach((option2) => {
        if (option2.envVar && option2.envVar in process2.env) {
          const optionKey = option2.attributeName();
          if (this.getOptionValue(optionKey) === void 0 || ["default", "config", "env"].includes(
            this.getOptionValueSource(optionKey)
          )) {
            if (option2.required || option2.optional) {
              this.emit(`optionEnv:${option2.name()}`, process2.env[option2.envVar]);
            } else {
              this.emit(`optionEnv:${option2.name()}`);
            }
          }
        }
      });
    }
    /**
     * Apply any implied option values, if option is undefined or default value.
     *
     * @private
     */
    _parseOptionsImplied() {
      const dualHelper = new DualOptions(this.options);
      const hasCustomOptionValue = (optionKey) => {
        return this.getOptionValue(optionKey) !== void 0 && !["default", "implied"].includes(this.getOptionValueSource(optionKey));
      };
      this.options.filter(
        (option2) => option2.implied !== void 0 && hasCustomOptionValue(option2.attributeName()) && dualHelper.valueFromOption(
          this.getOptionValue(option2.attributeName()),
          option2
        )
      ).forEach((option2) => {
        Object.keys(option2.implied).filter((impliedKey) => !hasCustomOptionValue(impliedKey)).forEach((impliedKey) => {
          this.setOptionValueWithSource(
            impliedKey,
            option2.implied[impliedKey],
            "implied"
          );
        });
      });
    }
    /**
     * Argument `name` is missing.
     *
     * @param {string} name
     * @private
     */
    missingArgument(name) {
      const message = `error: missing required argument '${name}'`;
      this.error(message, { code: "commander.missingArgument" });
    }
    /**
     * `Option` is missing an argument.
     *
     * @param {Option} option
     * @private
     */
    optionMissingArgument(option2) {
      const message = `error: option '${option2.flags}' argument missing`;
      this.error(message, { code: "commander.optionMissingArgument" });
    }
    /**
     * `Option` does not have a value, and is a mandatory option.
     *
     * @param {Option} option
     * @private
     */
    missingMandatoryOptionValue(option2) {
      const message = `error: required option '${option2.flags}' not specified`;
      this.error(message, { code: "commander.missingMandatoryOptionValue" });
    }
    /**
     * `Option` conflicts with another option.
     *
     * @param {Option} option
     * @param {Option} conflictingOption
     * @private
     */
    _conflictingOption(option2, conflictingOption) {
      const findBestOptionFromValue = (option3) => {
        const optionKey = option3.attributeName();
        const optionValue = this.getOptionValue(optionKey);
        const negativeOption = this.options.find(
          (target) => target.negate && optionKey === target.attributeName()
        );
        const positiveOption = this.options.find(
          (target) => !target.negate && optionKey === target.attributeName()
        );
        if (negativeOption && (negativeOption.presetArg === void 0 && optionValue === false || negativeOption.presetArg !== void 0 && optionValue === negativeOption.presetArg)) {
          return negativeOption;
        }
        return positiveOption || option3;
      };
      const getErrorMessage = (option3) => {
        const bestOption = findBestOptionFromValue(option3);
        const optionKey = bestOption.attributeName();
        const source = this.getOptionValueSource(optionKey);
        if (source === "env") {
          return `environment variable '${bestOption.envVar}'`;
        }
        return `option '${bestOption.flags}'`;
      };
      const message = `error: ${getErrorMessage(option2)} cannot be used with ${getErrorMessage(conflictingOption)}`;
      this.error(message, { code: "commander.conflictingOption" });
    }
    /**
     * Unknown option `flag`.
     *
     * @param {string} flag
     * @private
     */
    unknownOption(flag) {
      if (this._allowUnknownOption) return;
      let suggestion = "";
      if (flag.startsWith("--") && this._showSuggestionAfterError) {
        let candidateFlags = [];
        let command2 = this;
        do {
          const moreFlags = command2.createHelp().visibleOptions(command2).filter((option2) => option2.long).map((option2) => option2.long);
          candidateFlags = candidateFlags.concat(moreFlags);
          command2 = command2.parent;
        } while (command2 && !command2._enablePositionalOptions);
        suggestion = suggestSimilar2(flag, candidateFlags);
      }
      const message = `error: unknown option '${flag}'${suggestion}`;
      this.error(message, { code: "commander.unknownOption" });
    }
    /**
     * Excess arguments, more than expected.
     *
     * @param {string[]} receivedArgs
     * @private
     */
    _excessArguments(receivedArgs) {
      if (this._allowExcessArguments) return;
      const expected = this.registeredArguments.length;
      const s = expected === 1 ? "" : "s";
      const forSubcommand = this.parent ? ` for '${this.name()}'` : "";
      const message = `error: too many arguments${forSubcommand}. Expected ${expected} argument${s} but got ${receivedArgs.length}.`;
      this.error(message, { code: "commander.excessArguments" });
    }
    /**
     * Unknown command.
     *
     * @private
     */
    unknownCommand() {
      const unknownName = this.args[0];
      let suggestion = "";
      if (this._showSuggestionAfterError) {
        const candidateNames = [];
        this.createHelp().visibleCommands(this).forEach((command2) => {
          candidateNames.push(command2.name());
          if (command2.alias()) candidateNames.push(command2.alias());
        });
        suggestion = suggestSimilar2(unknownName, candidateNames);
      }
      const message = `error: unknown command '${unknownName}'${suggestion}`;
      this.error(message, { code: "commander.unknownCommand" });
    }
    /**
     * Get or set the program version.
     *
     * This method auto-registers the "-V, --version" option which will print the version number.
     *
     * You can optionally supply the flags and description to override the defaults.
     *
     * @param {string} [str]
     * @param {string} [flags]
     * @param {string} [description]
     * @return {(this | string | undefined)} `this` command for chaining, or version string if no arguments
     */
    version(str, flags, description) {
      if (str === void 0) return this._version;
      this._version = str;
      flags = flags || "-V, --version";
      description = description || "output the version number";
      const versionOption = this.createOption(flags, description);
      this._versionOptionName = versionOption.attributeName();
      this._registerOption(versionOption);
      this.on("option:" + versionOption.name(), () => {
        this._outputConfiguration.writeOut(`${str}
`);
        this._exit(0, "commander.version", str);
      });
      return this;
    }
    /**
     * Set the description.
     *
     * @param {string} [str]
     * @param {object} [argsDescription]
     * @return {(string|Command)}
     */
    description(str, argsDescription) {
      if (str === void 0 && argsDescription === void 0)
        return this._description;
      this._description = str;
      if (argsDescription) {
        this._argsDescription = argsDescription;
      }
      return this;
    }
    /**
     * Set the summary. Used when listed as subcommand of parent.
     *
     * @param {string} [str]
     * @return {(string|Command)}
     */
    summary(str) {
      if (str === void 0) return this._summary;
      this._summary = str;
      return this;
    }
    /**
     * Set an alias for the command.
     *
     * You may call more than once to add multiple aliases. Only the first alias is shown in the auto-generated help.
     *
     * @param {string} [alias]
     * @return {(string|Command)}
     */
    alias(alias) {
      if (alias === void 0) return this._aliases[0];
      let command2 = this;
      if (this.commands.length !== 0 && this.commands[this.commands.length - 1]._executableHandler) {
        command2 = this.commands[this.commands.length - 1];
      }
      if (alias === command2._name)
        throw new Error("Command alias can't be the same as its name");
      const matchingCommand = this.parent?._findCommand(alias);
      if (matchingCommand) {
        const existingCmd = [matchingCommand.name()].concat(matchingCommand.aliases()).join("|");
        throw new Error(
          `cannot add alias '${alias}' to command '${this.name()}' as already have command '${existingCmd}'`
        );
      }
      command2._aliases.push(alias);
      return this;
    }
    /**
     * Set aliases for the command.
     *
     * Only the first alias is shown in the auto-generated help.
     *
     * @param {string[]} [aliases]
     * @return {(string[]|Command)}
     */
    aliases(aliases) {
      if (aliases === void 0) return this._aliases;
      aliases.forEach((alias) => this.alias(alias));
      return this;
    }
    /**
     * Set / get the command usage `str`.
     *
     * @param {string} [str]
     * @return {(string|Command)}
     */
    usage(str) {
      if (str === void 0) {
        if (this._usage) return this._usage;
        const args2 = this.registeredArguments.map((arg) => {
          return humanReadableArgName(arg);
        });
        return [].concat(
          this.options.length || this._helpOption !== null ? "[options]" : [],
          this.commands.length ? "[command]" : [],
          this.registeredArguments.length ? args2 : []
        ).join(" ");
      }
      this._usage = str;
      return this;
    }
    /**
     * Get or set the name of the command.
     *
     * @param {string} [str]
     * @return {(string|Command)}
     */
    name(str) {
      if (str === void 0) return this._name;
      this._name = str;
      return this;
    }
    /**
     * Set the name of the command from script filename, such as process.argv[1],
     * or require.main.filename, or __filename.
     *
     * (Used internally and public although not documented in README.)
     *
     * @example
     * program.nameFromFilename(require.main.filename);
     *
     * @param {string} filename
     * @return {Command}
     */
    nameFromFilename(filename) {
      this._name = path2.basename(filename, path2.extname(filename));
      return this;
    }
    /**
     * Get or set the directory for searching for executable subcommands of this command.
     *
     * @example
     * program.executableDir(__dirname);
     * // or
     * program.executableDir('subcommands');
     *
     * @param {string} [path]
     * @return {(string|null|Command)}
     */
    executableDir(path3) {
      if (path3 === void 0) return this._executableDir;
      this._executableDir = path3;
      return this;
    }
    /**
     * Return program help documentation.
     *
     * @param {{ error: boolean }} [contextOptions] - pass {error:true} to wrap for stderr instead of stdout
     * @return {string}
     */
    helpInformation(contextOptions) {
      const helper = this.createHelp();
      const context = this._getOutputContext(contextOptions);
      helper.prepareContext({
        error: context.error,
        helpWidth: context.helpWidth,
        outputHasColors: context.hasColors
      });
      const text = helper.formatHelp(this, helper);
      if (context.hasColors) return text;
      return this._outputConfiguration.stripColor(text);
    }
    /**
     * @typedef HelpContext
     * @type {object}
     * @property {boolean} error
     * @property {number} helpWidth
     * @property {boolean} hasColors
     * @property {function} write - includes stripColor if needed
     *
     * @returns {HelpContext}
     * @private
     */
    _getOutputContext(contextOptions) {
      contextOptions = contextOptions || {};
      const error2 = !!contextOptions.error;
      let baseWrite;
      let hasColors;
      let helpWidth;
      if (error2) {
        baseWrite = (str) => this._outputConfiguration.writeErr(str);
        hasColors = this._outputConfiguration.getErrHasColors();
        helpWidth = this._outputConfiguration.getErrHelpWidth();
      } else {
        baseWrite = (str) => this._outputConfiguration.writeOut(str);
        hasColors = this._outputConfiguration.getOutHasColors();
        helpWidth = this._outputConfiguration.getOutHelpWidth();
      }
      const write = (str) => {
        if (!hasColors) str = this._outputConfiguration.stripColor(str);
        return baseWrite(str);
      };
      return { error: error2, write, hasColors, helpWidth };
    }
    /**
     * Output help information for this command.
     *
     * Outputs built-in help, and custom text added using `.addHelpText()`.
     *
     * @param {{ error: boolean } | Function} [contextOptions] - pass {error:true} to write to stderr instead of stdout
     */
    outputHelp(contextOptions) {
      let deprecatedCallback;
      if (typeof contextOptions === "function") {
        deprecatedCallback = contextOptions;
        contextOptions = void 0;
      }
      const outputContext = this._getOutputContext(contextOptions);
      const eventContext = {
        error: outputContext.error,
        write: outputContext.write,
        command: this
      };
      this._getCommandAndAncestors().reverse().forEach((command2) => command2.emit("beforeAllHelp", eventContext));
      this.emit("beforeHelp", eventContext);
      let helpInformation = this.helpInformation({ error: outputContext.error });
      if (deprecatedCallback) {
        helpInformation = deprecatedCallback(helpInformation);
        if (typeof helpInformation !== "string" && !Buffer.isBuffer(helpInformation)) {
          throw new Error("outputHelp callback must return a string or a Buffer");
        }
      }
      outputContext.write(helpInformation);
      if (this._getHelpOption()?.long) {
        this.emit(this._getHelpOption().long);
      }
      this.emit("afterHelp", eventContext);
      this._getCommandAndAncestors().forEach(
        (command2) => command2.emit("afterAllHelp", eventContext)
      );
    }
    /**
     * You can pass in flags and a description to customise the built-in help option.
     * Pass in false to disable the built-in help option.
     *
     * @example
     * program.helpOption('-?, --help' 'show help'); // customise
     * program.helpOption(false); // disable
     *
     * @param {(string | boolean)} flags
     * @param {string} [description]
     * @return {Command} `this` command for chaining
     */
    helpOption(flags, description) {
      if (typeof flags === "boolean") {
        if (flags) {
          this._helpOption = this._helpOption ?? void 0;
        } else {
          this._helpOption = null;
        }
        return this;
      }
      flags = flags ?? "-h, --help";
      description = description ?? "display help for command";
      this._helpOption = this.createOption(flags, description);
      return this;
    }
    /**
     * Lazy create help option.
     * Returns null if has been disabled with .helpOption(false).
     *
     * @returns {(Option | null)} the help option
     * @package
     */
    _getHelpOption() {
      if (this._helpOption === void 0) {
        this.helpOption(void 0, void 0);
      }
      return this._helpOption;
    }
    /**
     * Supply your own option to use for the built-in help option.
     * This is an alternative to using helpOption() to customise the flags and description etc.
     *
     * @param {Option} option
     * @return {Command} `this` command for chaining
     */
    addHelpOption(option2) {
      this._helpOption = option2;
      return this;
    }
    /**
     * Output help information and exit.
     *
     * Outputs built-in help, and custom text added using `.addHelpText()`.
     *
     * @param {{ error: boolean }} [contextOptions] - pass {error:true} to write to stderr instead of stdout
     */
    help(contextOptions) {
      this.outputHelp(contextOptions);
      let exitCode = Number(process2.exitCode ?? 0);
      if (exitCode === 0 && contextOptions && typeof contextOptions !== "function" && contextOptions.error) {
        exitCode = 1;
      }
      this._exit(exitCode, "commander.help", "(outputHelp)");
    }
    /**
     * // Do a little typing to coordinate emit and listener for the help text events.
     * @typedef HelpTextEventContext
     * @type {object}
     * @property {boolean} error
     * @property {Command} command
     * @property {function} write
     */
    /**
     * Add additional text to be displayed with the built-in help.
     *
     * Position is 'before' or 'after' to affect just this command,
     * and 'beforeAll' or 'afterAll' to affect this command and all its subcommands.
     *
     * @param {string} position - before or after built-in help
     * @param {(string | Function)} text - string to add, or a function returning a string
     * @return {Command} `this` command for chaining
     */
    addHelpText(position, text) {
      const allowedValues = ["beforeAll", "before", "after", "afterAll"];
      if (!allowedValues.includes(position)) {
        throw new Error(`Unexpected value for position to addHelpText.
Expecting one of '${allowedValues.join("', '")}'`);
      }
      const helpEvent = `${position}Help`;
      this.on(helpEvent, (context) => {
        let helpStr;
        if (typeof text === "function") {
          helpStr = text({ error: context.error, command: context.command });
        } else {
          helpStr = text;
        }
        if (helpStr) {
          context.write(`${helpStr}
`);
        }
      });
      return this;
    }
    /**
     * Output help information if help flags specified
     *
     * @param {Array} args - array of options to search for help flags
     * @private
     */
    _outputHelpIfRequested(args2) {
      const helpOption = this._getHelpOption();
      const helpRequested = helpOption && args2.find((arg) => helpOption.is(arg));
      if (helpRequested) {
        this.outputHelp();
        this._exit(0, "commander.helpDisplayed", "(outputHelp)");
      }
    }
  }
  function incrementNodeInspectorPort(args2) {
    return args2.map((arg) => {
      if (!arg.startsWith("--inspect")) {
        return arg;
      }
      let debugOption;
      let debugHost = "127.0.0.1";
      let debugPort = "9229";
      let match2;
      if ((match2 = arg.match(/^(--inspect(-brk)?)$/)) !== null) {
        debugOption = match2[1];
      } else if ((match2 = arg.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null) {
        debugOption = match2[1];
        if (/^\d+$/.test(match2[3])) {
          debugPort = match2[3];
        } else {
          debugHost = match2[3];
        }
      } else if ((match2 = arg.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !== null) {
        debugOption = match2[1];
        debugHost = match2[3];
        debugPort = match2[4];
      }
      if (debugOption && debugPort !== "0") {
        return `${debugOption}=${debugHost}:${parseInt(debugPort) + 1}`;
      }
      return arg;
    });
  }
  function useColor() {
    if (process2.env.NO_COLOR || process2.env.FORCE_COLOR === "0" || process2.env.FORCE_COLOR === "false")
      return false;
    if (process2.env.FORCE_COLOR || process2.env.CLICOLOR_FORCE !== void 0)
      return true;
    return void 0;
  }
  command.Command = Command2;
  command.useColor = useColor;
  return command;
}
var hasRequiredCommander;
function requireCommander() {
  if (hasRequiredCommander) return commander$1;
  hasRequiredCommander = 1;
  const { Argument: Argument2 } = requireArgument();
  const { Command: Command2 } = requireCommand();
  const { CommanderError: CommanderError2, InvalidArgumentError: InvalidArgumentError2 } = requireError();
  const { Help: Help2 } = requireHelp();
  const { Option: Option2 } = requireOption();
  commander$1.program = new Command2();
  commander$1.createCommand = (name) => new Command2(name);
  commander$1.createOption = (flags, description) => new Option2(flags, description);
  commander$1.createArgument = (name, description) => new Argument2(name, description);
  commander$1.Command = Command2;
  commander$1.Option = Option2;
  commander$1.Argument = Argument2;
  commander$1.Help = Help2;
  commander$1.CommanderError = CommanderError2;
  commander$1.InvalidArgumentError = InvalidArgumentError2;
  commander$1.InvalidOptionArgumentError = InvalidArgumentError2;
  return commander$1;
}
var commanderExports = requireCommander();
const commander = /* @__PURE__ */ getDefaultExportFromCjs(commanderExports);
const {
  program,
  createCommand,
  createArgument,
  createOption,
  CommanderError,
  InvalidArgumentError,
  InvalidOptionArgumentError,
  // deprecated old name
  Command,
  Argument,
  Option,
  Help
} = commander;
const isUpKey = (key) => (
  // The up key
  key.name === "up" || // Vim keybinding
  key.name === "k" || // Emacs keybinding
  key.ctrl && key.name === "p"
);
const isDownKey = (key) => (
  // The down key
  key.name === "down" || // Vim keybinding
  key.name === "j" || // Emacs keybinding
  key.ctrl && key.name === "n"
);
const isSpaceKey = (key) => key.name === "space";
const isBackspaceKey = (key) => key.name === "backspace";
const isNumberKey = (key) => "123456789".includes(key.name);
const isEnterKey = (key) => key.name === "enter" || key.name === "return";
class AbortPromptError extends Error {
  constructor(options) {
    super();
    __publicField(this, "name", "AbortPromptError");
    __publicField(this, "message", "Prompt was aborted");
    this.cause = options?.cause;
  }
}
class CancelPromptError extends Error {
  constructor() {
    super(...arguments);
    __publicField(this, "name", "CancelPromptError");
    __publicField(this, "message", "Prompt was canceled");
  }
}
class ExitPromptError extends Error {
  constructor() {
    super(...arguments);
    __publicField(this, "name", "ExitPromptError");
  }
}
class HookError extends Error {
  constructor() {
    super(...arguments);
    __publicField(this, "name", "HookError");
  }
}
class ValidationError extends Error {
  constructor() {
    super(...arguments);
    __publicField(this, "name", "ValidationError");
  }
}
const hookStorage = new node_async_hooks.AsyncLocalStorage();
function createStore(rl) {
  const store = {
    rl,
    hooks: [],
    hooksCleanup: [],
    hooksEffect: [],
    index: 0,
    handleChange() {
    }
  };
  return store;
}
function withHooks(rl, cb) {
  const store = createStore(rl);
  return hookStorage.run(store, () => {
    function cycle(render) {
      store.handleChange = () => {
        store.index = 0;
        render();
      };
      store.handleChange();
    }
    return cb(cycle);
  });
}
function getStore() {
  const store = hookStorage.getStore();
  if (!store) {
    throw new HookError("[Inquirer] Hook functions can only be called from within a prompt");
  }
  return store;
}
function readline() {
  return getStore().rl;
}
function withUpdates(fn) {
  const wrapped = (...args2) => {
    const store = getStore();
    let shouldUpdate = false;
    const oldHandleChange = store.handleChange;
    store.handleChange = () => {
      shouldUpdate = true;
    };
    const returnValue = fn(...args2);
    if (shouldUpdate) {
      oldHandleChange();
    }
    store.handleChange = oldHandleChange;
    return returnValue;
  };
  return node_async_hooks.AsyncResource.bind(wrapped);
}
function withPointer(cb) {
  const store = getStore();
  const { index } = store;
  const pointer = {
    get() {
      return store.hooks[index];
    },
    set(value) {
      store.hooks[index] = value;
    },
    initialized: index in store.hooks
  };
  const returnValue = cb(pointer);
  store.index++;
  return returnValue;
}
function handleChange() {
  getStore().handleChange();
}
const effectScheduler = {
  queue(cb) {
    const store = getStore();
    const { index } = store;
    store.hooksEffect.push(() => {
      store.hooksCleanup[index]?.();
      const cleanFn = cb(readline());
      if (cleanFn != null && typeof cleanFn !== "function") {
        throw new ValidationError("useEffect return value must be a cleanup function or nothing.");
      }
      store.hooksCleanup[index] = cleanFn;
    });
  },
  run() {
    const store = getStore();
    withUpdates(() => {
      store.hooksEffect.forEach((effect) => {
        effect();
      });
      store.hooksEffect.length = 0;
    })();
  },
  clearAll() {
    const store = getStore();
    store.hooksCleanup.forEach((cleanFn) => {
      cleanFn?.();
    });
    store.hooksEffect.length = 0;
    store.hooksCleanup.length = 0;
  }
};
function useState(defaultValue) {
  return withPointer((pointer) => {
    const setFn = (newValue) => {
      if (pointer.get() !== newValue) {
        pointer.set(newValue);
        handleChange();
      }
    };
    if (pointer.initialized) {
      return [pointer.get(), setFn];
    }
    const value = typeof defaultValue === "function" ? defaultValue() : defaultValue;
    pointer.set(value);
    return [value, setFn];
  });
}
function useEffect(cb, depArray) {
  withPointer((pointer) => {
    const oldDeps = pointer.get();
    const hasChanged = !Array.isArray(oldDeps) || depArray.some((dep, i) => !Object.is(dep, oldDeps[i]));
    if (hasChanged) {
      effectScheduler.queue(cb);
    }
    pointer.set(depArray);
  });
}
var yoctocolorsCjs;
var hasRequiredYoctocolorsCjs;
function requireYoctocolorsCjs() {
  if (hasRequiredYoctocolorsCjs) return yoctocolorsCjs;
  hasRequiredYoctocolorsCjs = 1;
  const tty = require$$0$2;
  const hasColors = tty?.WriteStream?.prototype?.hasColors?.() ?? false;
  const format = (open, close) => {
    if (!hasColors) {
      return (input2) => input2;
    }
    const openCode = `\x1B[${open}m`;
    const closeCode = `\x1B[${close}m`;
    return (input2) => {
      const string = input2 + "";
      let index = string.indexOf(closeCode);
      if (index === -1) {
        return openCode + string + closeCode;
      }
      let result = openCode;
      let lastIndex = 0;
      while (index !== -1) {
        result += string.slice(lastIndex, index) + openCode;
        lastIndex = index + closeCode.length;
        index = string.indexOf(closeCode, lastIndex);
      }
      result += string.slice(lastIndex) + closeCode;
      return result;
    };
  };
  const colors2 = {};
  colors2.reset = format(0, 0);
  colors2.bold = format(1, 22);
  colors2.dim = format(2, 22);
  colors2.italic = format(3, 23);
  colors2.underline = format(4, 24);
  colors2.overline = format(53, 55);
  colors2.inverse = format(7, 27);
  colors2.hidden = format(8, 28);
  colors2.strikethrough = format(9, 29);
  colors2.black = format(30, 39);
  colors2.red = format(31, 39);
  colors2.green = format(32, 39);
  colors2.yellow = format(33, 39);
  colors2.blue = format(34, 39);
  colors2.magenta = format(35, 39);
  colors2.cyan = format(36, 39);
  colors2.white = format(37, 39);
  colors2.gray = format(90, 39);
  colors2.bgBlack = format(40, 49);
  colors2.bgRed = format(41, 49);
  colors2.bgGreen = format(42, 49);
  colors2.bgYellow = format(43, 49);
  colors2.bgBlue = format(44, 49);
  colors2.bgMagenta = format(45, 49);
  colors2.bgCyan = format(46, 49);
  colors2.bgWhite = format(47, 49);
  colors2.bgGray = format(100, 49);
  colors2.redBright = format(91, 39);
  colors2.greenBright = format(92, 39);
  colors2.yellowBright = format(93, 39);
  colors2.blueBright = format(94, 39);
  colors2.magentaBright = format(95, 39);
  colors2.cyanBright = format(96, 39);
  colors2.whiteBright = format(97, 39);
  colors2.bgRedBright = format(101, 49);
  colors2.bgGreenBright = format(102, 49);
  colors2.bgYellowBright = format(103, 49);
  colors2.bgBlueBright = format(104, 49);
  colors2.bgMagentaBright = format(105, 49);
  colors2.bgCyanBright = format(106, 49);
  colors2.bgWhiteBright = format(107, 49);
  yoctocolorsCjs = colors2;
  return yoctocolorsCjs;
}
var yoctocolorsCjsExports = /* @__PURE__ */ requireYoctocolorsCjs();
const colors = /* @__PURE__ */ getDefaultExportFromCjs(yoctocolorsCjsExports);
function isUnicodeSupported() {
  if (process$2.platform !== "win32") {
    return process$2.env["TERM"] !== "linux";
  }
  return Boolean(process$2.env["WT_SESSION"]) || // Windows Terminal
  Boolean(process$2.env["TERMINUS_SUBLIME"]) || // Terminus (<0.2.27)
  process$2.env["ConEmuTask"] === "{cmd::Cmder}" || // ConEmu and cmder
  process$2.env["TERM_PROGRAM"] === "Terminus-Sublime" || process$2.env["TERM_PROGRAM"] === "vscode" || process$2.env["TERM"] === "xterm-256color" || process$2.env["TERM"] === "alacritty" || process$2.env["TERMINAL_EMULATOR"] === "JetBrains-JediTerm";
}
const common = {
  circleQuestionMark: "(?)",
  questionMarkPrefix: "(?)",
  square: "█",
  squareDarkShade: "▓",
  squareMediumShade: "▒",
  squareLightShade: "░",
  squareTop: "▀",
  squareBottom: "▄",
  squareLeft: "▌",
  squareRight: "▐",
  squareCenter: "■",
  bullet: "●",
  dot: "․",
  ellipsis: "…",
  pointerSmall: "›",
  triangleUp: "▲",
  triangleUpSmall: "▴",
  triangleDown: "▼",
  triangleDownSmall: "▾",
  triangleLeftSmall: "◂",
  triangleRightSmall: "▸",
  home: "⌂",
  heart: "♥",
  musicNote: "♪",
  musicNoteBeamed: "♫",
  arrowUp: "↑",
  arrowDown: "↓",
  arrowLeft: "←",
  arrowRight: "→",
  arrowLeftRight: "↔",
  arrowUpDown: "↕",
  almostEqual: "≈",
  notEqual: "≠",
  lessOrEqual: "≤",
  greaterOrEqual: "≥",
  identical: "≡",
  infinity: "∞",
  subscriptZero: "₀",
  subscriptOne: "₁",
  subscriptTwo: "₂",
  subscriptThree: "₃",
  subscriptFour: "₄",
  subscriptFive: "₅",
  subscriptSix: "₆",
  subscriptSeven: "₇",
  subscriptEight: "₈",
  subscriptNine: "₉",
  oneHalf: "½",
  oneThird: "⅓",
  oneQuarter: "¼",
  oneFifth: "⅕",
  oneSixth: "⅙",
  oneEighth: "⅛",
  twoThirds: "⅔",
  twoFifths: "⅖",
  threeQuarters: "¾",
  threeFifths: "⅗",
  threeEighths: "⅜",
  fourFifths: "⅘",
  fiveSixths: "⅚",
  fiveEighths: "⅝",
  sevenEighths: "⅞",
  line: "─",
  lineBold: "━",
  lineDouble: "═",
  lineDashed0: "┄",
  lineDashed1: "┅",
  lineDashed2: "┈",
  lineDashed3: "┉",
  lineDashed4: "╌",
  lineDashed5: "╍",
  lineDashed6: "╴",
  lineDashed7: "╶",
  lineDashed8: "╸",
  lineDashed9: "╺",
  lineDashed10: "╼",
  lineDashed11: "╾",
  lineDashed12: "−",
  lineDashed13: "–",
  lineDashed14: "‐",
  lineDashed15: "⁃",
  lineVertical: "│",
  lineVerticalBold: "┃",
  lineVerticalDouble: "║",
  lineVerticalDashed0: "┆",
  lineVerticalDashed1: "┇",
  lineVerticalDashed2: "┊",
  lineVerticalDashed3: "┋",
  lineVerticalDashed4: "╎",
  lineVerticalDashed5: "╏",
  lineVerticalDashed6: "╵",
  lineVerticalDashed7: "╷",
  lineVerticalDashed8: "╹",
  lineVerticalDashed9: "╻",
  lineVerticalDashed10: "╽",
  lineVerticalDashed11: "╿",
  lineDownLeft: "┐",
  lineDownLeftArc: "╮",
  lineDownBoldLeftBold: "┓",
  lineDownBoldLeft: "┒",
  lineDownLeftBold: "┑",
  lineDownDoubleLeftDouble: "╗",
  lineDownDoubleLeft: "╖",
  lineDownLeftDouble: "╕",
  lineDownRight: "┌",
  lineDownRightArc: "╭",
  lineDownBoldRightBold: "┏",
  lineDownBoldRight: "┎",
  lineDownRightBold: "┍",
  lineDownDoubleRightDouble: "╔",
  lineDownDoubleRight: "╓",
  lineDownRightDouble: "╒",
  lineUpLeft: "┘",
  lineUpLeftArc: "╯",
  lineUpBoldLeftBold: "┛",
  lineUpBoldLeft: "┚",
  lineUpLeftBold: "┙",
  lineUpDoubleLeftDouble: "╝",
  lineUpDoubleLeft: "╜",
  lineUpLeftDouble: "╛",
  lineUpRight: "└",
  lineUpRightArc: "╰",
  lineUpBoldRightBold: "┗",
  lineUpBoldRight: "┖",
  lineUpRightBold: "┕",
  lineUpDoubleRightDouble: "╚",
  lineUpDoubleRight: "╙",
  lineUpRightDouble: "╘",
  lineUpDownLeft: "┤",
  lineUpBoldDownBoldLeftBold: "┫",
  lineUpBoldDownBoldLeft: "┨",
  lineUpDownLeftBold: "┥",
  lineUpBoldDownLeftBold: "┩",
  lineUpDownBoldLeftBold: "┪",
  lineUpDownBoldLeft: "┧",
  lineUpBoldDownLeft: "┦",
  lineUpDoubleDownDoubleLeftDouble: "╣",
  lineUpDoubleDownDoubleLeft: "╢",
  lineUpDownLeftDouble: "╡",
  lineUpDownRight: "├",
  lineUpBoldDownBoldRightBold: "┣",
  lineUpBoldDownBoldRight: "┠",
  lineUpDownRightBold: "┝",
  lineUpBoldDownRightBold: "┡",
  lineUpDownBoldRightBold: "┢",
  lineUpDownBoldRight: "┟",
  lineUpBoldDownRight: "┞",
  lineUpDoubleDownDoubleRightDouble: "╠",
  lineUpDoubleDownDoubleRight: "╟",
  lineUpDownRightDouble: "╞",
  lineDownLeftRight: "┬",
  lineDownBoldLeftBoldRightBold: "┳",
  lineDownLeftBoldRightBold: "┯",
  lineDownBoldLeftRight: "┰",
  lineDownBoldLeftBoldRight: "┱",
  lineDownBoldLeftRightBold: "┲",
  lineDownLeftRightBold: "┮",
  lineDownLeftBoldRight: "┭",
  lineDownDoubleLeftDoubleRightDouble: "╦",
  lineDownDoubleLeftRight: "╥",
  lineDownLeftDoubleRightDouble: "╤",
  lineUpLeftRight: "┴",
  lineUpBoldLeftBoldRightBold: "┻",
  lineUpLeftBoldRightBold: "┷",
  lineUpBoldLeftRight: "┸",
  lineUpBoldLeftBoldRight: "┹",
  lineUpBoldLeftRightBold: "┺",
  lineUpLeftRightBold: "┶",
  lineUpLeftBoldRight: "┵",
  lineUpDoubleLeftDoubleRightDouble: "╩",
  lineUpDoubleLeftRight: "╨",
  lineUpLeftDoubleRightDouble: "╧",
  lineUpDownLeftRight: "┼",
  lineUpBoldDownBoldLeftBoldRightBold: "╋",
  lineUpDownBoldLeftBoldRightBold: "╈",
  lineUpBoldDownLeftBoldRightBold: "╇",
  lineUpBoldDownBoldLeftRightBold: "╊",
  lineUpBoldDownBoldLeftBoldRight: "╉",
  lineUpBoldDownLeftRight: "╀",
  lineUpDownBoldLeftRight: "╁",
  lineUpDownLeftBoldRight: "┽",
  lineUpDownLeftRightBold: "┾",
  lineUpBoldDownBoldLeftRight: "╂",
  lineUpDownLeftBoldRightBold: "┿",
  lineUpBoldDownLeftBoldRight: "╃",
  lineUpBoldDownLeftRightBold: "╄",
  lineUpDownBoldLeftBoldRight: "╅",
  lineUpDownBoldLeftRightBold: "╆",
  lineUpDoubleDownDoubleLeftDoubleRightDouble: "╬",
  lineUpDoubleDownDoubleLeftRight: "╫",
  lineUpDownLeftDoubleRightDouble: "╪",
  lineCross: "╳",
  lineBackslash: "╲",
  lineSlash: "╱"
};
const specialMainSymbols = {
  tick: "✔",
  info: "ℹ",
  warning: "⚠",
  cross: "✘",
  squareSmall: "◻",
  squareSmallFilled: "◼",
  circle: "◯",
  circleFilled: "◉",
  circleDotted: "◌",
  circleDouble: "◎",
  circleCircle: "ⓞ",
  circleCross: "ⓧ",
  circlePipe: "Ⓘ",
  radioOn: "◉",
  radioOff: "◯",
  checkboxOn: "☒",
  checkboxOff: "☐",
  checkboxCircleOn: "ⓧ",
  checkboxCircleOff: "Ⓘ",
  pointer: "❯",
  triangleUpOutline: "△",
  triangleLeft: "◀",
  triangleRight: "▶",
  lozenge: "◆",
  lozengeOutline: "◇",
  hamburger: "☰",
  smiley: "㋡",
  mustache: "෴",
  star: "★",
  play: "▶",
  nodejs: "⬢",
  oneSeventh: "⅐",
  oneNinth: "⅑",
  oneTenth: "⅒"
};
const specialFallbackSymbols = {
  tick: "√",
  info: "i",
  warning: "‼",
  cross: "×",
  squareSmall: "□",
  squareSmallFilled: "■",
  circle: "( )",
  circleFilled: "(*)",
  circleDotted: "( )",
  circleDouble: "( )",
  circleCircle: "(○)",
  circleCross: "(×)",
  circlePipe: "(│)",
  radioOn: "(*)",
  radioOff: "( )",
  checkboxOn: "[×]",
  checkboxOff: "[ ]",
  checkboxCircleOn: "(×)",
  checkboxCircleOff: "( )",
  pointer: ">",
  triangleUpOutline: "∆",
  triangleLeft: "◄",
  triangleRight: "►",
  lozenge: "♦",
  lozengeOutline: "◊",
  hamburger: "≡",
  smiley: "☺",
  mustache: "┌─┐",
  star: "✶",
  play: "►",
  nodejs: "♦",
  oneSeventh: "1/7",
  oneNinth: "1/9",
  oneTenth: "1/10"
};
const mainSymbols = { ...common, ...specialMainSymbols };
const fallbackSymbols = {
  ...common,
  ...specialFallbackSymbols
};
const shouldUseMain = isUnicodeSupported();
const figures = shouldUseMain ? mainSymbols : fallbackSymbols;
const defaultTheme = {
  prefix: {
    idle: colors.blue("?"),
    // TODO: use figure
    done: colors.green(figures.tick)
  },
  spinner: {
    interval: 80,
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"].map((frame) => colors.yellow(frame))
  },
  style: {
    answer: colors.cyan,
    message: colors.bold,
    error: (text) => colors.red(`> ${text}`),
    defaultAnswer: (text) => colors.dim(`(${text})`),
    help: colors.dim,
    highlight: colors.cyan,
    key: (text) => colors.cyan(colors.bold(`<${text}>`))
  }
};
function isPlainObject(value) {
  if (typeof value !== "object" || value === null)
    return false;
  let proto = value;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(value) === proto;
}
function deepMerge(...objects) {
  const output = {};
  for (const obj of objects) {
    for (const [key, value] of Object.entries(obj)) {
      const prevValue = output[key];
      output[key] = isPlainObject(prevValue) && isPlainObject(value) ? deepMerge(prevValue, value) : value;
    }
  }
  return output;
}
function makeTheme(...themes) {
  const themesToMerge = [
    defaultTheme,
    ...themes.filter((theme) => theme != null)
  ];
  return deepMerge(...themesToMerge);
}
function usePrefix({ status = "idle", theme }) {
  const [showLoader, setShowLoader] = useState(false);
  const [tick, setTick] = useState(0);
  const { prefix, spinner } = makeTheme(theme);
  useEffect(() => {
    if (status === "loading") {
      let tickInterval;
      let inc = -1;
      const delayTimeout = setTimeout(node_async_hooks.AsyncResource.bind(() => {
        setShowLoader(true);
        tickInterval = setInterval(node_async_hooks.AsyncResource.bind(() => {
          inc = inc + 1;
          setTick(inc % spinner.frames.length);
        }), spinner.interval);
      }), 300);
      return () => {
        clearTimeout(delayTimeout);
        clearInterval(tickInterval);
      };
    } else {
      setShowLoader(false);
    }
  }, [status]);
  if (showLoader) {
    return spinner.frames[tick];
  }
  const iconName = status === "loading" ? "idle" : status;
  return typeof prefix === "string" ? prefix : prefix[iconName] ?? prefix["idle"];
}
function useMemo(fn, dependencies) {
  return withPointer((pointer) => {
    const prev = pointer.get();
    if (!prev || prev.dependencies.length !== dependencies.length || prev.dependencies.some((dep, i) => dep !== dependencies[i])) {
      const value = fn();
      pointer.set({ value, dependencies });
      return value;
    }
    return prev.value;
  });
}
function useRef(val) {
  return useState({ current: val })[0];
}
function useKeypress(userHandler) {
  const signal = useRef(userHandler);
  signal.current = userHandler;
  useEffect((rl) => {
    let ignore = false;
    const handler = withUpdates((_input, event) => {
      if (ignore)
        return;
      void signal.current(event, rl);
    });
    rl.input.on("keypress", handler);
    return () => {
      ignore = true;
      rl.input.removeListener("keypress", handler);
    };
  }, []);
}
var cliWidth_1;
var hasRequiredCliWidth;
function requireCliWidth() {
  if (hasRequiredCliWidth) return cliWidth_1;
  hasRequiredCliWidth = 1;
  cliWidth_1 = cliWidth2;
  function normalizeOpts(options) {
    const defaultOpts = {
      defaultWidth: 0,
      output: process.stdout,
      tty: require$$0$3
    };
    if (!options) {
      return defaultOpts;
    }
    Object.keys(defaultOpts).forEach(function(key) {
      if (!options[key]) {
        options[key] = defaultOpts[key];
      }
    });
    return options;
  }
  function cliWidth2(options) {
    const opts = normalizeOpts(options);
    if (opts.output.getWindowSize) {
      return opts.output.getWindowSize()[0] || opts.defaultWidth;
    }
    if (opts.tty.getWindowSize) {
      return opts.tty.getWindowSize()[1] || opts.defaultWidth;
    }
    if (opts.output.columns) {
      return opts.output.columns;
    }
    if (process.env.CLI_WIDTH) {
      const width = parseInt(process.env.CLI_WIDTH, 10);
      if (!isNaN(width) && width !== 0) {
        return width;
      }
    }
    return opts.defaultWidth;
  }
  return cliWidth_1;
}
var cliWidthExports = requireCliWidth();
const cliWidth = /* @__PURE__ */ getDefaultExportFromCjs(cliWidthExports);
var stringWidth = { exports: {} };
var ansiRegex;
var hasRequiredAnsiRegex;
function requireAnsiRegex() {
  if (hasRequiredAnsiRegex) return ansiRegex;
  hasRequiredAnsiRegex = 1;
  ansiRegex = ({ onlyFirst = false } = {}) => {
    const pattern = [
      "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
      "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"
    ].join("|");
    return new RegExp(pattern, onlyFirst ? void 0 : "g");
  };
  return ansiRegex;
}
var stripAnsi;
var hasRequiredStripAnsi;
function requireStripAnsi() {
  if (hasRequiredStripAnsi) return stripAnsi;
  hasRequiredStripAnsi = 1;
  const ansiRegex2 = requireAnsiRegex();
  stripAnsi = (string) => typeof string === "string" ? string.replace(ansiRegex2(), "") : string;
  return stripAnsi;
}
var isFullwidthCodePoint = { exports: {} };
var hasRequiredIsFullwidthCodePoint;
function requireIsFullwidthCodePoint() {
  if (hasRequiredIsFullwidthCodePoint) return isFullwidthCodePoint.exports;
  hasRequiredIsFullwidthCodePoint = 1;
  const isFullwidthCodePoint$1 = (codePoint) => {
    if (Number.isNaN(codePoint)) {
      return false;
    }
    if (codePoint >= 4352 && (codePoint <= 4447 || // Hangul Jamo
    codePoint === 9001 || // LEFT-POINTING ANGLE BRACKET
    codePoint === 9002 || // RIGHT-POINTING ANGLE BRACKET
    // CJK Radicals Supplement .. Enclosed CJK Letters and Months
    11904 <= codePoint && codePoint <= 12871 && codePoint !== 12351 || // Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
    12880 <= codePoint && codePoint <= 19903 || // CJK Unified Ideographs .. Yi Radicals
    19968 <= codePoint && codePoint <= 42182 || // Hangul Jamo Extended-A
    43360 <= codePoint && codePoint <= 43388 || // Hangul Syllables
    44032 <= codePoint && codePoint <= 55203 || // CJK Compatibility Ideographs
    63744 <= codePoint && codePoint <= 64255 || // Vertical Forms
    65040 <= codePoint && codePoint <= 65049 || // CJK Compatibility Forms .. Small Form Variants
    65072 <= codePoint && codePoint <= 65131 || // Halfwidth and Fullwidth Forms
    65281 <= codePoint && codePoint <= 65376 || 65504 <= codePoint && codePoint <= 65510 || // Kana Supplement
    110592 <= codePoint && codePoint <= 110593 || // Enclosed Ideographic Supplement
    127488 <= codePoint && codePoint <= 127569 || // CJK Unified Ideographs Extension B .. Tertiary Ideographic Plane
    131072 <= codePoint && codePoint <= 262141)) {
      return true;
    }
    return false;
  };
  isFullwidthCodePoint.exports = isFullwidthCodePoint$1;
  isFullwidthCodePoint.exports.default = isFullwidthCodePoint$1;
  return isFullwidthCodePoint.exports;
}
var emojiRegex;
var hasRequiredEmojiRegex;
function requireEmojiRegex() {
  if (hasRequiredEmojiRegex) return emojiRegex;
  hasRequiredEmojiRegex = 1;
  emojiRegex = function() {
    return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F|\uD83D\uDC68(?:\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68\uD83C\uDFFB|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C[\uDFFB-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)\uD83C\uDFFB|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB\uDFFC])|\uD83D\uDC69(?:\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB-\uDFFD])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620)\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDF6\uD83C\uDDE6|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5\uDEEB\uDEEC\uDEF4-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
  };
  return emojiRegex;
}
var hasRequiredStringWidth;
function requireStringWidth() {
  if (hasRequiredStringWidth) return stringWidth.exports;
  hasRequiredStringWidth = 1;
  const stripAnsi2 = requireStripAnsi();
  const isFullwidthCodePoint2 = requireIsFullwidthCodePoint();
  const emojiRegex2 = requireEmojiRegex();
  const stringWidth$1 = (string) => {
    if (typeof string !== "string" || string.length === 0) {
      return 0;
    }
    string = stripAnsi2(string);
    if (string.length === 0) {
      return 0;
    }
    string = string.replace(emojiRegex2(), "  ");
    let width = 0;
    for (let i = 0; i < string.length; i++) {
      const code = string.codePointAt(i);
      if (code <= 31 || code >= 127 && code <= 159) {
        continue;
      }
      if (code >= 768 && code <= 879) {
        continue;
      }
      if (code > 65535) {
        i++;
      }
      width += isFullwidthCodePoint2(code) ? 2 : 1;
    }
    return width;
  };
  stringWidth.exports = stringWidth$1;
  stringWidth.exports.default = stringWidth$1;
  return stringWidth.exports;
}
var ansiStyles = { exports: {} };
var colorName;
var hasRequiredColorName;
function requireColorName() {
  if (hasRequiredColorName) return colorName;
  hasRequiredColorName = 1;
  colorName = {
    "aliceblue": [240, 248, 255],
    "antiquewhite": [250, 235, 215],
    "aqua": [0, 255, 255],
    "aquamarine": [127, 255, 212],
    "azure": [240, 255, 255],
    "beige": [245, 245, 220],
    "bisque": [255, 228, 196],
    "black": [0, 0, 0],
    "blanchedalmond": [255, 235, 205],
    "blue": [0, 0, 255],
    "blueviolet": [138, 43, 226],
    "brown": [165, 42, 42],
    "burlywood": [222, 184, 135],
    "cadetblue": [95, 158, 160],
    "chartreuse": [127, 255, 0],
    "chocolate": [210, 105, 30],
    "coral": [255, 127, 80],
    "cornflowerblue": [100, 149, 237],
    "cornsilk": [255, 248, 220],
    "crimson": [220, 20, 60],
    "cyan": [0, 255, 255],
    "darkblue": [0, 0, 139],
    "darkcyan": [0, 139, 139],
    "darkgoldenrod": [184, 134, 11],
    "darkgray": [169, 169, 169],
    "darkgreen": [0, 100, 0],
    "darkgrey": [169, 169, 169],
    "darkkhaki": [189, 183, 107],
    "darkmagenta": [139, 0, 139],
    "darkolivegreen": [85, 107, 47],
    "darkorange": [255, 140, 0],
    "darkorchid": [153, 50, 204],
    "darkred": [139, 0, 0],
    "darksalmon": [233, 150, 122],
    "darkseagreen": [143, 188, 143],
    "darkslateblue": [72, 61, 139],
    "darkslategray": [47, 79, 79],
    "darkslategrey": [47, 79, 79],
    "darkturquoise": [0, 206, 209],
    "darkviolet": [148, 0, 211],
    "deeppink": [255, 20, 147],
    "deepskyblue": [0, 191, 255],
    "dimgray": [105, 105, 105],
    "dimgrey": [105, 105, 105],
    "dodgerblue": [30, 144, 255],
    "firebrick": [178, 34, 34],
    "floralwhite": [255, 250, 240],
    "forestgreen": [34, 139, 34],
    "fuchsia": [255, 0, 255],
    "gainsboro": [220, 220, 220],
    "ghostwhite": [248, 248, 255],
    "gold": [255, 215, 0],
    "goldenrod": [218, 165, 32],
    "gray": [128, 128, 128],
    "green": [0, 128, 0],
    "greenyellow": [173, 255, 47],
    "grey": [128, 128, 128],
    "honeydew": [240, 255, 240],
    "hotpink": [255, 105, 180],
    "indianred": [205, 92, 92],
    "indigo": [75, 0, 130],
    "ivory": [255, 255, 240],
    "khaki": [240, 230, 140],
    "lavender": [230, 230, 250],
    "lavenderblush": [255, 240, 245],
    "lawngreen": [124, 252, 0],
    "lemonchiffon": [255, 250, 205],
    "lightblue": [173, 216, 230],
    "lightcoral": [240, 128, 128],
    "lightcyan": [224, 255, 255],
    "lightgoldenrodyellow": [250, 250, 210],
    "lightgray": [211, 211, 211],
    "lightgreen": [144, 238, 144],
    "lightgrey": [211, 211, 211],
    "lightpink": [255, 182, 193],
    "lightsalmon": [255, 160, 122],
    "lightseagreen": [32, 178, 170],
    "lightskyblue": [135, 206, 250],
    "lightslategray": [119, 136, 153],
    "lightslategrey": [119, 136, 153],
    "lightsteelblue": [176, 196, 222],
    "lightyellow": [255, 255, 224],
    "lime": [0, 255, 0],
    "limegreen": [50, 205, 50],
    "linen": [250, 240, 230],
    "magenta": [255, 0, 255],
    "maroon": [128, 0, 0],
    "mediumaquamarine": [102, 205, 170],
    "mediumblue": [0, 0, 205],
    "mediumorchid": [186, 85, 211],
    "mediumpurple": [147, 112, 219],
    "mediumseagreen": [60, 179, 113],
    "mediumslateblue": [123, 104, 238],
    "mediumspringgreen": [0, 250, 154],
    "mediumturquoise": [72, 209, 204],
    "mediumvioletred": [199, 21, 133],
    "midnightblue": [25, 25, 112],
    "mintcream": [245, 255, 250],
    "mistyrose": [255, 228, 225],
    "moccasin": [255, 228, 181],
    "navajowhite": [255, 222, 173],
    "navy": [0, 0, 128],
    "oldlace": [253, 245, 230],
    "olive": [128, 128, 0],
    "olivedrab": [107, 142, 35],
    "orange": [255, 165, 0],
    "orangered": [255, 69, 0],
    "orchid": [218, 112, 214],
    "palegoldenrod": [238, 232, 170],
    "palegreen": [152, 251, 152],
    "paleturquoise": [175, 238, 238],
    "palevioletred": [219, 112, 147],
    "papayawhip": [255, 239, 213],
    "peachpuff": [255, 218, 185],
    "peru": [205, 133, 63],
    "pink": [255, 192, 203],
    "plum": [221, 160, 221],
    "powderblue": [176, 224, 230],
    "purple": [128, 0, 128],
    "rebeccapurple": [102, 51, 153],
    "red": [255, 0, 0],
    "rosybrown": [188, 143, 143],
    "royalblue": [65, 105, 225],
    "saddlebrown": [139, 69, 19],
    "salmon": [250, 128, 114],
    "sandybrown": [244, 164, 96],
    "seagreen": [46, 139, 87],
    "seashell": [255, 245, 238],
    "sienna": [160, 82, 45],
    "silver": [192, 192, 192],
    "skyblue": [135, 206, 235],
    "slateblue": [106, 90, 205],
    "slategray": [112, 128, 144],
    "slategrey": [112, 128, 144],
    "snow": [255, 250, 250],
    "springgreen": [0, 255, 127],
    "steelblue": [70, 130, 180],
    "tan": [210, 180, 140],
    "teal": [0, 128, 128],
    "thistle": [216, 191, 216],
    "tomato": [255, 99, 71],
    "turquoise": [64, 224, 208],
    "violet": [238, 130, 238],
    "wheat": [245, 222, 179],
    "white": [255, 255, 255],
    "whitesmoke": [245, 245, 245],
    "yellow": [255, 255, 0],
    "yellowgreen": [154, 205, 50]
  };
  return colorName;
}
var conversions;
var hasRequiredConversions;
function requireConversions() {
  if (hasRequiredConversions) return conversions;
  hasRequiredConversions = 1;
  const cssKeywords = requireColorName();
  const reverseKeywords = {};
  for (const key of Object.keys(cssKeywords)) {
    reverseKeywords[cssKeywords[key]] = key;
  }
  const convert = {
    rgb: { channels: 3, labels: "rgb" },
    hsl: { channels: 3, labels: "hsl" },
    hsv: { channels: 3, labels: "hsv" },
    hwb: { channels: 3, labels: "hwb" },
    cmyk: { channels: 4, labels: "cmyk" },
    xyz: { channels: 3, labels: "xyz" },
    lab: { channels: 3, labels: "lab" },
    lch: { channels: 3, labels: "lch" },
    hex: { channels: 1, labels: ["hex"] },
    keyword: { channels: 1, labels: ["keyword"] },
    ansi16: { channels: 1, labels: ["ansi16"] },
    ansi256: { channels: 1, labels: ["ansi256"] },
    hcg: { channels: 3, labels: ["h", "c", "g"] },
    apple: { channels: 3, labels: ["r16", "g16", "b16"] },
    gray: { channels: 1, labels: ["gray"] }
  };
  conversions = convert;
  for (const model of Object.keys(convert)) {
    if (!("channels" in convert[model])) {
      throw new Error("missing channels property: " + model);
    }
    if (!("labels" in convert[model])) {
      throw new Error("missing channel labels property: " + model);
    }
    if (convert[model].labels.length !== convert[model].channels) {
      throw new Error("channel and label counts mismatch: " + model);
    }
    const { channels, labels } = convert[model];
    delete convert[model].channels;
    delete convert[model].labels;
    Object.defineProperty(convert[model], "channels", { value: channels });
    Object.defineProperty(convert[model], "labels", { value: labels });
  }
  convert.rgb.hsl = function(rgb) {
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;
    const min2 = Math.min(r, g, b);
    const max2 = Math.max(r, g, b);
    const delta = max2 - min2;
    let h;
    let s;
    if (max2 === min2) {
      h = 0;
    } else if (r === max2) {
      h = (g - b) / delta;
    } else if (g === max2) {
      h = 2 + (b - r) / delta;
    } else if (b === max2) {
      h = 4 + (r - g) / delta;
    }
    h = Math.min(h * 60, 360);
    if (h < 0) {
      h += 360;
    }
    const l = (min2 + max2) / 2;
    if (max2 === min2) {
      s = 0;
    } else if (l <= 0.5) {
      s = delta / (max2 + min2);
    } else {
      s = delta / (2 - max2 - min2);
    }
    return [h, s * 100, l * 100];
  };
  convert.rgb.hsv = function(rgb) {
    let rdif;
    let gdif;
    let bdif;
    let h;
    let s;
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;
    const v = Math.max(r, g, b);
    const diff = v - Math.min(r, g, b);
    const diffc = function(c) {
      return (v - c) / 6 / diff + 1 / 2;
    };
    if (diff === 0) {
      h = 0;
      s = 0;
    } else {
      s = diff / v;
      rdif = diffc(r);
      gdif = diffc(g);
      bdif = diffc(b);
      if (r === v) {
        h = bdif - gdif;
      } else if (g === v) {
        h = 1 / 3 + rdif - bdif;
      } else if (b === v) {
        h = 2 / 3 + gdif - rdif;
      }
      if (h < 0) {
        h += 1;
      } else if (h > 1) {
        h -= 1;
      }
    }
    return [
      h * 360,
      s * 100,
      v * 100
    ];
  };
  convert.rgb.hwb = function(rgb) {
    const r = rgb[0];
    const g = rgb[1];
    let b = rgb[2];
    const h = convert.rgb.hsl(rgb)[0];
    const w = 1 / 255 * Math.min(r, Math.min(g, b));
    b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));
    return [h, w * 100, b * 100];
  };
  convert.rgb.cmyk = function(rgb) {
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;
    const k = Math.min(1 - r, 1 - g, 1 - b);
    const c = (1 - r - k) / (1 - k) || 0;
    const m = (1 - g - k) / (1 - k) || 0;
    const y = (1 - b - k) / (1 - k) || 0;
    return [c * 100, m * 100, y * 100, k * 100];
  };
  function comparativeDistance(x, y) {
    return (x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2 + (x[2] - y[2]) ** 2;
  }
  convert.rgb.keyword = function(rgb) {
    const reversed = reverseKeywords[rgb];
    if (reversed) {
      return reversed;
    }
    let currentClosestDistance = Infinity;
    let currentClosestKeyword;
    for (const keyword of Object.keys(cssKeywords)) {
      const value = cssKeywords[keyword];
      const distance = comparativeDistance(rgb, value);
      if (distance < currentClosestDistance) {
        currentClosestDistance = distance;
        currentClosestKeyword = keyword;
      }
    }
    return currentClosestKeyword;
  };
  convert.keyword.rgb = function(keyword) {
    return cssKeywords[keyword];
  };
  convert.rgb.xyz = function(rgb) {
    let r = rgb[0] / 255;
    let g = rgb[1] / 255;
    let b = rgb[2] / 255;
    r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92;
    g = g > 0.04045 ? ((g + 0.055) / 1.055) ** 2.4 : g / 12.92;
    b = b > 0.04045 ? ((b + 0.055) / 1.055) ** 2.4 : b / 12.92;
    const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
    const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
    const z = r * 0.0193 + g * 0.1192 + b * 0.9505;
    return [x * 100, y * 100, z * 100];
  };
  convert.rgb.lab = function(rgb) {
    const xyz = convert.rgb.xyz(rgb);
    let x = xyz[0];
    let y = xyz[1];
    let z = xyz[2];
    x /= 95.047;
    y /= 100;
    z /= 108.883;
    x = x > 8856e-6 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
    y = y > 8856e-6 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
    z = z > 8856e-6 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
    const l = 116 * y - 16;
    const a = 500 * (x - y);
    const b = 200 * (y - z);
    return [l, a, b];
  };
  convert.hsl.rgb = function(hsl) {
    const h = hsl[0] / 360;
    const s = hsl[1] / 100;
    const l = hsl[2] / 100;
    let t2;
    let t3;
    let val;
    if (s === 0) {
      val = l * 255;
      return [val, val, val];
    }
    if (l < 0.5) {
      t2 = l * (1 + s);
    } else {
      t2 = l + s - l * s;
    }
    const t1 = 2 * l - t2;
    const rgb = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
      t3 = h + 1 / 3 * -(i - 1);
      if (t3 < 0) {
        t3++;
      }
      if (t3 > 1) {
        t3--;
      }
      if (6 * t3 < 1) {
        val = t1 + (t2 - t1) * 6 * t3;
      } else if (2 * t3 < 1) {
        val = t2;
      } else if (3 * t3 < 2) {
        val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
      } else {
        val = t1;
      }
      rgb[i] = val * 255;
    }
    return rgb;
  };
  convert.hsl.hsv = function(hsl) {
    const h = hsl[0];
    let s = hsl[1] / 100;
    let l = hsl[2] / 100;
    let smin = s;
    const lmin = Math.max(l, 0.01);
    l *= 2;
    s *= l <= 1 ? l : 2 - l;
    smin *= lmin <= 1 ? lmin : 2 - lmin;
    const v = (l + s) / 2;
    const sv = l === 0 ? 2 * smin / (lmin + smin) : 2 * s / (l + s);
    return [h, sv * 100, v * 100];
  };
  convert.hsv.rgb = function(hsv) {
    const h = hsv[0] / 60;
    const s = hsv[1] / 100;
    let v = hsv[2] / 100;
    const hi = Math.floor(h) % 6;
    const f = h - Math.floor(h);
    const p = 255 * v * (1 - s);
    const q = 255 * v * (1 - s * f);
    const t = 255 * v * (1 - s * (1 - f));
    v *= 255;
    switch (hi) {
      case 0:
        return [v, t, p];
      case 1:
        return [q, v, p];
      case 2:
        return [p, v, t];
      case 3:
        return [p, q, v];
      case 4:
        return [t, p, v];
      case 5:
        return [v, p, q];
    }
  };
  convert.hsv.hsl = function(hsv) {
    const h = hsv[0];
    const s = hsv[1] / 100;
    const v = hsv[2] / 100;
    const vmin = Math.max(v, 0.01);
    let sl;
    let l;
    l = (2 - s) * v;
    const lmin = (2 - s) * vmin;
    sl = s * vmin;
    sl /= lmin <= 1 ? lmin : 2 - lmin;
    sl = sl || 0;
    l /= 2;
    return [h, sl * 100, l * 100];
  };
  convert.hwb.rgb = function(hwb) {
    const h = hwb[0] / 360;
    let wh = hwb[1] / 100;
    let bl = hwb[2] / 100;
    const ratio = wh + bl;
    let f;
    if (ratio > 1) {
      wh /= ratio;
      bl /= ratio;
    }
    const i = Math.floor(6 * h);
    const v = 1 - bl;
    f = 6 * h - i;
    if ((i & 1) !== 0) {
      f = 1 - f;
    }
    const n = wh + f * (v - wh);
    let r;
    let g;
    let b;
    switch (i) {
      default:
      case 6:
      case 0:
        r = v;
        g = n;
        b = wh;
        break;
      case 1:
        r = n;
        g = v;
        b = wh;
        break;
      case 2:
        r = wh;
        g = v;
        b = n;
        break;
      case 3:
        r = wh;
        g = n;
        b = v;
        break;
      case 4:
        r = n;
        g = wh;
        b = v;
        break;
      case 5:
        r = v;
        g = wh;
        b = n;
        break;
    }
    return [r * 255, g * 255, b * 255];
  };
  convert.cmyk.rgb = function(cmyk) {
    const c = cmyk[0] / 100;
    const m = cmyk[1] / 100;
    const y = cmyk[2] / 100;
    const k = cmyk[3] / 100;
    const r = 1 - Math.min(1, c * (1 - k) + k);
    const g = 1 - Math.min(1, m * (1 - k) + k);
    const b = 1 - Math.min(1, y * (1 - k) + k);
    return [r * 255, g * 255, b * 255];
  };
  convert.xyz.rgb = function(xyz) {
    const x = xyz[0] / 100;
    const y = xyz[1] / 100;
    const z = xyz[2] / 100;
    let r;
    let g;
    let b;
    r = x * 3.2406 + y * -1.5372 + z * -0.4986;
    g = x * -0.9689 + y * 1.8758 + z * 0.0415;
    b = x * 0.0557 + y * -0.204 + z * 1.057;
    r = r > 31308e-7 ? 1.055 * r ** (1 / 2.4) - 0.055 : r * 12.92;
    g = g > 31308e-7 ? 1.055 * g ** (1 / 2.4) - 0.055 : g * 12.92;
    b = b > 31308e-7 ? 1.055 * b ** (1 / 2.4) - 0.055 : b * 12.92;
    r = Math.min(Math.max(0, r), 1);
    g = Math.min(Math.max(0, g), 1);
    b = Math.min(Math.max(0, b), 1);
    return [r * 255, g * 255, b * 255];
  };
  convert.xyz.lab = function(xyz) {
    let x = xyz[0];
    let y = xyz[1];
    let z = xyz[2];
    x /= 95.047;
    y /= 100;
    z /= 108.883;
    x = x > 8856e-6 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
    y = y > 8856e-6 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
    z = z > 8856e-6 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
    const l = 116 * y - 16;
    const a = 500 * (x - y);
    const b = 200 * (y - z);
    return [l, a, b];
  };
  convert.lab.xyz = function(lab) {
    const l = lab[0];
    const a = lab[1];
    const b = lab[2];
    let x;
    let y;
    let z;
    y = (l + 16) / 116;
    x = a / 500 + y;
    z = y - b / 200;
    const y2 = y ** 3;
    const x2 = x ** 3;
    const z2 = z ** 3;
    y = y2 > 8856e-6 ? y2 : (y - 16 / 116) / 7.787;
    x = x2 > 8856e-6 ? x2 : (x - 16 / 116) / 7.787;
    z = z2 > 8856e-6 ? z2 : (z - 16 / 116) / 7.787;
    x *= 95.047;
    y *= 100;
    z *= 108.883;
    return [x, y, z];
  };
  convert.lab.lch = function(lab) {
    const l = lab[0];
    const a = lab[1];
    const b = lab[2];
    let h;
    const hr = Math.atan2(b, a);
    h = hr * 360 / 2 / Math.PI;
    if (h < 0) {
      h += 360;
    }
    const c = Math.sqrt(a * a + b * b);
    return [l, c, h];
  };
  convert.lch.lab = function(lch) {
    const l = lch[0];
    const c = lch[1];
    const h = lch[2];
    const hr = h / 360 * 2 * Math.PI;
    const a = c * Math.cos(hr);
    const b = c * Math.sin(hr);
    return [l, a, b];
  };
  convert.rgb.ansi16 = function(args2, saturation = null) {
    const [r, g, b] = args2;
    let value = saturation === null ? convert.rgb.hsv(args2)[2] : saturation;
    value = Math.round(value / 50);
    if (value === 0) {
      return 30;
    }
    let ansi = 30 + (Math.round(b / 255) << 2 | Math.round(g / 255) << 1 | Math.round(r / 255));
    if (value === 2) {
      ansi += 60;
    }
    return ansi;
  };
  convert.hsv.ansi16 = function(args2) {
    return convert.rgb.ansi16(convert.hsv.rgb(args2), args2[2]);
  };
  convert.rgb.ansi256 = function(args2) {
    const r = args2[0];
    const g = args2[1];
    const b = args2[2];
    if (r === g && g === b) {
      if (r < 8) {
        return 16;
      }
      if (r > 248) {
        return 231;
      }
      return Math.round((r - 8) / 247 * 24) + 232;
    }
    const ansi = 16 + 36 * Math.round(r / 255 * 5) + 6 * Math.round(g / 255 * 5) + Math.round(b / 255 * 5);
    return ansi;
  };
  convert.ansi16.rgb = function(args2) {
    let color = args2 % 10;
    if (color === 0 || color === 7) {
      if (args2 > 50) {
        color += 3.5;
      }
      color = color / 10.5 * 255;
      return [color, color, color];
    }
    const mult = (~~(args2 > 50) + 1) * 0.5;
    const r = (color & 1) * mult * 255;
    const g = (color >> 1 & 1) * mult * 255;
    const b = (color >> 2 & 1) * mult * 255;
    return [r, g, b];
  };
  convert.ansi256.rgb = function(args2) {
    if (args2 >= 232) {
      const c = (args2 - 232) * 10 + 8;
      return [c, c, c];
    }
    args2 -= 16;
    let rem;
    const r = Math.floor(args2 / 36) / 5 * 255;
    const g = Math.floor((rem = args2 % 36) / 6) / 5 * 255;
    const b = rem % 6 / 5 * 255;
    return [r, g, b];
  };
  convert.rgb.hex = function(args2) {
    const integer = ((Math.round(args2[0]) & 255) << 16) + ((Math.round(args2[1]) & 255) << 8) + (Math.round(args2[2]) & 255);
    const string = integer.toString(16).toUpperCase();
    return "000000".substring(string.length) + string;
  };
  convert.hex.rgb = function(args2) {
    const match2 = args2.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
    if (!match2) {
      return [0, 0, 0];
    }
    let colorString = match2[0];
    if (match2[0].length === 3) {
      colorString = colorString.split("").map((char) => {
        return char + char;
      }).join("");
    }
    const integer = parseInt(colorString, 16);
    const r = integer >> 16 & 255;
    const g = integer >> 8 & 255;
    const b = integer & 255;
    return [r, g, b];
  };
  convert.rgb.hcg = function(rgb) {
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;
    const max2 = Math.max(Math.max(r, g), b);
    const min2 = Math.min(Math.min(r, g), b);
    const chroma = max2 - min2;
    let grayscale;
    let hue;
    if (chroma < 1) {
      grayscale = min2 / (1 - chroma);
    } else {
      grayscale = 0;
    }
    if (chroma <= 0) {
      hue = 0;
    } else if (max2 === r) {
      hue = (g - b) / chroma % 6;
    } else if (max2 === g) {
      hue = 2 + (b - r) / chroma;
    } else {
      hue = 4 + (r - g) / chroma;
    }
    hue /= 6;
    hue %= 1;
    return [hue * 360, chroma * 100, grayscale * 100];
  };
  convert.hsl.hcg = function(hsl) {
    const s = hsl[1] / 100;
    const l = hsl[2] / 100;
    const c = l < 0.5 ? 2 * s * l : 2 * s * (1 - l);
    let f = 0;
    if (c < 1) {
      f = (l - 0.5 * c) / (1 - c);
    }
    return [hsl[0], c * 100, f * 100];
  };
  convert.hsv.hcg = function(hsv) {
    const s = hsv[1] / 100;
    const v = hsv[2] / 100;
    const c = s * v;
    let f = 0;
    if (c < 1) {
      f = (v - c) / (1 - c);
    }
    return [hsv[0], c * 100, f * 100];
  };
  convert.hcg.rgb = function(hcg) {
    const h = hcg[0] / 360;
    const c = hcg[1] / 100;
    const g = hcg[2] / 100;
    if (c === 0) {
      return [g * 255, g * 255, g * 255];
    }
    const pure = [0, 0, 0];
    const hi = h % 1 * 6;
    const v = hi % 1;
    const w = 1 - v;
    let mg = 0;
    switch (Math.floor(hi)) {
      case 0:
        pure[0] = 1;
        pure[1] = v;
        pure[2] = 0;
        break;
      case 1:
        pure[0] = w;
        pure[1] = 1;
        pure[2] = 0;
        break;
      case 2:
        pure[0] = 0;
        pure[1] = 1;
        pure[2] = v;
        break;
      case 3:
        pure[0] = 0;
        pure[1] = w;
        pure[2] = 1;
        break;
      case 4:
        pure[0] = v;
        pure[1] = 0;
        pure[2] = 1;
        break;
      default:
        pure[0] = 1;
        pure[1] = 0;
        pure[2] = w;
    }
    mg = (1 - c) * g;
    return [
      (c * pure[0] + mg) * 255,
      (c * pure[1] + mg) * 255,
      (c * pure[2] + mg) * 255
    ];
  };
  convert.hcg.hsv = function(hcg) {
    const c = hcg[1] / 100;
    const g = hcg[2] / 100;
    const v = c + g * (1 - c);
    let f = 0;
    if (v > 0) {
      f = c / v;
    }
    return [hcg[0], f * 100, v * 100];
  };
  convert.hcg.hsl = function(hcg) {
    const c = hcg[1] / 100;
    const g = hcg[2] / 100;
    const l = g * (1 - c) + 0.5 * c;
    let s = 0;
    if (l > 0 && l < 0.5) {
      s = c / (2 * l);
    } else if (l >= 0.5 && l < 1) {
      s = c / (2 * (1 - l));
    }
    return [hcg[0], s * 100, l * 100];
  };
  convert.hcg.hwb = function(hcg) {
    const c = hcg[1] / 100;
    const g = hcg[2] / 100;
    const v = c + g * (1 - c);
    return [hcg[0], (v - c) * 100, (1 - v) * 100];
  };
  convert.hwb.hcg = function(hwb) {
    const w = hwb[1] / 100;
    const b = hwb[2] / 100;
    const v = 1 - b;
    const c = v - w;
    let g = 0;
    if (c < 1) {
      g = (v - c) / (1 - c);
    }
    return [hwb[0], c * 100, g * 100];
  };
  convert.apple.rgb = function(apple) {
    return [apple[0] / 65535 * 255, apple[1] / 65535 * 255, apple[2] / 65535 * 255];
  };
  convert.rgb.apple = function(rgb) {
    return [rgb[0] / 255 * 65535, rgb[1] / 255 * 65535, rgb[2] / 255 * 65535];
  };
  convert.gray.rgb = function(args2) {
    return [args2[0] / 100 * 255, args2[0] / 100 * 255, args2[0] / 100 * 255];
  };
  convert.gray.hsl = function(args2) {
    return [0, 0, args2[0]];
  };
  convert.gray.hsv = convert.gray.hsl;
  convert.gray.hwb = function(gray) {
    return [0, 100, gray[0]];
  };
  convert.gray.cmyk = function(gray) {
    return [0, 0, 0, gray[0]];
  };
  convert.gray.lab = function(gray) {
    return [gray[0], 0, 0];
  };
  convert.gray.hex = function(gray) {
    const val = Math.round(gray[0] / 100 * 255) & 255;
    const integer = (val << 16) + (val << 8) + val;
    const string = integer.toString(16).toUpperCase();
    return "000000".substring(string.length) + string;
  };
  convert.rgb.gray = function(rgb) {
    const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
    return [val / 255 * 100];
  };
  return conversions;
}
var route;
var hasRequiredRoute;
function requireRoute() {
  if (hasRequiredRoute) return route;
  hasRequiredRoute = 1;
  const conversions2 = requireConversions();
  function buildGraph() {
    const graph = {};
    const models = Object.keys(conversions2);
    for (let len = models.length, i = 0; i < len; i++) {
      graph[models[i]] = {
        // http://jsperf.com/1-vs-infinity
        // micro-opt, but this is simple.
        distance: -1,
        parent: null
      };
    }
    return graph;
  }
  function deriveBFS(fromModel) {
    const graph = buildGraph();
    const queue2 = [fromModel];
    graph[fromModel].distance = 0;
    while (queue2.length) {
      const current = queue2.pop();
      const adjacents = Object.keys(conversions2[current]);
      for (let len = adjacents.length, i = 0; i < len; i++) {
        const adjacent = adjacents[i];
        const node = graph[adjacent];
        if (node.distance === -1) {
          node.distance = graph[current].distance + 1;
          node.parent = current;
          queue2.unshift(adjacent);
        }
      }
    }
    return graph;
  }
  function link(from2, to) {
    return function(args2) {
      return to(from2(args2));
    };
  }
  function wrapConversion(toModel, graph) {
    const path2 = [graph[toModel].parent, toModel];
    let fn = conversions2[graph[toModel].parent][toModel];
    let cur = graph[toModel].parent;
    while (graph[cur].parent) {
      path2.unshift(graph[cur].parent);
      fn = link(conversions2[graph[cur].parent][cur], fn);
      cur = graph[cur].parent;
    }
    fn.conversion = path2;
    return fn;
  }
  route = function(fromModel) {
    const graph = deriveBFS(fromModel);
    const conversion = {};
    const models = Object.keys(graph);
    for (let len = models.length, i = 0; i < len; i++) {
      const toModel = models[i];
      const node = graph[toModel];
      if (node.parent === null) {
        continue;
      }
      conversion[toModel] = wrapConversion(toModel, graph);
    }
    return conversion;
  };
  return route;
}
var colorConvert;
var hasRequiredColorConvert;
function requireColorConvert() {
  if (hasRequiredColorConvert) return colorConvert;
  hasRequiredColorConvert = 1;
  const conversions2 = requireConversions();
  const route2 = requireRoute();
  const convert = {};
  const models = Object.keys(conversions2);
  function wrapRaw(fn) {
    const wrappedFn = function(...args2) {
      const arg0 = args2[0];
      if (arg0 === void 0 || arg0 === null) {
        return arg0;
      }
      if (arg0.length > 1) {
        args2 = arg0;
      }
      return fn(args2);
    };
    if ("conversion" in fn) {
      wrappedFn.conversion = fn.conversion;
    }
    return wrappedFn;
  }
  function wrapRounded(fn) {
    const wrappedFn = function(...args2) {
      const arg0 = args2[0];
      if (arg0 === void 0 || arg0 === null) {
        return arg0;
      }
      if (arg0.length > 1) {
        args2 = arg0;
      }
      const result = fn(args2);
      if (typeof result === "object") {
        for (let len = result.length, i = 0; i < len; i++) {
          result[i] = Math.round(result[i]);
        }
      }
      return result;
    };
    if ("conversion" in fn) {
      wrappedFn.conversion = fn.conversion;
    }
    return wrappedFn;
  }
  models.forEach((fromModel) => {
    convert[fromModel] = {};
    Object.defineProperty(convert[fromModel], "channels", { value: conversions2[fromModel].channels });
    Object.defineProperty(convert[fromModel], "labels", { value: conversions2[fromModel].labels });
    const routes = route2(fromModel);
    const routeModels = Object.keys(routes);
    routeModels.forEach((toModel) => {
      const fn = routes[toModel];
      convert[fromModel][toModel] = wrapRounded(fn);
      convert[fromModel][toModel].raw = wrapRaw(fn);
    });
  });
  colorConvert = convert;
  return colorConvert;
}
ansiStyles.exports;
var hasRequiredAnsiStyles;
function requireAnsiStyles() {
  if (hasRequiredAnsiStyles) return ansiStyles.exports;
  hasRequiredAnsiStyles = 1;
  (function(module2) {
    const wrapAnsi16 = (fn, offset) => (...args2) => {
      const code = fn(...args2);
      return `\x1B[${code + offset}m`;
    };
    const wrapAnsi256 = (fn, offset) => (...args2) => {
      const code = fn(...args2);
      return `\x1B[${38 + offset};5;${code}m`;
    };
    const wrapAnsi16m = (fn, offset) => (...args2) => {
      const rgb = fn(...args2);
      return `\x1B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
    };
    const ansi2ansi = (n) => n;
    const rgb2rgb = (r, g, b) => [r, g, b];
    const setLazyProperty = (object, property, get) => {
      Object.defineProperty(object, property, {
        get: () => {
          const value = get();
          Object.defineProperty(object, property, {
            value,
            enumerable: true,
            configurable: true
          });
          return value;
        },
        enumerable: true,
        configurable: true
      });
    };
    let colorConvert2;
    const makeDynamicStyles = (wrap, targetSpace, identity2, isBackground) => {
      if (colorConvert2 === void 0) {
        colorConvert2 = requireColorConvert();
      }
      const offset = isBackground ? 10 : 0;
      const styles = {};
      for (const [sourceSpace, suite] of Object.entries(colorConvert2)) {
        const name = sourceSpace === "ansi16" ? "ansi" : sourceSpace;
        if (sourceSpace === targetSpace) {
          styles[name] = wrap(identity2, offset);
        } else if (typeof suite === "object") {
          styles[name] = wrap(suite[targetSpace], offset);
        }
      }
      return styles;
    };
    function assembleStyles() {
      const codes = /* @__PURE__ */ new Map();
      const styles = {
        modifier: {
          reset: [0, 0],
          // 21 isn't widely supported and 22 does the same thing
          bold: [1, 22],
          dim: [2, 22],
          italic: [3, 23],
          underline: [4, 24],
          inverse: [7, 27],
          hidden: [8, 28],
          strikethrough: [9, 29]
        },
        color: {
          black: [30, 39],
          red: [31, 39],
          green: [32, 39],
          yellow: [33, 39],
          blue: [34, 39],
          magenta: [35, 39],
          cyan: [36, 39],
          white: [37, 39],
          // Bright color
          blackBright: [90, 39],
          redBright: [91, 39],
          greenBright: [92, 39],
          yellowBright: [93, 39],
          blueBright: [94, 39],
          magentaBright: [95, 39],
          cyanBright: [96, 39],
          whiteBright: [97, 39]
        },
        bgColor: {
          bgBlack: [40, 49],
          bgRed: [41, 49],
          bgGreen: [42, 49],
          bgYellow: [43, 49],
          bgBlue: [44, 49],
          bgMagenta: [45, 49],
          bgCyan: [46, 49],
          bgWhite: [47, 49],
          // Bright color
          bgBlackBright: [100, 49],
          bgRedBright: [101, 49],
          bgGreenBright: [102, 49],
          bgYellowBright: [103, 49],
          bgBlueBright: [104, 49],
          bgMagentaBright: [105, 49],
          bgCyanBright: [106, 49],
          bgWhiteBright: [107, 49]
        }
      };
      styles.color.gray = styles.color.blackBright;
      styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
      styles.color.grey = styles.color.blackBright;
      styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;
      for (const [groupName, group] of Object.entries(styles)) {
        for (const [styleName, style] of Object.entries(group)) {
          styles[styleName] = {
            open: `\x1B[${style[0]}m`,
            close: `\x1B[${style[1]}m`
          };
          group[styleName] = styles[styleName];
          codes.set(style[0], style[1]);
        }
        Object.defineProperty(styles, groupName, {
          value: group,
          enumerable: false
        });
      }
      Object.defineProperty(styles, "codes", {
        value: codes,
        enumerable: false
      });
      styles.color.close = "\x1B[39m";
      styles.bgColor.close = "\x1B[49m";
      setLazyProperty(styles.color, "ansi", () => makeDynamicStyles(wrapAnsi16, "ansi16", ansi2ansi, false));
      setLazyProperty(styles.color, "ansi256", () => makeDynamicStyles(wrapAnsi256, "ansi256", ansi2ansi, false));
      setLazyProperty(styles.color, "ansi16m", () => makeDynamicStyles(wrapAnsi16m, "rgb", rgb2rgb, false));
      setLazyProperty(styles.bgColor, "ansi", () => makeDynamicStyles(wrapAnsi16, "ansi16", ansi2ansi, true));
      setLazyProperty(styles.bgColor, "ansi256", () => makeDynamicStyles(wrapAnsi256, "ansi256", ansi2ansi, true));
      setLazyProperty(styles.bgColor, "ansi16m", () => makeDynamicStyles(wrapAnsi16m, "rgb", rgb2rgb, true));
      return styles;
    }
    Object.defineProperty(module2, "exports", {
      enumerable: true,
      get: assembleStyles
    });
  })(ansiStyles);
  return ansiStyles.exports;
}
var wrapAnsi_1;
var hasRequiredWrapAnsi;
function requireWrapAnsi() {
  if (hasRequiredWrapAnsi) return wrapAnsi_1;
  hasRequiredWrapAnsi = 1;
  const stringWidth2 = requireStringWidth();
  const stripAnsi2 = requireStripAnsi();
  const ansiStyles2 = requireAnsiStyles();
  const ESCAPES = /* @__PURE__ */ new Set([
    "\x1B",
    ""
  ]);
  const END_CODE = 39;
  const wrapAnsi2 = (code) => `${ESCAPES.values().next().value}[${code}m`;
  const wordLengths = (string) => string.split(" ").map((character) => stringWidth2(character));
  const wrapWord = (rows, word, columns) => {
    const characters = [...word];
    let isInsideEscape = false;
    let visible = stringWidth2(stripAnsi2(rows[rows.length - 1]));
    for (const [index, character] of characters.entries()) {
      const characterLength = stringWidth2(character);
      if (visible + characterLength <= columns) {
        rows[rows.length - 1] += character;
      } else {
        rows.push(character);
        visible = 0;
      }
      if (ESCAPES.has(character)) {
        isInsideEscape = true;
      } else if (isInsideEscape && character === "m") {
        isInsideEscape = false;
        continue;
      }
      if (isInsideEscape) {
        continue;
      }
      visible += characterLength;
      if (visible === columns && index < characters.length - 1) {
        rows.push("");
        visible = 0;
      }
    }
    if (!visible && rows[rows.length - 1].length > 0 && rows.length > 1) {
      rows[rows.length - 2] += rows.pop();
    }
  };
  const stringVisibleTrimSpacesRight = (str) => {
    const words = str.split(" ");
    let last2 = words.length;
    while (last2 > 0) {
      if (stringWidth2(words[last2 - 1]) > 0) {
        break;
      }
      last2--;
    }
    if (last2 === words.length) {
      return str;
    }
    return words.slice(0, last2).join(" ") + words.slice(last2).join("");
  };
  const exec = (string, columns, options = {}) => {
    if (options.trim !== false && string.trim() === "") {
      return "";
    }
    let pre = "";
    let ret = "";
    let escapeCode;
    const lengths = wordLengths(string);
    let rows = [""];
    for (const [index, word] of string.split(" ").entries()) {
      if (options.trim !== false) {
        rows[rows.length - 1] = rows[rows.length - 1].trimLeft();
      }
      let rowLength = stringWidth2(rows[rows.length - 1]);
      if (index !== 0) {
        if (rowLength >= columns && (options.wordWrap === false || options.trim === false)) {
          rows.push("");
          rowLength = 0;
        }
        if (rowLength > 0 || options.trim === false) {
          rows[rows.length - 1] += " ";
          rowLength++;
        }
      }
      if (options.hard && lengths[index] > columns) {
        const remainingColumns = columns - rowLength;
        const breaksStartingThisLine = 1 + Math.floor((lengths[index] - remainingColumns - 1) / columns);
        const breaksStartingNextLine = Math.floor((lengths[index] - 1) / columns);
        if (breaksStartingNextLine < breaksStartingThisLine) {
          rows.push("");
        }
        wrapWord(rows, word, columns);
        continue;
      }
      if (rowLength + lengths[index] > columns && rowLength > 0 && lengths[index] > 0) {
        if (options.wordWrap === false && rowLength < columns) {
          wrapWord(rows, word, columns);
          continue;
        }
        rows.push("");
      }
      if (rowLength + lengths[index] > columns && options.wordWrap === false) {
        wrapWord(rows, word, columns);
        continue;
      }
      rows[rows.length - 1] += word;
    }
    if (options.trim !== false) {
      rows = rows.map(stringVisibleTrimSpacesRight);
    }
    pre = rows.join("\n");
    for (const [index, character] of [...pre].entries()) {
      ret += character;
      if (ESCAPES.has(character)) {
        const code2 = parseFloat(/\d[^m]*/.exec(pre.slice(index, index + 4)));
        escapeCode = code2 === END_CODE ? null : code2;
      }
      const code = ansiStyles2.codes.get(Number(escapeCode));
      if (escapeCode && code) {
        if (pre[index + 1] === "\n") {
          ret += wrapAnsi2(code);
        } else if (character === "\n") {
          ret += wrapAnsi2(escapeCode);
        }
      }
    }
    return ret;
  };
  wrapAnsi_1 = (string, columns, options) => {
    return String(string).normalize().replace(/\r\n/g, "\n").split("\n").map((line) => exec(line, columns, options)).join("\n");
  };
  return wrapAnsi_1;
}
var wrapAnsiExports = requireWrapAnsi();
const wrapAnsi = /* @__PURE__ */ getDefaultExportFromCjs(wrapAnsiExports);
function breakLines(content, width) {
  return content.split("\n").flatMap((line) => wrapAnsi(line, width, { trim: false, hard: true }).split("\n").map((str) => str.trimEnd())).join("\n");
}
function readlineWidth() {
  return cliWidth({ defaultWidth: 80, output: readline().output });
}
function split(content, width) {
  return breakLines(content, width).split("\n");
}
function rotate(count2, items) {
  const max2 = items.length;
  const offset = (count2 % max2 + max2) % max2;
  return [...items.slice(offset), ...items.slice(0, offset)];
}
function lines({ items, width, renderItem, active, position: requested, pageSize }) {
  const layouts = items.map((item, index) => ({
    item,
    index,
    isActive: index === active
  }));
  const layoutsInPage = rotate(active - requested, layouts).slice(0, pageSize);
  const renderItemAt = (index) => layoutsInPage[index] == null ? [] : split(renderItem(layoutsInPage[index]), width);
  const pageBuffer = Array.from({ length: pageSize });
  const activeItem = renderItemAt(requested).slice(0, pageSize);
  const position = requested + activeItem.length <= pageSize ? requested : pageSize - activeItem.length;
  pageBuffer.splice(position, activeItem.length, ...activeItem);
  let bufferPointer = position + activeItem.length;
  let layoutPointer = requested + 1;
  while (bufferPointer < pageSize && layoutPointer < layoutsInPage.length) {
    for (const line of renderItemAt(layoutPointer)) {
      pageBuffer[bufferPointer++] = line;
      if (bufferPointer >= pageSize)
        break;
    }
    layoutPointer++;
  }
  bufferPointer = position - 1;
  layoutPointer = requested - 1;
  while (bufferPointer >= 0 && layoutPointer >= 0) {
    for (const line of renderItemAt(layoutPointer).reverse()) {
      pageBuffer[bufferPointer--] = line;
      if (bufferPointer < 0)
        break;
    }
    layoutPointer--;
  }
  return pageBuffer.filter((line) => typeof line === "string");
}
function finite({ active, pageSize, total }) {
  const middle = Math.floor(pageSize / 2);
  if (total <= pageSize || active < middle)
    return active;
  if (active >= total - middle)
    return active + pageSize - total;
  return middle;
}
function infinite({ active, lastActive, total, pageSize, pointer }) {
  if (total <= pageSize)
    return active;
  if (lastActive < active && active - lastActive < pageSize) {
    return Math.min(Math.floor(pageSize / 2), pointer + active - lastActive);
  }
  return pointer;
}
function usePagination({ items, active, renderItem, pageSize, loop = true }) {
  const state = useRef({ position: 0, lastActive: 0 });
  const position = loop ? infinite({
    active,
    lastActive: state.current.lastActive,
    total: items.length,
    pageSize,
    pointer: state.current.position
  }) : finite({
    active,
    total: items.length,
    pageSize
  });
  state.current.position = position;
  state.current.lastActive = active;
  return lines({
    items,
    width: readlineWidth(),
    renderItem,
    active,
    position,
    pageSize
  }).join("\n");
}
var lib$1;
var hasRequiredLib$1;
function requireLib$1() {
  var _isTTY, _MuteStream_instances, destSrc_fn, proxy_fn;
  if (hasRequiredLib$1) return lib$1;
  hasRequiredLib$1 = 1;
  const Stream = require$$1$2;
  class MuteStream2 extends Stream {
    constructor(opts = {}) {
      super(opts);
      __privateAdd(this, _MuteStream_instances);
      __privateAdd(this, _isTTY, null);
      this.writable = this.readable = true;
      this.muted = false;
      this.on("pipe", this._onpipe);
      this.replace = opts.replace;
      this._prompt = opts.prompt || null;
      this._hadControl = false;
    }
    get isTTY() {
      if (__privateGet(this, _isTTY) !== null) {
        return __privateGet(this, _isTTY);
      }
      return __privateMethod(this, _MuteStream_instances, destSrc_fn).call(this, "isTTY", false);
    }
    // basically just get replace the getter/setter with a regular value
    set isTTY(val) {
      __privateSet(this, _isTTY, val);
    }
    get rows() {
      return __privateMethod(this, _MuteStream_instances, destSrc_fn).call(this, "rows");
    }
    get columns() {
      return __privateMethod(this, _MuteStream_instances, destSrc_fn).call(this, "columns");
    }
    mute() {
      this.muted = true;
    }
    unmute() {
      this.muted = false;
    }
    _onpipe(src) {
      this._src = src;
    }
    pipe(dest, options) {
      this._dest = dest;
      return super.pipe(dest, options);
    }
    pause() {
      if (this._src) {
        return this._src.pause();
      }
    }
    resume() {
      if (this._src) {
        return this._src.resume();
      }
    }
    write(c) {
      if (this.muted) {
        if (!this.replace) {
          return true;
        }
        if (c.match(/^\u001b/)) {
          if (c.indexOf(this._prompt) === 0) {
            c = c.slice(this._prompt.length);
            c = c.replace(/./g, this.replace);
            c = this._prompt + c;
          }
          this._hadControl = true;
          return this.emit("data", c);
        } else {
          if (this._prompt && this._hadControl && c.indexOf(this._prompt) === 0) {
            this._hadControl = false;
            this.emit("data", this._prompt);
            c = c.slice(this._prompt.length);
          }
          c = c.toString().replace(/./g, this.replace);
        }
      }
      this.emit("data", c);
    }
    end(c) {
      if (this.muted) {
        if (c && this.replace) {
          c = c.toString().replace(/./g, this.replace);
        } else {
          c = null;
        }
      }
      if (c) {
        this.emit("data", c);
      }
      this.emit("end");
    }
    destroy(...args2) {
      return __privateMethod(this, _MuteStream_instances, proxy_fn).call(this, "destroy", ...args2);
    }
    destroySoon(...args2) {
      return __privateMethod(this, _MuteStream_instances, proxy_fn).call(this, "destroySoon", ...args2);
    }
    close(...args2) {
      return __privateMethod(this, _MuteStream_instances, proxy_fn).call(this, "close", ...args2);
    }
  }
  _isTTY = new WeakMap();
  _MuteStream_instances = new WeakSet();
  destSrc_fn = function(key, def) {
    if (this._dest) {
      return this._dest[key];
    }
    if (this._src) {
      return this._src[key];
    }
    return def;
  };
  proxy_fn = function(method, ...args2) {
    if (typeof this._dest?.[method] === "function") {
      this._dest[method](...args2);
    }
    if (typeof this._src?.[method] === "function") {
      this._src[method](...args2);
    }
  };
  lib$1 = MuteStream2;
  return lib$1;
}
var libExports = requireLib$1();
const MuteStream = /* @__PURE__ */ getDefaultExportFromCjs(libExports);
const signals = [];
signals.push("SIGHUP", "SIGINT", "SIGTERM");
if (process.platform !== "win32") {
  signals.push(
    "SIGALRM",
    "SIGABRT",
    "SIGVTALRM",
    "SIGXCPU",
    "SIGXFSZ",
    "SIGUSR2",
    "SIGTRAP",
    "SIGSYS",
    "SIGQUIT",
    "SIGIOT"
    // should detect profiler and enable/disable accordingly.
    // see #21
    // 'SIGPROF'
  );
}
if (process.platform === "linux") {
  signals.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
}
const processOk = (process2) => !!process2 && typeof process2 === "object" && typeof process2.removeListener === "function" && typeof process2.emit === "function" && typeof process2.reallyExit === "function" && typeof process2.listeners === "function" && typeof process2.kill === "function" && typeof process2.pid === "number" && typeof process2.on === "function";
const kExitEmitter = Symbol.for("signal-exit emitter");
const global = globalThis;
const ObjectDefineProperty = Object.defineProperty.bind(Object);
class Emitter {
  constructor() {
    __publicField(this, "emitted", {
      afterExit: false,
      exit: false
    });
    __publicField(this, "listeners", {
      afterExit: [],
      exit: []
    });
    __publicField(this, "count", 0);
    __publicField(this, "id", Math.random());
    if (global[kExitEmitter]) {
      return global[kExitEmitter];
    }
    ObjectDefineProperty(global, kExitEmitter, {
      value: this,
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
  on(ev, fn) {
    this.listeners[ev].push(fn);
  }
  removeListener(ev, fn) {
    const list = this.listeners[ev];
    const i = list.indexOf(fn);
    if (i === -1) {
      return;
    }
    if (i === 0 && list.length === 1) {
      list.length = 0;
    } else {
      list.splice(i, 1);
    }
  }
  emit(ev, code, signal) {
    if (this.emitted[ev]) {
      return false;
    }
    this.emitted[ev] = true;
    let ret = false;
    for (const fn of this.listeners[ev]) {
      ret = fn(code, signal) === true || ret;
    }
    if (ev === "exit") {
      ret = this.emit("afterExit", code, signal) || ret;
    }
    return ret;
  }
}
class SignalExitBase {
}
const signalExitWrap = (handler) => {
  return {
    onExit(cb, opts) {
      return handler.onExit(cb, opts);
    },
    load() {
      return handler.load();
    },
    unload() {
      return handler.unload();
    }
  };
};
class SignalExitFallback extends SignalExitBase {
  onExit() {
    return () => {
    };
  }
  load() {
  }
  unload() {
  }
}
class SignalExit extends SignalExitBase {
  constructor(process2) {
    super();
    __privateAdd(this, _SignalExit_instances);
    // "SIGHUP" throws an `ENOSYS` error on Windows,
    // so use a supported signal instead
    /* c8 ignore start */
    __privateAdd(this, _hupSig, process$1.platform === "win32" ? "SIGINT" : "SIGHUP");
    /* c8 ignore stop */
    __privateAdd(this, _emitter, new Emitter());
    __privateAdd(this, _process);
    __privateAdd(this, _originalProcessEmit);
    __privateAdd(this, _originalProcessReallyExit);
    __privateAdd(this, _sigListeners, {});
    __privateAdd(this, _loaded, false);
    __privateSet(this, _process, process2);
    __privateSet(this, _sigListeners, {});
    for (const sig of signals) {
      __privateGet(this, _sigListeners)[sig] = () => {
        const listeners = __privateGet(this, _process).listeners(sig);
        let { count: count2 } = __privateGet(this, _emitter);
        const p = process2;
        if (typeof p.__signal_exit_emitter__ === "object" && typeof p.__signal_exit_emitter__.count === "number") {
          count2 += p.__signal_exit_emitter__.count;
        }
        if (listeners.length === count2) {
          this.unload();
          const ret = __privateGet(this, _emitter).emit("exit", null, sig);
          const s = sig === "SIGHUP" ? __privateGet(this, _hupSig) : sig;
          if (!ret)
            process2.kill(process2.pid, s);
        }
      };
    }
    __privateSet(this, _originalProcessReallyExit, process2.reallyExit);
    __privateSet(this, _originalProcessEmit, process2.emit);
  }
  onExit(cb, opts) {
    if (!processOk(__privateGet(this, _process))) {
      return () => {
      };
    }
    if (__privateGet(this, _loaded) === false) {
      this.load();
    }
    const ev = opts?.alwaysLast ? "afterExit" : "exit";
    __privateGet(this, _emitter).on(ev, cb);
    return () => {
      __privateGet(this, _emitter).removeListener(ev, cb);
      if (__privateGet(this, _emitter).listeners["exit"].length === 0 && __privateGet(this, _emitter).listeners["afterExit"].length === 0) {
        this.unload();
      }
    };
  }
  load() {
    if (__privateGet(this, _loaded)) {
      return;
    }
    __privateSet(this, _loaded, true);
    __privateGet(this, _emitter).count += 1;
    for (const sig of signals) {
      try {
        const fn = __privateGet(this, _sigListeners)[sig];
        if (fn)
          __privateGet(this, _process).on(sig, fn);
      } catch (_2) {
      }
    }
    __privateGet(this, _process).emit = (ev, ...a) => {
      return __privateMethod(this, _SignalExit_instances, processEmit_fn).call(this, ev, ...a);
    };
    __privateGet(this, _process).reallyExit = (code) => {
      return __privateMethod(this, _SignalExit_instances, processReallyExit_fn).call(this, code);
    };
  }
  unload() {
    if (!__privateGet(this, _loaded)) {
      return;
    }
    __privateSet(this, _loaded, false);
    signals.forEach((sig) => {
      const listener = __privateGet(this, _sigListeners)[sig];
      if (!listener) {
        throw new Error("Listener not defined for signal: " + sig);
      }
      try {
        __privateGet(this, _process).removeListener(sig, listener);
      } catch (_2) {
      }
    });
    __privateGet(this, _process).emit = __privateGet(this, _originalProcessEmit);
    __privateGet(this, _process).reallyExit = __privateGet(this, _originalProcessReallyExit);
    __privateGet(this, _emitter).count -= 1;
  }
}
_hupSig = new WeakMap();
_emitter = new WeakMap();
_process = new WeakMap();
_originalProcessEmit = new WeakMap();
_originalProcessReallyExit = new WeakMap();
_sigListeners = new WeakMap();
_loaded = new WeakMap();
_SignalExit_instances = new WeakSet();
processReallyExit_fn = function(code) {
  if (!processOk(__privateGet(this, _process))) {
    return 0;
  }
  __privateGet(this, _process).exitCode = code || 0;
  __privateGet(this, _emitter).emit("exit", __privateGet(this, _process).exitCode, null);
  return __privateGet(this, _originalProcessReallyExit).call(__privateGet(this, _process), __privateGet(this, _process).exitCode);
};
processEmit_fn = function(ev, ...args2) {
  const og = __privateGet(this, _originalProcessEmit);
  if (ev === "exit" && processOk(__privateGet(this, _process))) {
    if (typeof args2[0] === "number") {
      __privateGet(this, _process).exitCode = args2[0];
    }
    const ret = og.call(__privateGet(this, _process), ev, ...args2);
    __privateGet(this, _emitter).emit("exit", __privateGet(this, _process).exitCode, null);
    return ret;
  } else {
    return og.call(__privateGet(this, _process), ev, ...args2);
  }
};
const process$1 = globalThis.process;
const {
  /**
   * Called when the process is exiting, whether via signal, explicit
   * exit, or running out of stuff to do.
   *
   * If the global process object is not suitable for instrumentation,
   * then this will be a no-op.
   *
   * Returns a function that may be used to unload signal-exit.
   */
  onExit
} = signalExitWrap(processOk(process$1) ? new SignalExit(process$1) : new SignalExitFallback());
var ansiEscapes$1 = { exports: {} };
var hasRequiredAnsiEscapes;
function requireAnsiEscapes() {
  if (hasRequiredAnsiEscapes) return ansiEscapes$1.exports;
  hasRequiredAnsiEscapes = 1;
  (function(module2) {
    const ansiEscapes2 = module2.exports;
    module2.exports.default = ansiEscapes2;
    const ESC = "\x1B[";
    const OSC = "\x1B]";
    const BEL = "\x07";
    const SEP = ";";
    const isTerminalApp = process.env.TERM_PROGRAM === "Apple_Terminal";
    ansiEscapes2.cursorTo = (x, y) => {
      if (typeof x !== "number") {
        throw new TypeError("The `x` argument is required");
      }
      if (typeof y !== "number") {
        return ESC + (x + 1) + "G";
      }
      return ESC + (y + 1) + ";" + (x + 1) + "H";
    };
    ansiEscapes2.cursorMove = (x, y) => {
      if (typeof x !== "number") {
        throw new TypeError("The `x` argument is required");
      }
      let ret = "";
      if (x < 0) {
        ret += ESC + -x + "D";
      } else if (x > 0) {
        ret += ESC + x + "C";
      }
      if (y < 0) {
        ret += ESC + -y + "A";
      } else if (y > 0) {
        ret += ESC + y + "B";
      }
      return ret;
    };
    ansiEscapes2.cursorUp = (count2 = 1) => ESC + count2 + "A";
    ansiEscapes2.cursorDown = (count2 = 1) => ESC + count2 + "B";
    ansiEscapes2.cursorForward = (count2 = 1) => ESC + count2 + "C";
    ansiEscapes2.cursorBackward = (count2 = 1) => ESC + count2 + "D";
    ansiEscapes2.cursorLeft = ESC + "G";
    ansiEscapes2.cursorSavePosition = isTerminalApp ? "\x1B7" : ESC + "s";
    ansiEscapes2.cursorRestorePosition = isTerminalApp ? "\x1B8" : ESC + "u";
    ansiEscapes2.cursorGetPosition = ESC + "6n";
    ansiEscapes2.cursorNextLine = ESC + "E";
    ansiEscapes2.cursorPrevLine = ESC + "F";
    ansiEscapes2.cursorHide = ESC + "?25l";
    ansiEscapes2.cursorShow = ESC + "?25h";
    ansiEscapes2.eraseLines = (count2) => {
      let clear = "";
      for (let i = 0; i < count2; i++) {
        clear += ansiEscapes2.eraseLine + (i < count2 - 1 ? ansiEscapes2.cursorUp() : "");
      }
      if (count2) {
        clear += ansiEscapes2.cursorLeft;
      }
      return clear;
    };
    ansiEscapes2.eraseEndLine = ESC + "K";
    ansiEscapes2.eraseStartLine = ESC + "1K";
    ansiEscapes2.eraseLine = ESC + "2K";
    ansiEscapes2.eraseDown = ESC + "J";
    ansiEscapes2.eraseUp = ESC + "1J";
    ansiEscapes2.eraseScreen = ESC + "2J";
    ansiEscapes2.scrollUp = ESC + "S";
    ansiEscapes2.scrollDown = ESC + "T";
    ansiEscapes2.clearScreen = "\x1Bc";
    ansiEscapes2.clearTerminal = process.platform === "win32" ? `${ansiEscapes2.eraseScreen}${ESC}0f` : (
      // 1. Erases the screen (Only done in case `2` is not supported)
      // 2. Erases the whole screen including scrollback buffer
      // 3. Moves cursor to the top-left position
      // More info: https://www.real-world-systems.com/docs/ANSIcode.html
      `${ansiEscapes2.eraseScreen}${ESC}3J${ESC}H`
    );
    ansiEscapes2.beep = BEL;
    ansiEscapes2.link = (text, url) => {
      return [
        OSC,
        "8",
        SEP,
        SEP,
        url,
        BEL,
        text,
        OSC,
        "8",
        SEP,
        SEP,
        BEL
      ].join("");
    };
    ansiEscapes2.image = (buffer2, options = {}) => {
      let ret = `${OSC}1337;File=inline=1`;
      if (options.width) {
        ret += `;width=${options.width}`;
      }
      if (options.height) {
        ret += `;height=${options.height}`;
      }
      if (options.preserveAspectRatio === false) {
        ret += ";preserveAspectRatio=0";
      }
      return ret + ":" + buffer2.toString("base64") + BEL;
    };
    ansiEscapes2.iTerm = {
      setCwd: (cwd = process.cwd()) => `${OSC}50;CurrentDir=${cwd}${BEL}`,
      annotation: (message, options = {}) => {
        let ret = `${OSC}1337;`;
        const hasX = typeof options.x !== "undefined";
        const hasY = typeof options.y !== "undefined";
        if ((hasX || hasY) && !(hasX && hasY && typeof options.length !== "undefined")) {
          throw new Error("`x`, `y` and `length` must be defined when `x` or `y` is defined");
        }
        message = message.replace(/\|/g, "");
        ret += options.isHidden ? "AddHiddenAnnotation=" : "AddAnnotation=";
        if (options.length > 0) {
          ret += (hasX ? [message, options.length, options.x, options.y] : [options.length, message]).join("|");
        } else {
          ret += message;
        }
        return ret + BEL;
      }
    };
  })(ansiEscapes$1);
  return ansiEscapes$1.exports;
}
var ansiEscapesExports = requireAnsiEscapes();
const ansiEscapes = /* @__PURE__ */ getDefaultExportFromCjs(ansiEscapesExports);
const height = (content) => content.split("\n").length;
const lastLine = (content) => content.split("\n").pop() ?? "";
function cursorDown(n) {
  return n > 0 ? ansiEscapes.cursorDown(n) : "";
}
class ScreenManager {
  constructor(rl) {
    // These variables are keeping information to allow correct prompt re-rendering
    __publicField(this, "height", 0);
    __publicField(this, "extraLinesUnderPrompt", 0);
    __publicField(this, "cursorPos");
    __publicField(this, "rl");
    this.rl = rl;
    this.cursorPos = rl.getCursorPos();
  }
  write(content) {
    this.rl.output.unmute();
    this.rl.output.write(content);
    this.rl.output.mute();
  }
  render(content, bottomContent = "") {
    const promptLine = lastLine(content);
    const rawPromptLine = node_util.stripVTControlCharacters(promptLine);
    let prompt2 = rawPromptLine;
    if (this.rl.line.length > 0) {
      prompt2 = prompt2.slice(0, -this.rl.line.length);
    }
    this.rl.setPrompt(prompt2);
    this.cursorPos = this.rl.getCursorPos();
    const width = readlineWidth();
    content = breakLines(content, width);
    bottomContent = breakLines(bottomContent, width);
    if (rawPromptLine.length % width === 0) {
      content += "\n";
    }
    let output = content + (bottomContent ? "\n" + bottomContent : "");
    const promptLineUpDiff = Math.floor(rawPromptLine.length / width) - this.cursorPos.rows;
    const bottomContentHeight = promptLineUpDiff + (bottomContent ? height(bottomContent) : 0);
    if (bottomContentHeight > 0)
      output += ansiEscapes.cursorUp(bottomContentHeight);
    output += ansiEscapes.cursorTo(this.cursorPos.cols);
    this.write(cursorDown(this.extraLinesUnderPrompt) + ansiEscapes.eraseLines(this.height) + output);
    this.extraLinesUnderPrompt = bottomContentHeight;
    this.height = height(output);
  }
  checkCursorPos() {
    const cursorPos = this.rl.getCursorPos();
    if (cursorPos.cols !== this.cursorPos.cols) {
      this.write(ansiEscapes.cursorTo(cursorPos.cols));
      this.cursorPos = cursorPos;
    }
  }
  done({ clearContent }) {
    this.rl.setPrompt("");
    let output = cursorDown(this.extraLinesUnderPrompt);
    output += clearContent ? ansiEscapes.eraseLines(this.height) : "\n";
    output += ansiEscapes.cursorShow;
    this.write(output);
    this.rl.close();
  }
}
class PromisePolyfill extends Promise {
  // Available starting from Node 22
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers
  static withResolver() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  }
}
function getCallSites() {
  const _prepareStackTrace = Error.prepareStackTrace;
  let result = [];
  try {
    Error.prepareStackTrace = (_2, callSites) => {
      const callSitesWithoutCurrent = callSites.slice(1);
      result = callSitesWithoutCurrent;
      return callSitesWithoutCurrent;
    };
    new Error().stack;
  } catch {
    return result;
  }
  Error.prepareStackTrace = _prepareStackTrace;
  return result;
}
function createPrompt(view) {
  const callSites = getCallSites();
  const prompt2 = (config2, context = {}) => {
    const { input: input2 = process.stdin, signal } = context;
    const cleanups = /* @__PURE__ */ new Set();
    const output = new MuteStream();
    output.pipe(context.output ?? process.stdout);
    const rl = readline__namespace.createInterface({
      terminal: true,
      input: input2,
      output
    });
    const screen = new ScreenManager(rl);
    const { promise, resolve, reject } = PromisePolyfill.withResolver();
    const cancel = () => reject(new CancelPromptError());
    if (signal) {
      const abort = () => reject(new AbortPromptError({ cause: signal.reason }));
      if (signal.aborted) {
        abort();
        return Object.assign(promise, { cancel });
      }
      signal.addEventListener("abort", abort);
      cleanups.add(() => signal.removeEventListener("abort", abort));
    }
    cleanups.add(onExit((code, signal2) => {
      reject(new ExitPromptError(`User force closed the prompt with ${code} ${signal2}`));
    }));
    const checkCursorPos = () => screen.checkCursorPos();
    rl.input.on("keypress", checkCursorPos);
    cleanups.add(() => rl.input.removeListener("keypress", checkCursorPos));
    return withHooks(rl, (cycle) => {
      const hooksCleanup = node_async_hooks.AsyncResource.bind(() => effectScheduler.clearAll());
      rl.on("close", hooksCleanup);
      cleanups.add(() => rl.removeListener("close", hooksCleanup));
      cycle(() => {
        try {
          const nextView = view(config2, (value) => {
            setImmediate(() => resolve(value));
          });
          if (nextView === void 0) {
            const callerFilename = callSites[1]?.getFileName?.();
            throw new Error(`Prompt functions must return a string.
    at ${callerFilename}`);
          }
          const [content, bottomContent] = typeof nextView === "string" ? [nextView] : nextView;
          screen.render(content, bottomContent);
          effectScheduler.run();
        } catch (error2) {
          reject(error2);
        }
      });
      return Object.assign(promise.then((answer) => {
        effectScheduler.clearAll();
        return answer;
      }, (error2) => {
        effectScheduler.clearAll();
        throw error2;
      }).finally(() => {
        cleanups.forEach((cleanup) => cleanup());
        screen.done({ clearContent: Boolean(context.clearPromptOnDone) });
        output.end();
      }).then(() => promise), { cancel });
    });
  };
  return prompt2;
}
class Separator {
  constructor(separator) {
    __publicField(this, "separator", colors.dim(Array.from({ length: 15 }).join(figures.line)));
    __publicField(this, "type", "separator");
    if (separator) {
      this.separator = separator;
    }
  }
  static isSeparator(choice) {
    return Boolean(choice && typeof choice === "object" && "type" in choice && choice.type === "separator");
  }
}
const checkboxTheme = {
  icon: {
    checked: colors.green(figures.circleFilled),
    unchecked: figures.circle,
    cursor: figures.pointer
  },
  style: {
    disabledChoice: (text) => colors.dim(`- ${text}`),
    renderSelectedChoices: (selectedChoices) => selectedChoices.map((choice) => choice.short).join(", "),
    description: (text) => colors.cyan(text)
  },
  helpMode: "auto"
};
function isSelectable$2(item) {
  return !Separator.isSeparator(item) && !item.disabled;
}
function isChecked(item) {
  return isSelectable$2(item) && Boolean(item.checked);
}
function toggle(item) {
  return isSelectable$2(item) ? { ...item, checked: !item.checked } : item;
}
function check(checked) {
  return function(item) {
    return isSelectable$2(item) ? { ...item, checked } : item;
  };
}
function normalizeChoices$4(choices) {
  return choices.map((choice) => {
    if (Separator.isSeparator(choice))
      return choice;
    if (typeof choice === "string") {
      return {
        value: choice,
        name: choice,
        short: choice,
        disabled: false,
        checked: false
      };
    }
    const name = choice.name ?? String(choice.value);
    return {
      value: choice.value,
      name,
      short: choice.short ?? name,
      description: choice.description,
      disabled: choice.disabled ?? false,
      checked: choice.checked ?? false
    };
  });
}
const checkbox = createPrompt((config2, done) => {
  const { instructions, pageSize = 7, loop = true, required, validate = () => true } = config2;
  const shortcuts = { all: "a", invert: "i", ...config2.shortcuts };
  const theme = makeTheme(checkboxTheme, config2.theme);
  const firstRender = useRef(true);
  const [status, setStatus] = useState("idle");
  const prefix = usePrefix({ status, theme });
  const [items, setItems] = useState(normalizeChoices$4(config2.choices));
  const bounds = useMemo(() => {
    const first2 = items.findIndex(isSelectable$2);
    const last2 = items.findLastIndex(isSelectable$2);
    if (first2 === -1) {
      throw new ValidationError("[checkbox prompt] No selectable choices. All choices are disabled.");
    }
    return { first: first2, last: last2 };
  }, [items]);
  const [active, setActive] = useState(bounds.first);
  const [showHelpTip, setShowHelpTip] = useState(true);
  const [errorMsg, setError] = useState();
  useKeypress(async (key) => {
    if (isEnterKey(key)) {
      const selection = items.filter(isChecked);
      const isValid = await validate([...selection]);
      if (required && !items.some(isChecked)) {
        setError("At least one choice must be selected");
      } else if (isValid === true) {
        setStatus("done");
        done(selection.map((choice) => choice.value));
      } else {
        setError(isValid || "You must select a valid value");
      }
    } else if (isUpKey(key) || isDownKey(key)) {
      if (loop || isUpKey(key) && active !== bounds.first || isDownKey(key) && active !== bounds.last) {
        const offset = isUpKey(key) ? -1 : 1;
        let next = active;
        do {
          next = (next + offset + items.length) % items.length;
        } while (!isSelectable$2(items[next]));
        setActive(next);
      }
    } else if (isSpaceKey(key)) {
      setError(void 0);
      setShowHelpTip(false);
      setItems(items.map((choice, i) => i === active ? toggle(choice) : choice));
    } else if (key.name === shortcuts.all) {
      const selectAll = items.some((choice) => isSelectable$2(choice) && !choice.checked);
      setItems(items.map(check(selectAll)));
    } else if (key.name === shortcuts.invert) {
      setItems(items.map(toggle));
    } else if (isNumberKey(key)) {
      const position = Number(key.name) - 1;
      const item = items[position];
      if (item != null && isSelectable$2(item)) {
        setActive(position);
        setItems(items.map((choice, i) => i === position ? toggle(choice) : choice));
      }
    }
  });
  const message = theme.style.message(config2.message, status);
  let description;
  const page = usePagination({
    items,
    active,
    renderItem({ item, isActive }) {
      if (Separator.isSeparator(item)) {
        return ` ${item.separator}`;
      }
      if (item.disabled) {
        const disabledLabel = typeof item.disabled === "string" ? item.disabled : "(disabled)";
        return theme.style.disabledChoice(`${item.name} ${disabledLabel}`);
      }
      if (isActive) {
        description = item.description;
      }
      const checkbox2 = item.checked ? theme.icon.checked : theme.icon.unchecked;
      const color = isActive ? theme.style.highlight : (x) => x;
      const cursor = isActive ? theme.icon.cursor : " ";
      return color(`${cursor}${checkbox2} ${item.name}`);
    },
    pageSize,
    loop
  });
  if (status === "done") {
    const selection = items.filter(isChecked);
    const answer = theme.style.answer(theme.style.renderSelectedChoices(selection, items));
    return `${prefix} ${message} ${answer}`;
  }
  let helpTipTop = "";
  let helpTipBottom = "";
  if (theme.helpMode === "always" || theme.helpMode === "auto" && showHelpTip && (instructions === void 0 || instructions)) {
    if (typeof instructions === "string") {
      helpTipTop = instructions;
    } else {
      const keys = [
        `${theme.style.key("space")} to select`,
        shortcuts.all ? `${theme.style.key(shortcuts.all)} to toggle all` : "",
        shortcuts.invert ? `${theme.style.key(shortcuts.invert)} to invert selection` : "",
        `and ${theme.style.key("enter")} to proceed`
      ];
      helpTipTop = ` (Press ${keys.filter((key) => key !== "").join(", ")})`;
    }
    if (items.length > pageSize && (theme.helpMode === "always" || // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    theme.helpMode === "auto" && firstRender.current)) {
      helpTipBottom = `
${theme.style.help("(Use arrow keys to reveal more choices)")}`;
      firstRender.current = false;
    }
  }
  const choiceDescription = description ? `
${theme.style.description(description)}` : ``;
  let error2 = "";
  if (errorMsg) {
    error2 = `
${theme.style.error(errorMsg)}`;
  }
  return `${prefix} ${message}${helpTipTop}
${page}${helpTipBottom}${choiceDescription}${error2}${ansiEscapes.cursorHide}`;
});
var main = {};
var chardet = {};
var match;
var hasRequiredMatch;
function requireMatch() {
  if (hasRequiredMatch) return match;
  hasRequiredMatch = 1;
  match = function(det, rec, confidence, name, lang) {
    this.confidence = confidence;
    this.name = name || rec.name(det);
    this.lang = lang;
  };
  return match;
}
var utf8;
var hasRequiredUtf8;
function requireUtf8() {
  if (hasRequiredUtf8) return utf8;
  hasRequiredUtf8 = 1;
  var Match = requireMatch();
  utf8 = function() {
    this.name = function() {
      return "UTF-8";
    };
    this.match = function(det) {
      var hasBOM = false, numValid = 0, numInvalid = 0, input2 = det.fRawInput, trailBytes = 0, confidence;
      if (det.fRawLength >= 3 && (input2[0] & 255) == 239 && (input2[1] & 255) == 187 && (input2[2] & 255) == 191) {
        hasBOM = true;
      }
      for (var i = 0; i < det.fRawLength; i++) {
        var b = input2[i];
        if ((b & 128) == 0)
          continue;
        if ((b & 224) == 192) {
          trailBytes = 1;
        } else if ((b & 240) == 224) {
          trailBytes = 2;
        } else if ((b & 248) == 240) {
          trailBytes = 3;
        } else {
          numInvalid++;
          if (numInvalid > 5)
            break;
          trailBytes = 0;
        }
        for (; ; ) {
          i++;
          if (i >= det.fRawLength)
            break;
          if ((input2[i] & 192) != 128) {
            numInvalid++;
            break;
          }
          if (--trailBytes == 0) {
            numValid++;
            break;
          }
        }
      }
      confidence = 0;
      if (hasBOM && numInvalid == 0)
        confidence = 100;
      else if (hasBOM && numValid > numInvalid * 10)
        confidence = 80;
      else if (numValid > 3 && numInvalid == 0)
        confidence = 100;
      else if (numValid > 0 && numInvalid == 0)
        confidence = 80;
      else if (numValid == 0 && numInvalid == 0)
        confidence = 10;
      else if (numValid > numInvalid * 10)
        confidence = 25;
      else
        return null;
      return new Match(det, this, confidence);
    };
  };
  return utf8;
}
var unicode = { exports: {} };
var hasRequiredUnicode;
function requireUnicode() {
  if (hasRequiredUnicode) return unicode.exports;
  hasRequiredUnicode = 1;
  (function(module2) {
    var util = require$$0$4, Match = requireMatch();
    module2.exports.UTF_16BE = function() {
      this.name = function() {
        return "UTF-16BE";
      };
      this.match = function(det) {
        var input2 = det.fRawInput;
        if (input2.length >= 2 && ((input2[0] & 255) == 254 && (input2[1] & 255) == 255)) {
          return new Match(det, this, 100);
        }
        return null;
      };
    };
    module2.exports.UTF_16LE = function() {
      this.name = function() {
        return "UTF-16LE";
      };
      this.match = function(det) {
        var input2 = det.fRawInput;
        if (input2.length >= 2 && ((input2[0] & 255) == 255 && (input2[1] & 255) == 254)) {
          if (input2.length >= 4 && input2[2] == 0 && input2[3] == 0) {
            return null;
          }
          return new Match(det, this, 100);
        }
        return null;
      };
    };
    function UTF_32() {
    }
    UTF_32.prototype.match = function(det) {
      var input2 = det.fRawInput, limit = det.fRawLength / 4 * 4, numValid = 0, numInvalid = 0, hasBOM = false, confidence = 0;
      if (limit == 0) {
        return null;
      }
      if (this.getChar(input2, 0) == 65279) {
        hasBOM = true;
      }
      for (var i = 0; i < limit; i += 4) {
        var ch = this.getChar(input2, i);
        if (ch < 0 || ch >= 1114111 || ch >= 55296 && ch <= 57343) {
          numInvalid += 1;
        } else {
          numValid += 1;
        }
      }
      if (hasBOM && numInvalid == 0) {
        confidence = 100;
      } else if (hasBOM && numValid > numInvalid * 10) {
        confidence = 80;
      } else if (numValid > 3 && numInvalid == 0) {
        confidence = 100;
      } else if (numValid > 0 && numInvalid == 0) {
        confidence = 80;
      } else if (numValid > numInvalid * 10) {
        confidence = 25;
      }
      return confidence == 0 ? null : new Match(det, this, confidence);
    };
    module2.exports.UTF_32BE = function() {
      this.name = function() {
        return "UTF-32BE";
      };
      this.getChar = function(input2, index) {
        return (input2[index + 0] & 255) << 24 | (input2[index + 1] & 255) << 16 | (input2[index + 2] & 255) << 8 | input2[index + 3] & 255;
      };
    };
    util.inherits(module2.exports.UTF_32BE, UTF_32);
    module2.exports.UTF_32LE = function() {
      this.name = function() {
        return "UTF-32LE";
      };
      this.getChar = function(input2, index) {
        return (input2[index + 3] & 255) << 24 | (input2[index + 2] & 255) << 16 | (input2[index + 1] & 255) << 8 | input2[index + 0] & 255;
      };
    };
    util.inherits(module2.exports.UTF_32LE, UTF_32);
  })(unicode);
  return unicode.exports;
}
var mbcs = { exports: {} };
var hasRequiredMbcs;
function requireMbcs() {
  if (hasRequiredMbcs) return mbcs.exports;
  hasRequiredMbcs = 1;
  (function(module2) {
    var util = require$$0$4, Match = requireMatch();
    function binarySearch(arr, searchValue) {
      function find2(arr2, searchValue2, left, right) {
        if (right < left)
          return -1;
        var mid = Math.floor(left + right >>> 1);
        if (searchValue2 > arr2[mid])
          return find2(arr2, searchValue2, mid + 1, right);
        if (searchValue2 < arr2[mid])
          return find2(arr2, searchValue2, left, mid - 1);
        return mid;
      }
      return find2(arr, searchValue, 0, arr.length - 1);
    }
    function IteratedChar() {
      this.charValue = 0;
      this.index = 0;
      this.nextIndex = 0;
      this.error = false;
      this.done = false;
      this.reset = function() {
        this.charValue = 0;
        this.index = -1;
        this.nextIndex = 0;
        this.error = false;
        this.done = false;
      };
      this.nextByte = function(det) {
        if (this.nextIndex >= det.fRawLength) {
          this.done = true;
          return -1;
        }
        var byteValue = det.fRawInput[this.nextIndex++] & 255;
        return byteValue;
      };
    }
    function mbcs2() {
    }
    mbcs2.prototype.match = function(det) {
      var doubleByteCharCount = 0, commonCharCount = 0, badCharCount = 0, totalCharCount = 0, confidence = 0;
      var iter = new IteratedChar();
      detectBlock: {
        for (iter.reset(); this.nextChar(iter, det); ) {
          totalCharCount++;
          if (iter.error) {
            badCharCount++;
          } else {
            var cv = iter.charValue & 4294967295;
            if (cv <= 255) ;
            else {
              doubleByteCharCount++;
              if (this.commonChars != null) {
                if (binarySearch(this.commonChars, cv) >= 0) {
                  commonCharCount++;
                }
              }
            }
          }
          if (badCharCount >= 2 && badCharCount * 5 >= doubleByteCharCount) {
            break detectBlock;
          }
        }
        if (doubleByteCharCount <= 10 && badCharCount == 0) {
          if (doubleByteCharCount == 0 && totalCharCount < 10) {
            confidence = 0;
          } else {
            confidence = 10;
          }
          break detectBlock;
        }
        if (doubleByteCharCount < 20 * badCharCount) {
          confidence = 0;
          break detectBlock;
        }
        if (this.commonChars == null) {
          confidence = 30 + doubleByteCharCount - 20 * badCharCount;
          if (confidence > 100) {
            confidence = 100;
          }
        } else {
          var maxVal = Math.log(parseFloat(doubleByteCharCount) / 4);
          var scaleFactor = 90 / maxVal;
          confidence = Math.floor(Math.log(commonCharCount + 1) * scaleFactor + 10);
          confidence = Math.min(confidence, 100);
        }
      }
      return confidence == 0 ? null : new Match(det, this, confidence);
    };
    mbcs2.prototype.nextChar = function(iter, det) {
    };
    module2.exports.sjis = function() {
      this.name = function() {
        return "Shift-JIS";
      };
      this.language = function() {
        return "ja";
      };
      this.commonChars = [
        33088,
        33089,
        33090,
        33093,
        33115,
        33129,
        33130,
        33141,
        33142,
        33440,
        33442,
        33444,
        33449,
        33450,
        33451,
        33453,
        33455,
        33457,
        33459,
        33461,
        33463,
        33469,
        33470,
        33473,
        33476,
        33477,
        33478,
        33480,
        33481,
        33484,
        33485,
        33500,
        33504,
        33511,
        33512,
        33513,
        33514,
        33520,
        33521,
        33601,
        33603,
        33614,
        33615,
        33624,
        33630,
        33634,
        33639,
        33653,
        33654,
        33673,
        33674,
        33675,
        33677,
        33683,
        36502,
        37882,
        38314
      ];
      this.nextChar = function(iter, det) {
        iter.index = iter.nextIndex;
        iter.error = false;
        var firstByte;
        firstByte = iter.charValue = iter.nextByte(det);
        if (firstByte < 0)
          return false;
        if (firstByte <= 127 || firstByte > 160 && firstByte <= 223)
          return true;
        var secondByte = iter.nextByte(det);
        if (secondByte < 0)
          return false;
        iter.charValue = firstByte << 8 | secondByte;
        if (!(secondByte >= 64 && secondByte <= 127 || secondByte >= 128 && secondByte <= 255)) {
          iter.error = true;
        }
        return true;
      };
    };
    util.inherits(module2.exports.sjis, mbcs2);
    module2.exports.big5 = function() {
      this.name = function() {
        return "Big5";
      };
      this.language = function() {
        return "zh";
      };
      this.commonChars = [
        41280,
        41281,
        41282,
        41283,
        41287,
        41289,
        41333,
        41334,
        42048,
        42054,
        42055,
        42056,
        42065,
        42068,
        42071,
        42084,
        42090,
        42092,
        42103,
        42147,
        42148,
        42151,
        42177,
        42190,
        42193,
        42207,
        42216,
        42237,
        42304,
        42312,
        42328,
        42345,
        42445,
        42471,
        42583,
        42593,
        42594,
        42600,
        42608,
        42664,
        42675,
        42681,
        42707,
        42715,
        42726,
        42738,
        42816,
        42833,
        42841,
        42970,
        43171,
        43173,
        43181,
        43217,
        43219,
        43236,
        43260,
        43456,
        43474,
        43507,
        43627,
        43706,
        43710,
        43724,
        43772,
        44103,
        44111,
        44208,
        44242,
        44377,
        44745,
        45024,
        45290,
        45423,
        45747,
        45764,
        45935,
        46156,
        46158,
        46412,
        46501,
        46525,
        46544,
        46552,
        46705,
        47085,
        47207,
        47428,
        47832,
        47940,
        48033,
        48593,
        49860,
        50105,
        50240,
        50271
      ];
      this.nextChar = function(iter, det) {
        iter.index = iter.nextIndex;
        iter.error = false;
        var firstByte = iter.charValue = iter.nextByte(det);
        if (firstByte < 0)
          return false;
        if (firstByte <= 127 || firstByte == 255)
          return true;
        var secondByte = iter.nextByte(det);
        if (secondByte < 0)
          return false;
        iter.charValue = iter.charValue << 8 | secondByte;
        if (secondByte < 64 || secondByte == 127 || secondByte == 255)
          iter.error = true;
        return true;
      };
    };
    util.inherits(module2.exports.big5, mbcs2);
    function eucNextChar(iter, det) {
      iter.index = iter.nextIndex;
      iter.error = false;
      var firstByte = 0;
      var secondByte = 0;
      var thirdByte = 0;
      buildChar: {
        firstByte = iter.charValue = iter.nextByte(det);
        if (firstByte < 0) {
          iter.done = true;
          break buildChar;
        }
        if (firstByte <= 141) {
          break buildChar;
        }
        secondByte = iter.nextByte(det);
        iter.charValue = iter.charValue << 8 | secondByte;
        if (firstByte >= 161 && firstByte <= 254) {
          if (secondByte < 161) {
            iter.error = true;
          }
          break buildChar;
        }
        if (firstByte == 142) {
          if (secondByte < 161) {
            iter.error = true;
          }
          break buildChar;
        }
        if (firstByte == 143) {
          thirdByte = iter.nextByte(det);
          iter.charValue = iter.charValue << 8 | thirdByte;
          if (thirdByte < 161) {
            iter.error = true;
          }
        }
      }
      return iter.done == false;
    }
    module2.exports.euc_jp = function() {
      this.name = function() {
        return "EUC-JP";
      };
      this.language = function() {
        return "ja";
      };
      this.commonChars = [
        41377,
        41378,
        41379,
        41382,
        41404,
        41418,
        41419,
        41430,
        41431,
        42146,
        42148,
        42150,
        42152,
        42154,
        42155,
        42156,
        42157,
        42159,
        42161,
        42163,
        42165,
        42167,
        42169,
        42171,
        42173,
        42175,
        42176,
        42177,
        42179,
        42180,
        42182,
        42183,
        42184,
        42185,
        42186,
        42187,
        42190,
        42191,
        42192,
        42206,
        42207,
        42209,
        42210,
        42212,
        42216,
        42217,
        42218,
        42219,
        42220,
        42223,
        42226,
        42227,
        42402,
        42403,
        42404,
        42406,
        42407,
        42410,
        42413,
        42415,
        42416,
        42419,
        42421,
        42423,
        42424,
        42425,
        42431,
        42435,
        42438,
        42439,
        42440,
        42441,
        42443,
        42448,
        42453,
        42454,
        42455,
        42462,
        42464,
        42465,
        42469,
        42473,
        42474,
        42475,
        42476,
        42477,
        42483,
        47273,
        47572,
        47854,
        48072,
        48880,
        49079,
        50410,
        50940,
        51133,
        51896,
        51955,
        52188,
        52689
      ];
      this.nextChar = eucNextChar;
    };
    util.inherits(module2.exports.euc_jp, mbcs2);
    module2.exports.euc_kr = function() {
      this.name = function() {
        return "EUC-KR";
      };
      this.language = function() {
        return "ko";
      };
      this.commonChars = [
        45217,
        45235,
        45253,
        45261,
        45268,
        45286,
        45293,
        45304,
        45306,
        45308,
        45496,
        45497,
        45511,
        45527,
        45538,
        45994,
        46011,
        46274,
        46287,
        46297,
        46315,
        46501,
        46517,
        46527,
        46535,
        46569,
        46835,
        47023,
        47042,
        47054,
        47270,
        47278,
        47286,
        47288,
        47291,
        47337,
        47531,
        47534,
        47564,
        47566,
        47613,
        47800,
        47822,
        47824,
        47857,
        48103,
        48115,
        48125,
        48301,
        48314,
        48338,
        48374,
        48570,
        48576,
        48579,
        48581,
        48838,
        48840,
        48863,
        48878,
        48888,
        48890,
        49057,
        49065,
        49088,
        49124,
        49131,
        49132,
        49144,
        49319,
        49327,
        49336,
        49338,
        49339,
        49341,
        49351,
        49356,
        49358,
        49359,
        49366,
        49370,
        49381,
        49403,
        49404,
        49572,
        49574,
        49590,
        49622,
        49631,
        49654,
        49656,
        50337,
        50637,
        50862,
        51151,
        51153,
        51154,
        51160,
        51173,
        51373
      ];
      this.nextChar = eucNextChar;
    };
    util.inherits(module2.exports.euc_kr, mbcs2);
    module2.exports.gb_18030 = function() {
      this.name = function() {
        return "GB18030";
      };
      this.language = function() {
        return "zh";
      };
      this.nextChar = function(iter, det) {
        iter.index = iter.nextIndex;
        iter.error = false;
        var firstByte = 0;
        var secondByte = 0;
        var thirdByte = 0;
        var fourthByte = 0;
        buildChar: {
          firstByte = iter.charValue = iter.nextByte(det);
          if (firstByte < 0) {
            iter.done = true;
            break buildChar;
          }
          if (firstByte <= 128) {
            break buildChar;
          }
          secondByte = iter.nextByte(det);
          iter.charValue = iter.charValue << 8 | secondByte;
          if (firstByte >= 129 && firstByte <= 254) {
            if (secondByte >= 64 && secondByte <= 126 || secondByte >= 80 && secondByte <= 254) {
              break buildChar;
            }
            if (secondByte >= 48 && secondByte <= 57) {
              thirdByte = iter.nextByte(det);
              if (thirdByte >= 129 && thirdByte <= 254) {
                fourthByte = iter.nextByte(det);
                if (fourthByte >= 48 && fourthByte <= 57) {
                  iter.charValue = iter.charValue << 16 | thirdByte << 8 | fourthByte;
                  break buildChar;
                }
              }
            }
            iter.error = true;
            break buildChar;
          }
        }
        return iter.done == false;
      };
      this.commonChars = [
        41377,
        41378,
        41379,
        41380,
        41392,
        41393,
        41457,
        41459,
        41889,
        41900,
        41914,
        45480,
        45496,
        45502,
        45755,
        46025,
        46070,
        46323,
        46525,
        46532,
        46563,
        46767,
        46804,
        46816,
        47010,
        47016,
        47037,
        47062,
        47069,
        47284,
        47327,
        47350,
        47531,
        47561,
        47576,
        47610,
        47613,
        47821,
        48039,
        48086,
        48097,
        48122,
        48316,
        48347,
        48382,
        48588,
        48845,
        48861,
        49076,
        49094,
        49097,
        49332,
        49389,
        49611,
        49883,
        50119,
        50396,
        50410,
        50636,
        50935,
        51192,
        51371,
        51403,
        51413,
        51431,
        51663,
        51706,
        51889,
        51893,
        51911,
        51920,
        51926,
        51957,
        51965,
        52460,
        52728,
        52906,
        52932,
        52946,
        52965,
        53173,
        53186,
        53206,
        53442,
        53445,
        53456,
        53460,
        53671,
        53930,
        53938,
        53941,
        53947,
        53972,
        54211,
        54224,
        54269,
        54466,
        54490,
        54754,
        54992
      ];
    };
    util.inherits(module2.exports.gb_18030, mbcs2);
  })(mbcs);
  return mbcs.exports;
}
var sbcs = { exports: {} };
var hasRequiredSbcs;
function requireSbcs() {
  if (hasRequiredSbcs) return sbcs.exports;
  hasRequiredSbcs = 1;
  (function(module2) {
    var util = require$$0$4, Match = requireMatch();
    function NGramParser(theNgramList, theByteMap) {
      var N_GRAM_MASK = 16777215;
      this.byteIndex = 0;
      this.ngram = 0;
      this.ngramList = theNgramList;
      this.byteMap = theByteMap;
      this.ngramCount = 0;
      this.hitCount = 0;
      this.spaceChar;
      this.search = function(table, value) {
        var index = 0;
        if (table[index + 32] <= value) index += 32;
        if (table[index + 16] <= value) index += 16;
        if (table[index + 8] <= value) index += 8;
        if (table[index + 4] <= value) index += 4;
        if (table[index + 2] <= value) index += 2;
        if (table[index + 1] <= value) index += 1;
        if (table[index] > value) index -= 1;
        if (index < 0 || table[index] != value)
          return -1;
        return index;
      };
      this.lookup = function(thisNgram) {
        this.ngramCount += 1;
        if (this.search(this.ngramList, thisNgram) >= 0) {
          this.hitCount += 1;
        }
      };
      this.addByte = function(b) {
        this.ngram = (this.ngram << 8) + (b & 255) & N_GRAM_MASK;
        this.lookup(this.ngram);
      };
      this.nextByte = function(det) {
        if (this.byteIndex >= det.fInputLen)
          return -1;
        return det.fInputBytes[this.byteIndex++] & 255;
      };
      this.parse = function(det, spaceCh) {
        var b, ignoreSpace = false;
        this.spaceChar = spaceCh;
        while ((b = this.nextByte(det)) >= 0) {
          var mb = this.byteMap[b];
          if (mb != 0) {
            if (!(mb == this.spaceChar && ignoreSpace)) {
              this.addByte(mb);
            }
            ignoreSpace = mb == this.spaceChar;
          }
        }
        this.addByte(this.spaceChar);
        var rawPercent = this.hitCount / this.ngramCount;
        if (rawPercent > 0.33)
          return 98;
        return Math.floor(rawPercent * 300);
      };
    }
    function NGramsPlusLang(la, ng) {
      this.fLang = la;
      this.fNGrams = ng;
    }
    function sbcs2() {
    }
    sbcs2.prototype.spaceChar = 32;
    sbcs2.prototype.ngrams = function() {
    };
    sbcs2.prototype.byteMap = function() {
    };
    sbcs2.prototype.match = function(det) {
      var ngrams = this.ngrams();
      var multiple = Array.isArray(ngrams) && ngrams[0] instanceof NGramsPlusLang;
      if (!multiple) {
        var parser = new NGramParser(ngrams, this.byteMap());
        var confidence = parser.parse(det, this.spaceChar);
        return confidence <= 0 ? null : new Match(det, this, confidence);
      }
      var bestConfidenceSoFar = -1;
      var lang = null;
      for (var i = ngrams.length - 1; i >= 0; i--) {
        var ngl = ngrams[i];
        var parser = new NGramParser(ngl.fNGrams, this.byteMap());
        var confidence = parser.parse(det, this.spaceChar);
        if (confidence > bestConfidenceSoFar) {
          bestConfidenceSoFar = confidence;
          lang = ngl.fLang;
        }
      }
      var name = this.name(det);
      return bestConfidenceSoFar <= 0 ? null : new Match(det, this, bestConfidenceSoFar, name, lang);
    };
    module2.exports.ISO_8859_1 = function() {
      this.byteMap = function() {
        return [
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          0,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          97,
          98,
          99,
          100,
          101,
          102,
          103,
          104,
          105,
          106,
          107,
          108,
          109,
          110,
          111,
          112,
          113,
          114,
          115,
          116,
          117,
          118,
          119,
          120,
          121,
          122,
          32,
          32,
          32,
          32,
          32,
          32,
          97,
          98,
          99,
          100,
          101,
          102,
          103,
          104,
          105,
          106,
          107,
          108,
          109,
          110,
          111,
          112,
          113,
          114,
          115,
          116,
          117,
          118,
          119,
          120,
          121,
          122,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          170,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          181,
          32,
          32,
          32,
          32,
          186,
          32,
          32,
          32,
          32,
          32,
          224,
          225,
          226,
          227,
          228,
          229,
          230,
          231,
          232,
          233,
          234,
          235,
          236,
          237,
          238,
          239,
          240,
          241,
          242,
          243,
          244,
          245,
          246,
          32,
          248,
          249,
          250,
          251,
          252,
          253,
          254,
          223,
          224,
          225,
          226,
          227,
          228,
          229,
          230,
          231,
          232,
          233,
          234,
          235,
          236,
          237,
          238,
          239,
          240,
          241,
          242,
          243,
          244,
          245,
          246,
          32,
          248,
          249,
          250,
          251,
          252,
          253,
          254,
          255
        ];
      };
      this.ngrams = function() {
        return [
          new NGramsPlusLang("da", [
            2122086,
            2122100,
            2122853,
            2123118,
            2123122,
            2123375,
            2123873,
            2124064,
            2125157,
            2125671,
            2126053,
            2126697,
            2126708,
            2126953,
            2127465,
            6383136,
            6385184,
            6385252,
            6386208,
            6386720,
            6579488,
            6579566,
            6579570,
            6579572,
            6627443,
            6644768,
            6644837,
            6647328,
            6647396,
            6648352,
            6648421,
            6648608,
            6648864,
            6713202,
            6776096,
            6776174,
            6776178,
            6907749,
            6908960,
            6909543,
            7038240,
            7039845,
            7103858,
            7104871,
            7105637,
            7169380,
            7234661,
            7234848,
            7235360,
            7235429,
            7300896,
            7302432,
            7303712,
            7398688,
            7479396,
            7479397,
            7479411,
            7496992,
            7566437,
            7610483,
            7628064,
            7628146,
            7629164,
            7759218
          ]),
          new NGramsPlusLang("de", [
            2122094,
            2122101,
            2122341,
            2122849,
            2122853,
            2122857,
            2123113,
            2123621,
            2123873,
            2124142,
            2125161,
            2126691,
            2126693,
            2127214,
            2127461,
            2127471,
            2127717,
            2128501,
            6448498,
            6514720,
            6514789,
            6514804,
            6578547,
            6579566,
            6579570,
            6580581,
            6627428,
            6627443,
            6646126,
            6646132,
            6647328,
            6648352,
            6648608,
            6776174,
            6841710,
            6845472,
            6906728,
            6907168,
            6909472,
            6909541,
            6911008,
            7104867,
            7105637,
            7217249,
            7217252,
            7217267,
            7234592,
            7234661,
            7234848,
            7235360,
            7235429,
            7238757,
            7479396,
            7496805,
            7497065,
            7562088,
            7566437,
            7610468,
            7628064,
            7628142,
            7628146,
            7695972,
            7695975,
            7759218
          ]),
          new NGramsPlusLang("en", [
            2122016,
            2122094,
            2122341,
            2122607,
            2123375,
            2123873,
            2123877,
            2124142,
            2125153,
            2125670,
            2125938,
            2126437,
            2126689,
            2126708,
            2126952,
            2126959,
            2127720,
            6383972,
            6384672,
            6385184,
            6385252,
            6386464,
            6386720,
            6386789,
            6386793,
            6561889,
            6561908,
            6627425,
            6627443,
            6627444,
            6644768,
            6647412,
            6648352,
            6648608,
            6713202,
            6840692,
            6841632,
            6841714,
            6906912,
            6909472,
            6909543,
            6909806,
            6910752,
            7217249,
            7217268,
            7234592,
            7235360,
            7238688,
            7300640,
            7302688,
            7303712,
            7496992,
            7500576,
            7544929,
            7544948,
            7561577,
            7566368,
            7610484,
            7628146,
            7628897,
            7628901,
            7629167,
            7630624,
            7631648
          ]),
          new NGramsPlusLang("es", [
            2122016,
            2122593,
            2122607,
            2122853,
            2123116,
            2123118,
            2123123,
            2124142,
            2124897,
            2124911,
            2125921,
            2125935,
            2125938,
            2126197,
            2126437,
            2126693,
            2127214,
            2128160,
            6365283,
            6365284,
            6365285,
            6365292,
            6365296,
            6382441,
            6382703,
            6384672,
            6386208,
            6386464,
            6515187,
            6516590,
            6579488,
            6579564,
            6582048,
            6627428,
            6627429,
            6627436,
            6646816,
            6647328,
            6647412,
            6648608,
            6648692,
            6907246,
            6943598,
            7102752,
            7106419,
            7217253,
            7238757,
            7282788,
            7282789,
            7302688,
            7303712,
            7303968,
            7364978,
            7435621,
            7495968,
            7497075,
            7544932,
            7544933,
            7544944,
            7562528,
            7628064,
            7630624,
            7693600,
            15953440
          ]),
          new NGramsPlusLang("fr", [
            2122101,
            2122607,
            2122849,
            2122853,
            2122869,
            2123118,
            2123124,
            2124897,
            2124901,
            2125921,
            2125935,
            2125938,
            2126197,
            2126693,
            2126703,
            2127214,
            2154528,
            6385268,
            6386793,
            6513952,
            6516590,
            6579488,
            6579571,
            6583584,
            6627425,
            6627427,
            6627428,
            6627429,
            6627436,
            6627440,
            6627443,
            6647328,
            6647412,
            6648352,
            6648608,
            6648864,
            6649202,
            6909806,
            6910752,
            6911008,
            7102752,
            7103776,
            7103859,
            7169390,
            7217252,
            7234848,
            7238432,
            7238688,
            7302688,
            7302772,
            7304562,
            7435621,
            7479404,
            7496992,
            7544929,
            7544932,
            7544933,
            7544940,
            7544944,
            7610468,
            7628064,
            7629167,
            7693600,
            7696928
          ]),
          new NGramsPlusLang("it", [
            2122092,
            2122600,
            2122607,
            2122853,
            2122857,
            2123040,
            2124140,
            2124142,
            2124897,
            2125925,
            2125938,
            2127214,
            6365283,
            6365284,
            6365296,
            6365299,
            6386799,
            6514789,
            6516590,
            6579564,
            6580512,
            6627425,
            6627427,
            6627428,
            6627433,
            6627436,
            6627440,
            6627443,
            6646816,
            6646892,
            6647412,
            6648352,
            6841632,
            6889569,
            6889571,
            6889572,
            6889587,
            6906144,
            6908960,
            6909472,
            6909806,
            7102752,
            7103776,
            7104800,
            7105633,
            7234848,
            7235872,
            7237408,
            7238757,
            7282785,
            7282788,
            7282793,
            7282803,
            7302688,
            7302757,
            7366002,
            7495968,
            7496992,
            7563552,
            7627040,
            7628064,
            7629088,
            7630624,
            8022383
          ]),
          new NGramsPlusLang("nl", [
            2122092,
            2122341,
            2122849,
            2122853,
            2122857,
            2123109,
            2123118,
            2123621,
            2123877,
            2124142,
            2125153,
            2125157,
            2125680,
            2126949,
            2127457,
            2127461,
            2127471,
            2127717,
            2128489,
            6381934,
            6381938,
            6385184,
            6385252,
            6386208,
            6386720,
            6514804,
            6579488,
            6579566,
            6579570,
            6627426,
            6627446,
            6645102,
            6645106,
            6647328,
            6648352,
            6648435,
            6648864,
            6776174,
            6841716,
            6907168,
            6909472,
            6909543,
            6910752,
            7217250,
            7217252,
            7217253,
            7217256,
            7217263,
            7217270,
            7234661,
            7235360,
            7302756,
            7303026,
            7303200,
            7303712,
            7562088,
            7566437,
            7610468,
            7628064,
            7628142,
            7628146,
            7758190,
            7759218,
            7761775
          ]),
          new NGramsPlusLang("no", [
            2122100,
            2122102,
            2122853,
            2123118,
            2123122,
            2123375,
            2123873,
            2124064,
            2125157,
            2125671,
            2126053,
            2126693,
            2126699,
            2126703,
            2126708,
            2126953,
            2127465,
            2155808,
            6385252,
            6386208,
            6386720,
            6579488,
            6579566,
            6579572,
            6627443,
            6644768,
            6647328,
            6647397,
            6648352,
            6648421,
            6648864,
            6648948,
            6713202,
            6776174,
            6908779,
            6908960,
            6909543,
            7038240,
            7039845,
            7103776,
            7105637,
            7169380,
            7169390,
            7217267,
            7234848,
            7235360,
            7235429,
            7237221,
            7300896,
            7302432,
            7303712,
            7398688,
            7479411,
            7496992,
            7565165,
            7566437,
            7610483,
            7628064,
            7628142,
            7628146,
            7629164,
            7631904,
            7631973,
            7759218
          ]),
          new NGramsPlusLang("pt", [
            2122016,
            2122607,
            2122849,
            2122853,
            2122863,
            2123040,
            2123123,
            2125153,
            2125423,
            2125600,
            2125921,
            2125935,
            2125938,
            2126197,
            2126437,
            2126693,
            2127213,
            6365281,
            6365283,
            6365284,
            6365296,
            6382693,
            6382703,
            6384672,
            6386208,
            6386273,
            6386464,
            6516589,
            6516590,
            6578464,
            6579488,
            6582048,
            6582131,
            6627425,
            6627428,
            6647072,
            6647412,
            6648608,
            6648692,
            6906144,
            6906721,
            7169390,
            7238757,
            7238767,
            7282785,
            7282787,
            7282788,
            7282789,
            7282800,
            7303968,
            7364978,
            7435621,
            7495968,
            7497075,
            7544929,
            7544932,
            7544933,
            7544944,
            7566433,
            7628064,
            7630624,
            7693600,
            14905120,
            15197039
          ]),
          new NGramsPlusLang("sv", [
            2122100,
            2122102,
            2122853,
            2123118,
            2123510,
            2123873,
            2124064,
            2124142,
            2124655,
            2125157,
            2125667,
            2126053,
            2126699,
            2126703,
            2126708,
            2126953,
            2127457,
            2127465,
            2155634,
            6382693,
            6385184,
            6385252,
            6386208,
            6386804,
            6514720,
            6579488,
            6579566,
            6579570,
            6579572,
            6644768,
            6647328,
            6648352,
            6648864,
            6747762,
            6776174,
            6909036,
            6909543,
            7037216,
            7105568,
            7169380,
            7217267,
            7233824,
            7234661,
            7235360,
            7235429,
            7235950,
            7299944,
            7302432,
            7302688,
            7398688,
            7479393,
            7479411,
            7495968,
            7564129,
            7565165,
            7610483,
            7627040,
            7628064,
            7628146,
            7629164,
            7631904,
            7758194,
            14971424,
            16151072
          ])
        ];
      };
      this.name = function(det) {
        return det && det.fC1Bytes ? "windows-1252" : "ISO-8859-1";
      };
    };
    util.inherits(module2.exports.ISO_8859_1, sbcs2);
    module2.exports.ISO_8859_2 = function() {
      this.byteMap = function() {
        return [
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          0,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          97,
          98,
          99,
          100,
          101,
          102,
          103,
          104,
          105,
          106,
          107,
          108,
          109,
          110,
          111,
          112,
          113,
          114,
          115,
          116,
          117,
          118,
          119,
          120,
          121,
          122,
          32,
          32,
          32,
          32,
          32,
          32,
          97,
          98,
          99,
          100,
          101,
          102,
          103,
          104,
          105,
          106,
          107,
          108,
          109,
          110,
          111,
          112,
          113,
          114,
          115,
          116,
          117,
          118,
          119,
          120,
          121,
          122,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          177,
          32,
          179,
          32,
          181,
          182,
          32,
          32,
          185,
          186,
          187,
          188,
          32,
          190,
          191,
          32,
          177,
          32,
          179,
          32,
          181,
          182,
          183,
          32,
          185,
          186,
          187,
          188,
          32,
          190,
          191,
          224,
          225,
          226,
          227,
          228,
          229,
          230,
          231,
          232,
          233,
          234,
          235,
          236,
          237,
          238,
          239,
          240,
          241,
          242,
          243,
          244,
          245,
          246,
          32,
          248,
          249,
          250,
          251,
          252,
          253,
          254,
          223,
          224,
          225,
          226,
          227,
          228,
          229,
          230,
          231,
          232,
          233,
          234,
          235,
          236,
          237,
          238,
          239,
          240,
          241,
          242,
          243,
          244,
          245,
          246,
          32,
          248,
          249,
          250,
          251,
          252,
          253,
          254,
          32
        ];
      };
      this.ngrams = function() {
        return [
          new NGramsPlusLang("cs", [
            2122016,
            2122361,
            2122863,
            2124389,
            2125409,
            2125413,
            2125600,
            2125668,
            2125935,
            2125938,
            2126072,
            2126447,
            2126693,
            2126703,
            2126708,
            2126959,
            2127392,
            2127481,
            2128481,
            6365296,
            6513952,
            6514720,
            6627440,
            6627443,
            6627446,
            6647072,
            6647533,
            6844192,
            6844260,
            6910836,
            6972704,
            7042149,
            7103776,
            7104800,
            7233824,
            7268640,
            7269408,
            7269664,
            7282800,
            7300206,
            7301737,
            7304052,
            7304480,
            7304801,
            7368548,
            7368554,
            7369327,
            7403621,
            7562528,
            7565173,
            7566433,
            7566441,
            7566446,
            7628146,
            7630573,
            7630624,
            7676016,
            12477728,
            14773997,
            15296623,
            15540336,
            15540339,
            15559968,
            16278884
          ]),
          new NGramsPlusLang("hu", [
            2122016,
            2122106,
            2122341,
            2123111,
            2123116,
            2123365,
            2123873,
            2123887,
            2124147,
            2124645,
            2124649,
            2124790,
            2124901,
            2125153,
            2125157,
            2125161,
            2125413,
            2126714,
            2126949,
            2156915,
            6365281,
            6365291,
            6365293,
            6365299,
            6384416,
            6385184,
            6388256,
            6447470,
            6448494,
            6645625,
            6646560,
            6646816,
            6646885,
            6647072,
            6647328,
            6648421,
            6648864,
            6648933,
            6648948,
            6781216,
            6844263,
            6909556,
            6910752,
            7020641,
            7075450,
            7169383,
            7170414,
            7217249,
            7233899,
            7234923,
            7234925,
            7238688,
            7300985,
            7544929,
            7567973,
            7567988,
            7568097,
            7596391,
            7610465,
            7631904,
            7659891,
            8021362,
            14773792,
            15299360
          ]),
          new NGramsPlusLang("pl", [
            2122618,
            2122863,
            2124064,
            2124389,
            2124655,
            2125153,
            2125161,
            2125409,
            2125417,
            2125668,
            2125935,
            2125938,
            2126697,
            2127648,
            2127721,
            2127737,
            2128416,
            2128481,
            6365296,
            6365303,
            6385257,
            6514720,
            6519397,
            6519417,
            6582048,
            6584937,
            6627440,
            6627443,
            6627447,
            6627450,
            6645615,
            6646304,
            6647072,
            6647401,
            6778656,
            6906144,
            6907168,
            6907242,
            7037216,
            7039264,
            7039333,
            7170405,
            7233824,
            7235937,
            7235941,
            7282800,
            7305057,
            7305065,
            7368556,
            7369313,
            7369327,
            7369338,
            7502437,
            7502457,
            7563754,
            7564137,
            7566433,
            7825765,
            7955304,
            7957792,
            8021280,
            8022373,
            8026400,
            15955744
          ]),
          new NGramsPlusLang("ro", [
            2122016,
            2122083,
            2122593,
            2122597,
            2122607,
            2122613,
            2122853,
            2122857,
            2124897,
            2125153,
            2125925,
            2125938,
            2126693,
            2126819,
            2127214,
            2144873,
            2158190,
            6365283,
            6365284,
            6386277,
            6386720,
            6386789,
            6386976,
            6513010,
            6516590,
            6518048,
            6546208,
            6579488,
            6627425,
            6627427,
            6627428,
            6627440,
            6627443,
            6644e3,
            6646048,
            6646885,
            6647412,
            6648692,
            6889569,
            6889571,
            6889572,
            6889584,
            6907168,
            6908192,
            6909472,
            7102752,
            7103776,
            7106418,
            7107945,
            7234848,
            7238770,
            7303712,
            7365998,
            7496992,
            7497057,
            7501088,
            7594784,
            7628064,
            7631477,
            7660320,
            7694624,
            7695392,
            12216608,
            15625760
          ])
        ];
      };
      this.name = function(det) {
        return det && det.fC1Bytes ? "windows-1250" : "ISO-8859-2";
      };
    };
    util.inherits(module2.exports.ISO_8859_2, sbcs2);
    module2.exports.ISO_8859_5 = function() {
      this.byteMap = function() {
        return [
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          0,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          97,
          98,
          99,
          100,
          101,
          102,
          103,
          104,
          105,
          106,
          107,
          108,
          109,
          110,
          111,
          112,
          113,
          114,
          115,
          116,
          117,
          118,
          119,
          120,
          121,
          122,
          32,
          32,
          32,
          32,
          32,
          32,
          97,
          98,
          99,
          100,
          101,
          102,
          103,
          104,
          105,
          106,
          107,
          108,
          109,
          110,
          111,
          112,
          113,
          114,
          115,
          116,
          117,
          118,
          119,
          120,
          121,
          122,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          241,
          242,
          243,
          244,
          245,
          246,
          247,
          248,
          249,
          250,
          251,
          252,
          32,
          254,
          255,
          208,
          209,
          210,
          211,
          212,
          213,
          214,
          215,
          216,
          217,
          218,
          219,
          220,
          221,
          222,
          223,
          224,
          225,
          226,
          227,
          228,
          229,
          230,
          231,
          232,
          233,
          234,
          235,
          236,
          237,
          238,
          239,
          208,
          209,
          210,
          211,
          212,
          213,
          214,
          215,
          216,
          217,
          218,
          219,
          220,
          221,
          222,
          223,
          224,
          225,
          226,
          227,
          228,
          229,
          230,
          231,
          232,
          233,
          234,
          235,
          236,
          237,
          238,
          239,
          32,
          241,
          242,
          243,
          244,
          245,
          246,
          247,
          248,
          249,
          250,
          251,
          252,
          32,
          254,
          255
        ];
      };
      this.ngrams = function() {
        return [
          2150944,
          2151134,
          2151646,
          2152400,
          2152480,
          2153168,
          2153182,
          2153936,
          2153941,
          2154193,
          2154462,
          2154464,
          2154704,
          2154974,
          2154978,
          2155230,
          2156514,
          2158050,
          13688280,
          13689580,
          13884960,
          14015468,
          14015960,
          14016994,
          14017056,
          14164191,
          14210336,
          14211104,
          14216992,
          14407133,
          14407712,
          14413021,
          14536736,
          14538016,
          14538965,
          14538991,
          14540320,
          14540498,
          14557394,
          14557407,
          14557409,
          14602784,
          14602960,
          14603230,
          14604576,
          14605292,
          14605344,
          14606818,
          14671579,
          14672085,
          14672088,
          14672094,
          14733522,
          14734804,
          14803664,
          14803666,
          14803672,
          14806816,
          14865883,
          14868e3,
          14868192,
          14871584,
          15196894,
          15459616
        ];
      };
      this.name = function(det) {
        return "ISO-8859-5";
      };
      this.language = function() {
        return "ru";
      };
    };
    util.inherits(module2.exports.ISO_8859_5, sbcs2);
    module2.exports.ISO_8859_6 = function() {
      this.byteMap = function() {
        return [
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          0,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          97,
          98,
          99,
          100,
          101,
          102,
          103,
          104,
          105,
          106,
          107,
          108,
          109,
          110,
          111,
          112,
          113,
          114,
          115,
          116,
          117,
          118,
          119,
          120,
          121,
          122,
          32,
          32,
          32,
          32,
          32,
          32,
          97,
          98,
          99,
          100,
          101,
          102,
          103,
          104,
          105,
          106,
          107,
          108,
          109,
          110,
          111,
          112,
          113,
          114,
          115,
          116,
          117,
          118,
          119,
          120,
          121,
          122,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          193,
          194,
          195,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          210,
          211,
          212,
          213,
          214,
          215,
          216,
          217,
          218,
          32,
          32,
          32,
          32,
          32,
          224,
          225,
          226,
          227,
          228,
          229,
          230,
          231,
          232,
          233,
          234,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32
        ];
      };
      this.ngrams = function() {
        return [
          2148324,
          2148326,
          2148551,
          2152932,
          2154986,
          2155748,
          2156006,
          2156743,
          13050055,
          13091104,
          13093408,
          13095200,
          13100064,
          13100227,
          13100231,
          13100232,
          13100234,
          13100236,
          13100237,
          13100239,
          13100243,
          13100249,
          13100258,
          13100261,
          13100264,
          13100266,
          13100320,
          13100576,
          13100746,
          13115591,
          13181127,
          13181153,
          13181156,
          13181157,
          13181160,
          13246663,
          13574343,
          13617440,
          13705415,
          13748512,
          13836487,
          14229703,
          14279913,
          14805536,
          14950599,
          14993696,
          15001888,
          15002144,
          15016135,
          15058720,
          15059232,
          15066656,
          15081671,
          15147207,
          15189792,
          15255524,
          15263264,
          15278279,
          15343815,
          15343845,
          15343848,
          15386912,
          15388960,
          15394336
        ];
      };
      this.name = function(det) {
        return "ISO-8859-6";
      };
      this.language = function() {
        return "ar";
      };
    };
    util.inherits(module2.exports.ISO_8859_6, sbcs2);
    module2.exports.ISO_8859_7 = function() {
      this.byteMap = function() {
        return [
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          0,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          97,
          98,
          99,
          100,
          101,
          102,
          103,
          104,
          105,
          106,
          107,
          108,
          109,
          110,
          111,
          112,
          113,
          114,
          115,
          116,
          117,
          118,
          119,
          120,
          121,
          122,
          32,
          32,
          32,
          32,
          32,
          32,
          97,
          98,
          99,
          100,
          101,
          102,
          103,
          104,
          105,
          106,
          107,
          108,
          109,
          110,
          111,
          112,
          113,
          114,
          115,
          116,
          117,
          118,
          119,
          120,
          121,
          122,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          161,
          162,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          220,
          32,
          221,
          222,
          223,
          32,
          252,
          32,
          253,
          254,
          192,
          225,
          226,
          227,
          228,
          229,
          230,
          231,
          232,
          233,
          234,
          235,
          236,
          237,
          238,
          239,
          240,
          241,
          32,
          243,
          244,
          245,
          246,
          247,
          248,
          249,
          250,
          251,
          220,
          221,
          222,
          223,
          224,
          225,
          226,
          227,
          228,
          229,
          230,
          231,
          232,
          233,
          234,
          235,
          236,
          237,
          238,
          239,
          240,
          241,
          242,
          243,
          244,
          245,
          246,
          247,
          248,
          249,
          250,
          251,
          252,
          253,
          254,
          32
        ];
      };
      this.ngrams = function() {
        return [
          2154989,
          2154992,
          2155497,
          2155753,
          2156016,
          2156320,
          2157281,
          2157797,
          2158049,
          2158368,
          2158817,
          2158831,
          2158833,
          2159604,
          2159605,
          2159847,
          2159855,
          14672160,
          14754017,
          14754036,
          14805280,
          14806304,
          14807292,
          14807584,
          14936545,
          15067424,
          15069728,
          15147252,
          15199520,
          15200800,
          15278324,
          15327520,
          15330014,
          15331872,
          15393257,
          15393268,
          15525152,
          15540449,
          15540453,
          15540464,
          15589664,
          15725088,
          15725856,
          15790069,
          15790575,
          15793184,
          15868129,
          15868133,
          15868138,
          15868144,
          15868148,
          15983904,
          15984416,
          15987951,
          16048416,
          16048617,
          16050157,
          16050162,
          16050666,
          16052e3,
          16052213,
          16054765,
          16379168,
          16706848
        ];
      };
      this.name = function(det) {
        return det && det.fC1Bytes ? "windows-1253" : "ISO-8859-7";
      };
      this.language = function() {
        return "el";
      };
    };
    util.inherits(module2.exports.ISO_8859_7, sbcs2);
    module2.exports.ISO_8859_8 = function() {
      this.byteMap = function() {
        return [
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          0,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          97,
          98,
          99,
          100,
          101,
          102,
          103,
          104,
          105,
          106,
          107,
          108,
          109,
          110,
          111,
          112,
          113,
          114,
          115,
          116,
          117,
          118,
          119,
          120,
          121,
          122,
          32,
          32,
          32,
          32,
          32,
          32,
          97,
          98,
          99,
          100,
          101,
          102,
          103,
          104,
          105,
          106,
          107,
          108,
          109,
          110,
          111,
          112,
          113,
          114,
          115,
          116,
          117,
          118,
          119,
          120,
          121,
          122,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          181,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          224,
          225,
          226,
          227,
          228,
          229,
          230,
          231,
          232,
          233,
          234,
          235,
          236,
          237,
          238,
          239,
          240,
          241,
          242,
          243,
          244,
          245,
          246,
          247,
          248,
          249,
          250,
          32,
          32,
          32,
          32,
          32
        ];
      };
      this.ngrams = function() {
        return [
          new NGramsPlusLang("he", [
            2154725,
            2154727,
            2154729,
            2154746,
            2154985,
            2154990,
            2155744,
            2155749,
            2155753,
            2155758,
            2155762,
            2155769,
            2155770,
            2157792,
            2157796,
            2158304,
            2159340,
            2161132,
            14744096,
            14950624,
            14950625,
            14950628,
            14950636,
            14950638,
            14950649,
            15001056,
            15065120,
            15068448,
            15068960,
            15071264,
            15071776,
            15278308,
            15328288,
            15328762,
            15329773,
            15330592,
            15331104,
            15333408,
            15333920,
            15474912,
            15474916,
            15523872,
            15524896,
            15540448,
            15540449,
            15540452,
            15540460,
            15540462,
            15540473,
            15655968,
            15671524,
            15787040,
            15788320,
            15788525,
            15920160,
            16261348,
            16312813,
            16378912,
            16392416,
            16392417,
            16392420,
            16392428,
            16392430,
            16392441
          ]),
          new NGramsPlusLang("he", [
            2154725,
            2154732,
            2155753,
            2155756,
            2155758,
            2155760,
            2157040,
            2157810,
            2157817,
            2158053,
            2158057,
            2158565,
            2158569,
            2160869,
            2160873,
            2161376,
            2161381,
            2161385,
            14688484,
            14688492,
            14688493,
            14688506,
            14738464,
            14738916,
            14740512,
            14741024,
            14754020,
            14754029,
            14754042,
            14950628,
            14950633,
            14950636,
            14950637,
            14950639,
            14950648,
            14950650,
            15002656,
            15065120,
            15066144,
            15196192,
            15327264,
            15327520,
            15328288,
            15474916,
            15474925,
            15474938,
            15528480,
            15530272,
            15591913,
            15591920,
            15591928,
            15605988,
            15605997,
            15606010,
            15655200,
            15655968,
            15918112,
            16326884,
            16326893,
            16326906,
            16376864,
            16441376,
            16442400,
            16442857
          ])
        ];
      };
      this.name = function(det) {
        return det && det.fC1Bytes ? "windows-1255" : "ISO-8859-8";
      };
      this.language = function() {
        return "he";
      };
    };
    util.inherits(module2.exports.ISO_8859_8, sbcs2);
    module2.exports.ISO_8859_9 = function() {
      this.byteMap = function() {
        return [
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          0,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          97,
          98,
          99,
          100,
          101,
          102,
          103,
          104,
          105,
          106,
          107,
          108,
          109,
          110,
          111,
          112,
          113,
          114,
          115,
          116,
          117,
          118,
          119,
          120,
          121,
          122,
          32,
          32,
          32,
          32,
          32,
          32,
          97,
          98,
          99,
          100,
          101,
          102,
          103,
          104,
          105,
          106,
          107,
          108,
          109,
          110,
          111,
          112,
          113,
          114,
          115,
          116,
          117,
          118,
          119,
          120,
          121,
          122,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          170,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          181,
          32,
          32,
          32,
          32,
          186,
          32,
          32,
          32,
          32,
          32,
          224,
          225,
          226,
          227,
          228,
          229,
          230,
          231,
          232,
          233,
          234,
          235,
          236,
          237,
          238,
          239,
          240,
          241,
          242,
          243,
          244,
          245,
          246,
          32,
          248,
          249,
          250,
          251,
          252,
          105,
          254,
          223,
          224,
          225,
          226,
          227,
          228,
          229,
          230,
          231,
          232,
          233,
          234,
          235,
          236,
          237,
          238,
          239,
          240,
          241,
          242,
          243,
          244,
          245,
          246,
          32,
          248,
          249,
          250,
          251,
          252,
          253,
          254,
          255
        ];
      };
      this.ngrams = function() {
        return [
          2122337,
          2122345,
          2122357,
          2122849,
          2122853,
          2123621,
          2123873,
          2124140,
          2124641,
          2124655,
          2125153,
          2125676,
          2126689,
          2126945,
          2127461,
          2128225,
          6365282,
          6384416,
          6384737,
          6384993,
          6385184,
          6385405,
          6386208,
          6386273,
          6386429,
          6386685,
          6388065,
          6449522,
          6578464,
          6579488,
          6580512,
          6627426,
          6627435,
          6644841,
          6647328,
          6648352,
          6648425,
          6648681,
          6909029,
          6909472,
          6909545,
          6910496,
          7102830,
          7102834,
          7103776,
          7103858,
          7217249,
          7217250,
          7217259,
          7234657,
          7234661,
          7234848,
          7235872,
          7235950,
          7273760,
          7498094,
          7535982,
          7759136,
          7954720,
          7958386,
          16608800,
          16608868,
          16609021,
          16642301
        ];
      };
      this.name = function(det) {
        return det && det.fC1Bytes ? "windows-1254" : "ISO-8859-9";
      };
      this.language = function() {
        return "tr";
      };
    };
    util.inherits(module2.exports.ISO_8859_9, sbcs2);
    module2.exports.windows_1251 = function() {
      this.byteMap = function() {
        return [
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          0,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          97,
          98,
          99,
          100,
          101,
          102,
          103,
          104,
          105,
          106,
          107,
          108,
          109,
          110,
          111,
          112,
          113,
          114,
          115,
          116,
          117,
          118,
          119,
          120,
          121,
          122,
          32,
          32,
          32,
          32,
          32,
          32,
          97,
          98,
          99,
          100,
          101,
          102,
          103,
          104,
          105,
          106,
          107,
          108,
          109,
          110,
          111,
          112,
          113,
          114,
          115,
          116,
          117,
          118,
          119,
          120,
          121,
          122,
          32,
          32,
          32,
          32,
          32,
          144,
          131,
          32,
          131,
          32,
          32,
          32,
          32,
          32,
          32,
          154,
          32,
          156,
          157,
          158,
          159,
          144,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          154,
          32,
          156,
          157,
          158,
          159,
          32,
          162,
          162,
          188,
          32,
          180,
          32,
          32,
          184,
          32,
          186,
          32,
          32,
          32,
          32,
          191,
          32,
          32,
          179,
          179,
          180,
          181,
          32,
          32,
          184,
          32,
          186,
          32,
          188,
          190,
          190,
          191,
          224,
          225,
          226,
          227,
          228,
          229,
          230,
          231,
          232,
          233,
          234,
          235,
          236,
          237,
          238,
          239,
          240,
          241,
          242,
          243,
          244,
          245,
          246,
          247,
          248,
          249,
          250,
          251,
          252,
          253,
          254,
          255,
          224,
          225,
          226,
          227,
          228,
          229,
          230,
          231,
          232,
          233,
          234,
          235,
          236,
          237,
          238,
          239,
          240,
          241,
          242,
          243,
          244,
          245,
          246,
          247,
          248,
          249,
          250,
          251,
          252,
          253,
          254,
          255
        ];
      };
      this.ngrams = function() {
        return [
          2155040,
          2155246,
          2155758,
          2156512,
          2156576,
          2157280,
          2157294,
          2158048,
          2158053,
          2158305,
          2158574,
          2158576,
          2158816,
          2159086,
          2159090,
          2159342,
          2160626,
          2162162,
          14740968,
          14742268,
          14937632,
          15068156,
          15068648,
          15069682,
          15069728,
          15212783,
          15263008,
          15263776,
          15269664,
          15459821,
          15460384,
          15465709,
          15589408,
          15590688,
          15591653,
          15591679,
          15592992,
          15593186,
          15605986,
          15605999,
          15606001,
          15655456,
          15655648,
          15655918,
          15657248,
          15657980,
          15658016,
          15659506,
          15724267,
          15724773,
          15724776,
          15724782,
          15786210,
          15787492,
          15856352,
          15856354,
          15856360,
          15859488,
          15918571,
          15920672,
          15920880,
          15924256,
          16249582,
          16512288
        ];
      };
      this.name = function(det) {
        return "windows-1251";
      };
      this.language = function() {
        return "ru";
      };
    };
    util.inherits(module2.exports.windows_1251, sbcs2);
    module2.exports.windows_1256 = function() {
      this.byteMap = function() {
        return [
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          0,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          97,
          98,
          99,
          100,
          101,
          102,
          103,
          104,
          105,
          106,
          107,
          108,
          109,
          110,
          111,
          112,
          113,
          114,
          115,
          116,
          117,
          118,
          119,
          120,
          121,
          122,
          32,
          32,
          32,
          32,
          32,
          32,
          97,
          98,
          99,
          100,
          101,
          102,
          103,
          104,
          105,
          106,
          107,
          108,
          109,
          110,
          111,
          112,
          113,
          114,
          115,
          116,
          117,
          118,
          119,
          120,
          121,
          122,
          32,
          32,
          32,
          32,
          32,
          32,
          129,
          32,
          131,
          32,
          32,
          32,
          32,
          136,
          32,
          138,
          32,
          156,
          141,
          142,
          143,
          144,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          152,
          32,
          154,
          32,
          156,
          32,
          32,
          159,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          170,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          181,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          192,
          193,
          194,
          195,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          210,
          211,
          212,
          213,
          214,
          32,
          216,
          217,
          218,
          219,
          220,
          221,
          222,
          223,
          224,
          225,
          226,
          227,
          228,
          229,
          230,
          231,
          232,
          233,
          234,
          235,
          236,
          237,
          238,
          239,
          32,
          32,
          32,
          32,
          244,
          32,
          32,
          32,
          32,
          249,
          32,
          251,
          252,
          32,
          32,
          255
        ];
      };
      this.ngrams = function() {
        return [
          2148321,
          2148324,
          2148551,
          2153185,
          2153965,
          2154977,
          2155492,
          2156231,
          13050055,
          13091104,
          13093408,
          13095200,
          13099296,
          13099459,
          13099463,
          13099464,
          13099466,
          13099468,
          13099469,
          13099471,
          13099475,
          13099482,
          13099486,
          13099491,
          13099494,
          13099501,
          13099808,
          13100064,
          13100234,
          13115591,
          13181127,
          13181149,
          13181153,
          13181155,
          13181158,
          13246663,
          13574343,
          13617440,
          13705415,
          13748512,
          13836487,
          14295239,
          14344684,
          14544160,
          14753991,
          14797088,
          14806048,
          14806304,
          14885063,
          14927648,
          14928160,
          14935072,
          14950599,
          15016135,
          15058720,
          15124449,
          15131680,
          15474887,
          15540423,
          15540451,
          15540454,
          15583520,
          15585568,
          15590432
        ];
      };
      this.name = function(det) {
        return "windows-1256";
      };
      this.language = function() {
        return "ar";
      };
    };
    util.inherits(module2.exports.windows_1256, sbcs2);
    module2.exports.KOI8_R = function() {
      this.byteMap = function() {
        return [
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          0,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          97,
          98,
          99,
          100,
          101,
          102,
          103,
          104,
          105,
          106,
          107,
          108,
          109,
          110,
          111,
          112,
          113,
          114,
          115,
          116,
          117,
          118,
          119,
          120,
          121,
          122,
          32,
          32,
          32,
          32,
          32,
          32,
          97,
          98,
          99,
          100,
          101,
          102,
          103,
          104,
          105,
          106,
          107,
          108,
          109,
          110,
          111,
          112,
          113,
          114,
          115,
          116,
          117,
          118,
          119,
          120,
          121,
          122,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          163,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          163,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          32,
          192,
          193,
          194,
          195,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          210,
          211,
          212,
          213,
          214,
          215,
          216,
          217,
          218,
          219,
          220,
          221,
          222,
          223,
          192,
          193,
          194,
          195,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          210,
          211,
          212,
          213,
          214,
          215,
          216,
          217,
          218,
          219,
          220,
          221,
          222,
          223
        ];
      };
      this.ngrams = function() {
        return [
          2147535,
          2148640,
          2149313,
          2149327,
          2150081,
          2150085,
          2150338,
          2150607,
          2150610,
          2151105,
          2151375,
          2151380,
          2151631,
          2152224,
          2152399,
          2153153,
          2153684,
          2154196,
          12701385,
          12702936,
          12963032,
          12963529,
          12964820,
          12964896,
          13094688,
          13181136,
          13223200,
          13224224,
          13226272,
          13419982,
          13420832,
          13424846,
          13549856,
          13550880,
          13552069,
          13552081,
          13553440,
          13553623,
          13574352,
          13574355,
          13574359,
          13617103,
          13617696,
          13618392,
          13618464,
          13620180,
          13621024,
          13621185,
          13684684,
          13685445,
          13685449,
          13685455,
          13812183,
          13813188,
          13881632,
          13882561,
          13882569,
          13882583,
          13944268,
          13946656,
          13946834,
          13948960,
          14272544,
          14603471
        ];
      };
      this.name = function(det) {
        return "KOI8-R";
      };
      this.language = function() {
        return "ru";
      };
    };
    util.inherits(module2.exports.KOI8_R, sbcs2);
  })(sbcs);
  return sbcs.exports;
}
var iso2022 = { exports: {} };
var hasRequiredIso2022;
function requireIso2022() {
  if (hasRequiredIso2022) return iso2022.exports;
  hasRequiredIso2022 = 1;
  (function(module2) {
    var util = require$$0$4, Match = requireMatch();
    function ISO_2022() {
    }
    ISO_2022.prototype.match = function(det) {
      var i, j;
      var escN;
      var hits = 0;
      var misses = 0;
      var shifts = 0;
      var quality;
      var text = det.fInputBytes;
      var textLen = det.fInputLen;
      scanInput:
        for (i = 0; i < textLen; i++) {
          if (text[i] == 27) {
            checkEscapes:
              for (escN = 0; escN < this.escapeSequences.length; escN++) {
                var seq = this.escapeSequences[escN];
                if (textLen - i < seq.length)
                  continue checkEscapes;
                for (j = 1; j < seq.length; j++)
                  if (seq[j] != text[i + j])
                    continue checkEscapes;
                hits++;
                i += seq.length - 1;
                continue scanInput;
              }
            misses++;
          }
          if (text[i] == 14 || text[i] == 15)
            shifts++;
        }
      if (hits == 0)
        return null;
      quality = (100 * hits - 100 * misses) / (hits + misses);
      if (hits + shifts < 5)
        quality -= (5 - (hits + shifts)) * 10;
      return quality <= 0 ? null : new Match(det, this, quality);
    };
    module2.exports.ISO_2022_JP = function() {
      this.name = function() {
        return "ISO-2022-JP";
      };
      this.escapeSequences = [
        [27, 36, 40, 67],
        // KS X 1001:1992
        [27, 36, 40, 68],
        // JIS X 212-1990
        [27, 36, 64],
        // JIS C 6226-1978
        [27, 36, 65],
        // GB 2312-80
        [27, 36, 66],
        // JIS X 208-1983
        [27, 38, 64],
        // JIS X 208 1990, 1997
        [27, 40, 66],
        // ASCII
        [27, 40, 72],
        // JIS-Roman
        [27, 40, 73],
        // Half-width katakana
        [27, 40, 74],
        // JIS-Roman
        [27, 46, 65],
        // ISO 8859-1
        [27, 46, 70]
        // ISO 8859-7
      ];
    };
    util.inherits(module2.exports.ISO_2022_JP, ISO_2022);
    module2.exports.ISO_2022_KR = function() {
      this.name = function() {
        return "ISO-2022-KR";
      };
      this.escapeSequences = [
        [27, 36, 41, 67]
      ];
    };
    util.inherits(module2.exports.ISO_2022_KR, ISO_2022);
    module2.exports.ISO_2022_CN = function() {
      this.name = function() {
        return "ISO-2022-CN";
      };
      this.escapeSequences = [
        [27, 36, 41, 65],
        // GB 2312-80
        [27, 36, 41, 71],
        // CNS 11643-1992 Plane 1
        [27, 36, 42, 72],
        // CNS 11643-1992 Plane 2
        [27, 36, 41, 69],
        // ISO-IR-165
        [27, 36, 43, 73],
        // CNS 11643-1992 Plane 3
        [27, 36, 43, 74],
        // CNS 11643-1992 Plane 4
        [27, 36, 43, 75],
        // CNS 11643-1992 Plane 5
        [27, 36, 43, 76],
        // CNS 11643-1992 Plane 6
        [27, 36, 43, 77],
        // CNS 11643-1992 Plane 7
        [27, 78],
        // SS2
        [27, 79]
        // SS3
      ];
    };
    util.inherits(module2.exports.ISO_2022_CN, ISO_2022);
  })(iso2022);
  return iso2022.exports;
}
var hasRequiredChardet;
function requireChardet() {
  if (hasRequiredChardet) return chardet;
  hasRequiredChardet = 1;
  var fs$1 = fs;
  var utf82 = requireUtf8(), unicode2 = requireUnicode(), mbcs2 = requireMbcs(), sbcs2 = requireSbcs(), iso20222 = requireIso2022();
  var self = chardet;
  var recognisers = [
    new utf82(),
    new unicode2.UTF_16BE(),
    new unicode2.UTF_16LE(),
    new unicode2.UTF_32BE(),
    new unicode2.UTF_32LE(),
    new mbcs2.sjis(),
    new mbcs2.big5(),
    new mbcs2.euc_jp(),
    new mbcs2.euc_kr(),
    new mbcs2.gb_18030(),
    new iso20222.ISO_2022_JP(),
    new iso20222.ISO_2022_KR(),
    new iso20222.ISO_2022_CN(),
    new sbcs2.ISO_8859_1(),
    new sbcs2.ISO_8859_2(),
    new sbcs2.ISO_8859_5(),
    new sbcs2.ISO_8859_6(),
    new sbcs2.ISO_8859_7(),
    new sbcs2.ISO_8859_8(),
    new sbcs2.ISO_8859_9(),
    new sbcs2.windows_1251(),
    new sbcs2.windows_1256(),
    new sbcs2.KOI8_R()
  ];
  chardet.detect = function(buffer2, opts) {
    var fByteStats = [];
    for (var i = 0; i < 256; i++)
      fByteStats[i] = 0;
    for (var i = buffer2.length - 1; i >= 0; i--)
      fByteStats[buffer2[i] & 255]++;
    var fC1Bytes = false;
    for (var i = 128; i <= 159; i += 1) {
      if (fByteStats[i] != 0) {
        fC1Bytes = true;
        break;
      }
    }
    var context = {
      fByteStats,
      fC1Bytes,
      fRawInput: buffer2,
      fRawLength: buffer2.length,
      fInputBytes: buffer2,
      fInputLen: buffer2.length
    };
    var matches = recognisers.map(function(rec) {
      return rec.match(context);
    }).filter(function(match2) {
      return !!match2;
    }).sort(function(a, b) {
      return b.confidence - a.confidence;
    });
    if (opts && opts.returnAllMatches === true) {
      return matches;
    } else {
      return matches.length > 0 ? matches[0].name : null;
    }
  };
  chardet.detectFile = function(filepath, opts, cb) {
    if (typeof opts === "function") {
      cb = opts;
      opts = void 0;
    }
    var fd;
    var handler = function(err, buffer2) {
      if (fd) {
        fs$1.closeSync(fd);
      }
      if (err) return cb(err, null);
      cb(null, self.detect(buffer2, opts));
    };
    if (opts && opts.sampleSize) {
      fd = fs$1.openSync(filepath, "r"), sample = Buffer.allocUnsafe(opts.sampleSize);
      fs$1.read(fd, sample, 0, opts.sampleSize, null, function(err) {
        handler(err, sample);
      });
      return;
    }
    fs$1.readFile(filepath, handler);
  };
  chardet.detectFileSync = function(filepath, opts) {
    if (opts && opts.sampleSize) {
      var fd = fs$1.openSync(filepath, "r"), sample2 = Buffer.allocUnsafe(opts.sampleSize);
      fs$1.readSync(fd, sample2, 0, opts.sampleSize);
      fs$1.closeSync(fd);
      return self.detect(sample2, opts);
    }
    return self.detect(fs$1.readFileSync(filepath), opts);
  };
  chardet.detectAll = function(buffer2, opts) {
    if (typeof opts !== "object") {
      opts = {};
    }
    opts.returnAllMatches = true;
    return self.detect(buffer2, opts);
  };
  chardet.detectFileAll = function(filepath, opts, cb) {
    if (typeof opts === "function") {
      cb = opts;
      opts = void 0;
    }
    if (typeof opts !== "object") {
      opts = {};
    }
    opts.returnAllMatches = true;
    self.detectFile(filepath, opts, cb);
  };
  chardet.detectFileAllSync = function(filepath, opts) {
    if (typeof opts !== "object") {
      opts = {};
    }
    opts.returnAllMatches = true;
    return self.detectFileSync(filepath, opts);
  };
  return chardet;
}
var lib = { exports: {} };
var safer_1;
var hasRequiredSafer;
function requireSafer() {
  if (hasRequiredSafer) return safer_1;
  hasRequiredSafer = 1;
  var buffer2 = require$$0$5;
  var Buffer2 = buffer2.Buffer;
  var safer = {};
  var key;
  for (key in buffer2) {
    if (!buffer2.hasOwnProperty(key)) continue;
    if (key === "SlowBuffer" || key === "Buffer") continue;
    safer[key] = buffer2[key];
  }
  var Safer = safer.Buffer = {};
  for (key in Buffer2) {
    if (!Buffer2.hasOwnProperty(key)) continue;
    if (key === "allocUnsafe" || key === "allocUnsafeSlow") continue;
    Safer[key] = Buffer2[key];
  }
  safer.Buffer.prototype = Buffer2.prototype;
  if (!Safer.from || Safer.from === Uint8Array.from) {
    Safer.from = function(value, encodingOrOffset, length) {
      if (typeof value === "number") {
        throw new TypeError('The "value" argument must not be of type number. Received type ' + typeof value);
      }
      if (value && typeof value.length === "undefined") {
        throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
      }
      return Buffer2(value, encodingOrOffset, length);
    };
  }
  if (!Safer.alloc) {
    Safer.alloc = function(size, fill, encoding) {
      if (typeof size !== "number") {
        throw new TypeError('The "size" argument must be of type number. Received type ' + typeof size);
      }
      if (size < 0 || size >= 2 * (1 << 30)) {
        throw new RangeError('The value "' + size + '" is invalid for option "size"');
      }
      var buf = Buffer2(size);
      if (!fill || fill.length === 0) {
        buf.fill(0);
      } else if (typeof encoding === "string") {
        buf.fill(fill, encoding);
      } else {
        buf.fill(fill);
      }
      return buf;
    };
  }
  if (!safer.kStringMaxLength) {
    try {
      safer.kStringMaxLength = process.binding("buffer").kStringMaxLength;
    } catch (e) {
    }
  }
  if (!safer.constants) {
    safer.constants = {
      MAX_LENGTH: safer.kMaxLength
    };
    if (safer.kStringMaxLength) {
      safer.constants.MAX_STRING_LENGTH = safer.kStringMaxLength;
    }
  }
  safer_1 = safer;
  return safer_1;
}
var bomHandling = {};
var hasRequiredBomHandling;
function requireBomHandling() {
  if (hasRequiredBomHandling) return bomHandling;
  hasRequiredBomHandling = 1;
  var BOMChar = "\uFEFF";
  bomHandling.PrependBOM = PrependBOMWrapper;
  function PrependBOMWrapper(encoder, options) {
    this.encoder = encoder;
    this.addBOM = true;
  }
  PrependBOMWrapper.prototype.write = function(str) {
    if (this.addBOM) {
      str = BOMChar + str;
      this.addBOM = false;
    }
    return this.encoder.write(str);
  };
  PrependBOMWrapper.prototype.end = function() {
    return this.encoder.end();
  };
  bomHandling.StripBOM = StripBOMWrapper;
  function StripBOMWrapper(decoder, options) {
    this.decoder = decoder;
    this.pass = false;
    this.options = options || {};
  }
  StripBOMWrapper.prototype.write = function(buf) {
    var res = this.decoder.write(buf);
    if (this.pass || !res)
      return res;
    if (res[0] === BOMChar) {
      res = res.slice(1);
      if (typeof this.options.stripBOM === "function")
        this.options.stripBOM();
    }
    this.pass = true;
    return res;
  };
  StripBOMWrapper.prototype.end = function() {
    return this.decoder.end();
  };
  return bomHandling;
}
var encodings = {};
var internal;
var hasRequiredInternal;
function requireInternal() {
  if (hasRequiredInternal) return internal;
  hasRequiredInternal = 1;
  var Buffer2 = requireSafer().Buffer;
  internal = {
    // Encodings
    utf8: { type: "_internal", bomAware: true },
    cesu8: { type: "_internal", bomAware: true },
    unicode11utf8: "utf8",
    ucs2: { type: "_internal", bomAware: true },
    utf16le: "ucs2",
    binary: { type: "_internal" },
    base64: { type: "_internal" },
    hex: { type: "_internal" },
    // Codec.
    _internal: InternalCodec
  };
  function InternalCodec(codecOptions, iconv) {
    this.enc = codecOptions.encodingName;
    this.bomAware = codecOptions.bomAware;
    if (this.enc === "base64")
      this.encoder = InternalEncoderBase64;
    else if (this.enc === "cesu8") {
      this.enc = "utf8";
      this.encoder = InternalEncoderCesu8;
      if (Buffer2.from("eda0bdedb2a9", "hex").toString() !== "💩") {
        this.decoder = InternalDecoderCesu8;
        this.defaultCharUnicode = iconv.defaultCharUnicode;
      }
    }
  }
  InternalCodec.prototype.encoder = InternalEncoder;
  InternalCodec.prototype.decoder = InternalDecoder;
  var StringDecoder = require$$1$3.StringDecoder;
  if (!StringDecoder.prototype.end)
    StringDecoder.prototype.end = function() {
    };
  function InternalDecoder(options, codec) {
    StringDecoder.call(this, codec.enc);
  }
  InternalDecoder.prototype = StringDecoder.prototype;
  function InternalEncoder(options, codec) {
    this.enc = codec.enc;
  }
  InternalEncoder.prototype.write = function(str) {
    return Buffer2.from(str, this.enc);
  };
  InternalEncoder.prototype.end = function() {
  };
  function InternalEncoderBase64(options, codec) {
    this.prevStr = "";
  }
  InternalEncoderBase64.prototype.write = function(str) {
    str = this.prevStr + str;
    var completeQuads = str.length - str.length % 4;
    this.prevStr = str.slice(completeQuads);
    str = str.slice(0, completeQuads);
    return Buffer2.from(str, "base64");
  };
  InternalEncoderBase64.prototype.end = function() {
    return Buffer2.from(this.prevStr, "base64");
  };
  function InternalEncoderCesu8(options, codec) {
  }
  InternalEncoderCesu8.prototype.write = function(str) {
    var buf = Buffer2.alloc(str.length * 3), bufIdx = 0;
    for (var i = 0; i < str.length; i++) {
      var charCode = str.charCodeAt(i);
      if (charCode < 128)
        buf[bufIdx++] = charCode;
      else if (charCode < 2048) {
        buf[bufIdx++] = 192 + (charCode >>> 6);
        buf[bufIdx++] = 128 + (charCode & 63);
      } else {
        buf[bufIdx++] = 224 + (charCode >>> 12);
        buf[bufIdx++] = 128 + (charCode >>> 6 & 63);
        buf[bufIdx++] = 128 + (charCode & 63);
      }
    }
    return buf.slice(0, bufIdx);
  };
  InternalEncoderCesu8.prototype.end = function() {
  };
  function InternalDecoderCesu8(options, codec) {
    this.acc = 0;
    this.contBytes = 0;
    this.accBytes = 0;
    this.defaultCharUnicode = codec.defaultCharUnicode;
  }
  InternalDecoderCesu8.prototype.write = function(buf) {
    var acc = this.acc, contBytes = this.contBytes, accBytes = this.accBytes, res = "";
    for (var i = 0; i < buf.length; i++) {
      var curByte = buf[i];
      if ((curByte & 192) !== 128) {
        if (contBytes > 0) {
          res += this.defaultCharUnicode;
          contBytes = 0;
        }
        if (curByte < 128) {
          res += String.fromCharCode(curByte);
        } else if (curByte < 224) {
          acc = curByte & 31;
          contBytes = 1;
          accBytes = 1;
        } else if (curByte < 240) {
          acc = curByte & 15;
          contBytes = 2;
          accBytes = 1;
        } else {
          res += this.defaultCharUnicode;
        }
      } else {
        if (contBytes > 0) {
          acc = acc << 6 | curByte & 63;
          contBytes--;
          accBytes++;
          if (contBytes === 0) {
            if (accBytes === 2 && acc < 128 && acc > 0)
              res += this.defaultCharUnicode;
            else if (accBytes === 3 && acc < 2048)
              res += this.defaultCharUnicode;
            else
              res += String.fromCharCode(acc);
          }
        } else {
          res += this.defaultCharUnicode;
        }
      }
    }
    this.acc = acc;
    this.contBytes = contBytes;
    this.accBytes = accBytes;
    return res;
  };
  InternalDecoderCesu8.prototype.end = function() {
    var res = 0;
    if (this.contBytes > 0)
      res += this.defaultCharUnicode;
    return res;
  };
  return internal;
}
var utf16 = {};
var hasRequiredUtf16;
function requireUtf16() {
  if (hasRequiredUtf16) return utf16;
  hasRequiredUtf16 = 1;
  var Buffer2 = requireSafer().Buffer;
  utf16.utf16be = Utf16BECodec;
  function Utf16BECodec() {
  }
  Utf16BECodec.prototype.encoder = Utf16BEEncoder;
  Utf16BECodec.prototype.decoder = Utf16BEDecoder;
  Utf16BECodec.prototype.bomAware = true;
  function Utf16BEEncoder() {
  }
  Utf16BEEncoder.prototype.write = function(str) {
    var buf = Buffer2.from(str, "ucs2");
    for (var i = 0; i < buf.length; i += 2) {
      var tmp2 = buf[i];
      buf[i] = buf[i + 1];
      buf[i + 1] = tmp2;
    }
    return buf;
  };
  Utf16BEEncoder.prototype.end = function() {
  };
  function Utf16BEDecoder() {
    this.overflowByte = -1;
  }
  Utf16BEDecoder.prototype.write = function(buf) {
    if (buf.length == 0)
      return "";
    var buf2 = Buffer2.alloc(buf.length + 1), i = 0, j = 0;
    if (this.overflowByte !== -1) {
      buf2[0] = buf[0];
      buf2[1] = this.overflowByte;
      i = 1;
      j = 2;
    }
    for (; i < buf.length - 1; i += 2, j += 2) {
      buf2[j] = buf[i + 1];
      buf2[j + 1] = buf[i];
    }
    this.overflowByte = i == buf.length - 1 ? buf[buf.length - 1] : -1;
    return buf2.slice(0, j).toString("ucs2");
  };
  Utf16BEDecoder.prototype.end = function() {
  };
  utf16.utf16 = Utf16Codec;
  function Utf16Codec(codecOptions, iconv) {
    this.iconv = iconv;
  }
  Utf16Codec.prototype.encoder = Utf16Encoder;
  Utf16Codec.prototype.decoder = Utf16Decoder;
  function Utf16Encoder(options, codec) {
    options = options || {};
    if (options.addBOM === void 0)
      options.addBOM = true;
    this.encoder = codec.iconv.getEncoder("utf-16le", options);
  }
  Utf16Encoder.prototype.write = function(str) {
    return this.encoder.write(str);
  };
  Utf16Encoder.prototype.end = function() {
    return this.encoder.end();
  };
  function Utf16Decoder(options, codec) {
    this.decoder = null;
    this.initialBytes = [];
    this.initialBytesLen = 0;
    this.options = options || {};
    this.iconv = codec.iconv;
  }
  Utf16Decoder.prototype.write = function(buf) {
    if (!this.decoder) {
      this.initialBytes.push(buf);
      this.initialBytesLen += buf.length;
      if (this.initialBytesLen < 16)
        return "";
      var buf = Buffer2.concat(this.initialBytes), encoding = detectEncoding(buf, this.options.defaultEncoding);
      this.decoder = this.iconv.getDecoder(encoding, this.options);
      this.initialBytes.length = this.initialBytesLen = 0;
    }
    return this.decoder.write(buf);
  };
  Utf16Decoder.prototype.end = function() {
    if (!this.decoder) {
      var buf = Buffer2.concat(this.initialBytes), encoding = detectEncoding(buf, this.options.defaultEncoding);
      this.decoder = this.iconv.getDecoder(encoding, this.options);
      var res = this.decoder.write(buf), trail = this.decoder.end();
      return trail ? res + trail : res;
    }
    return this.decoder.end();
  };
  function detectEncoding(buf, defaultEncoding) {
    var enc = defaultEncoding || "utf-16le";
    if (buf.length >= 2) {
      if (buf[0] == 254 && buf[1] == 255)
        enc = "utf-16be";
      else if (buf[0] == 255 && buf[1] == 254)
        enc = "utf-16le";
      else {
        var asciiCharsLE = 0, asciiCharsBE = 0, _len = Math.min(buf.length - buf.length % 2, 64);
        for (var i = 0; i < _len; i += 2) {
          if (buf[i] === 0 && buf[i + 1] !== 0) asciiCharsBE++;
          if (buf[i] !== 0 && buf[i + 1] === 0) asciiCharsLE++;
        }
        if (asciiCharsBE > asciiCharsLE)
          enc = "utf-16be";
        else if (asciiCharsBE < asciiCharsLE)
          enc = "utf-16le";
      }
    }
    return enc;
  }
  return utf16;
}
var utf7 = {};
var hasRequiredUtf7;
function requireUtf7() {
  if (hasRequiredUtf7) return utf7;
  hasRequiredUtf7 = 1;
  var Buffer2 = requireSafer().Buffer;
  utf7.utf7 = Utf7Codec;
  utf7.unicode11utf7 = "utf7";
  function Utf7Codec(codecOptions, iconv) {
    this.iconv = iconv;
  }
  Utf7Codec.prototype.encoder = Utf7Encoder;
  Utf7Codec.prototype.decoder = Utf7Decoder;
  Utf7Codec.prototype.bomAware = true;
  var nonDirectChars = /[^A-Za-z0-9'\(\),-\.\/:\? \n\r\t]+/g;
  function Utf7Encoder(options, codec) {
    this.iconv = codec.iconv;
  }
  Utf7Encoder.prototype.write = function(str) {
    return Buffer2.from(str.replace(nonDirectChars, function(chunk) {
      return "+" + (chunk === "+" ? "" : this.iconv.encode(chunk, "utf16-be").toString("base64").replace(/=+$/, "")) + "-";
    }.bind(this)));
  };
  Utf7Encoder.prototype.end = function() {
  };
  function Utf7Decoder(options, codec) {
    this.iconv = codec.iconv;
    this.inBase64 = false;
    this.base64Accum = "";
  }
  var base64Regex = /[A-Za-z0-9\/+]/;
  var base64Chars = [];
  for (var i = 0; i < 256; i++)
    base64Chars[i] = base64Regex.test(String.fromCharCode(i));
  var plusChar = "+".charCodeAt(0), minusChar = "-".charCodeAt(0), andChar = "&".charCodeAt(0);
  Utf7Decoder.prototype.write = function(buf) {
    var res = "", lastI = 0, inBase64 = this.inBase64, base64Accum = this.base64Accum;
    for (var i2 = 0; i2 < buf.length; i2++) {
      if (!inBase64) {
        if (buf[i2] == plusChar) {
          res += this.iconv.decode(buf.slice(lastI, i2), "ascii");
          lastI = i2 + 1;
          inBase64 = true;
        }
      } else {
        if (!base64Chars[buf[i2]]) {
          if (i2 == lastI && buf[i2] == minusChar) {
            res += "+";
          } else {
            var b64str = base64Accum + buf.slice(lastI, i2).toString();
            res += this.iconv.decode(Buffer2.from(b64str, "base64"), "utf16-be");
          }
          if (buf[i2] != minusChar)
            i2--;
          lastI = i2 + 1;
          inBase64 = false;
          base64Accum = "";
        }
      }
    }
    if (!inBase64) {
      res += this.iconv.decode(buf.slice(lastI), "ascii");
    } else {
      var b64str = base64Accum + buf.slice(lastI).toString();
      var canBeDecoded = b64str.length - b64str.length % 8;
      base64Accum = b64str.slice(canBeDecoded);
      b64str = b64str.slice(0, canBeDecoded);
      res += this.iconv.decode(Buffer2.from(b64str, "base64"), "utf16-be");
    }
    this.inBase64 = inBase64;
    this.base64Accum = base64Accum;
    return res;
  };
  Utf7Decoder.prototype.end = function() {
    var res = "";
    if (this.inBase64 && this.base64Accum.length > 0)
      res = this.iconv.decode(Buffer2.from(this.base64Accum, "base64"), "utf16-be");
    this.inBase64 = false;
    this.base64Accum = "";
    return res;
  };
  utf7.utf7imap = Utf7IMAPCodec;
  function Utf7IMAPCodec(codecOptions, iconv) {
    this.iconv = iconv;
  }
  Utf7IMAPCodec.prototype.encoder = Utf7IMAPEncoder;
  Utf7IMAPCodec.prototype.decoder = Utf7IMAPDecoder;
  Utf7IMAPCodec.prototype.bomAware = true;
  function Utf7IMAPEncoder(options, codec) {
    this.iconv = codec.iconv;
    this.inBase64 = false;
    this.base64Accum = Buffer2.alloc(6);
    this.base64AccumIdx = 0;
  }
  Utf7IMAPEncoder.prototype.write = function(str) {
    var inBase64 = this.inBase64, base64Accum = this.base64Accum, base64AccumIdx = this.base64AccumIdx, buf = Buffer2.alloc(str.length * 5 + 10), bufIdx = 0;
    for (var i2 = 0; i2 < str.length; i2++) {
      var uChar = str.charCodeAt(i2);
      if (32 <= uChar && uChar <= 126) {
        if (inBase64) {
          if (base64AccumIdx > 0) {
            bufIdx += buf.write(base64Accum.slice(0, base64AccumIdx).toString("base64").replace(/\//g, ",").replace(/=+$/, ""), bufIdx);
            base64AccumIdx = 0;
          }
          buf[bufIdx++] = minusChar;
          inBase64 = false;
        }
        if (!inBase64) {
          buf[bufIdx++] = uChar;
          if (uChar === andChar)
            buf[bufIdx++] = minusChar;
        }
      } else {
        if (!inBase64) {
          buf[bufIdx++] = andChar;
          inBase64 = true;
        }
        if (inBase64) {
          base64Accum[base64AccumIdx++] = uChar >> 8;
          base64Accum[base64AccumIdx++] = uChar & 255;
          if (base64AccumIdx == base64Accum.length) {
            bufIdx += buf.write(base64Accum.toString("base64").replace(/\//g, ","), bufIdx);
            base64AccumIdx = 0;
          }
        }
      }
    }
    this.inBase64 = inBase64;
    this.base64AccumIdx = base64AccumIdx;
    return buf.slice(0, bufIdx);
  };
  Utf7IMAPEncoder.prototype.end = function() {
    var buf = Buffer2.alloc(10), bufIdx = 0;
    if (this.inBase64) {
      if (this.base64AccumIdx > 0) {
        bufIdx += buf.write(this.base64Accum.slice(0, this.base64AccumIdx).toString("base64").replace(/\//g, ",").replace(/=+$/, ""), bufIdx);
        this.base64AccumIdx = 0;
      }
      buf[bufIdx++] = minusChar;
      this.inBase64 = false;
    }
    return buf.slice(0, bufIdx);
  };
  function Utf7IMAPDecoder(options, codec) {
    this.iconv = codec.iconv;
    this.inBase64 = false;
    this.base64Accum = "";
  }
  var base64IMAPChars = base64Chars.slice();
  base64IMAPChars[",".charCodeAt(0)] = true;
  Utf7IMAPDecoder.prototype.write = function(buf) {
    var res = "", lastI = 0, inBase64 = this.inBase64, base64Accum = this.base64Accum;
    for (var i2 = 0; i2 < buf.length; i2++) {
      if (!inBase64) {
        if (buf[i2] == andChar) {
          res += this.iconv.decode(buf.slice(lastI, i2), "ascii");
          lastI = i2 + 1;
          inBase64 = true;
        }
      } else {
        if (!base64IMAPChars[buf[i2]]) {
          if (i2 == lastI && buf[i2] == minusChar) {
            res += "&";
          } else {
            var b64str = base64Accum + buf.slice(lastI, i2).toString().replace(/,/g, "/");
            res += this.iconv.decode(Buffer2.from(b64str, "base64"), "utf16-be");
          }
          if (buf[i2] != minusChar)
            i2--;
          lastI = i2 + 1;
          inBase64 = false;
          base64Accum = "";
        }
      }
    }
    if (!inBase64) {
      res += this.iconv.decode(buf.slice(lastI), "ascii");
    } else {
      var b64str = base64Accum + buf.slice(lastI).toString().replace(/,/g, "/");
      var canBeDecoded = b64str.length - b64str.length % 8;
      base64Accum = b64str.slice(canBeDecoded);
      b64str = b64str.slice(0, canBeDecoded);
      res += this.iconv.decode(Buffer2.from(b64str, "base64"), "utf16-be");
    }
    this.inBase64 = inBase64;
    this.base64Accum = base64Accum;
    return res;
  };
  Utf7IMAPDecoder.prototype.end = function() {
    var res = "";
    if (this.inBase64 && this.base64Accum.length > 0)
      res = this.iconv.decode(Buffer2.from(this.base64Accum, "base64"), "utf16-be");
    this.inBase64 = false;
    this.base64Accum = "";
    return res;
  };
  return utf7;
}
var sbcsCodec = {};
var hasRequiredSbcsCodec;
function requireSbcsCodec() {
  if (hasRequiredSbcsCodec) return sbcsCodec;
  hasRequiredSbcsCodec = 1;
  var Buffer2 = requireSafer().Buffer;
  sbcsCodec._sbcs = SBCSCodec;
  function SBCSCodec(codecOptions, iconv) {
    if (!codecOptions)
      throw new Error("SBCS codec is called without the data.");
    if (!codecOptions.chars || codecOptions.chars.length !== 128 && codecOptions.chars.length !== 256)
      throw new Error("Encoding '" + codecOptions.type + "' has incorrect 'chars' (must be of len 128 or 256)");
    if (codecOptions.chars.length === 128) {
      var asciiString = "";
      for (var i = 0; i < 128; i++)
        asciiString += String.fromCharCode(i);
      codecOptions.chars = asciiString + codecOptions.chars;
    }
    this.decodeBuf = Buffer2.from(codecOptions.chars, "ucs2");
    var encodeBuf = Buffer2.alloc(65536, iconv.defaultCharSingleByte.charCodeAt(0));
    for (var i = 0; i < codecOptions.chars.length; i++)
      encodeBuf[codecOptions.chars.charCodeAt(i)] = i;
    this.encodeBuf = encodeBuf;
  }
  SBCSCodec.prototype.encoder = SBCSEncoder;
  SBCSCodec.prototype.decoder = SBCSDecoder;
  function SBCSEncoder(options, codec) {
    this.encodeBuf = codec.encodeBuf;
  }
  SBCSEncoder.prototype.write = function(str) {
    var buf = Buffer2.alloc(str.length);
    for (var i = 0; i < str.length; i++)
      buf[i] = this.encodeBuf[str.charCodeAt(i)];
    return buf;
  };
  SBCSEncoder.prototype.end = function() {
  };
  function SBCSDecoder(options, codec) {
    this.decodeBuf = codec.decodeBuf;
  }
  SBCSDecoder.prototype.write = function(buf) {
    var decodeBuf = this.decodeBuf;
    var newBuf = Buffer2.alloc(buf.length * 2);
    var idx1 = 0, idx2 = 0;
    for (var i = 0; i < buf.length; i++) {
      idx1 = buf[i] * 2;
      idx2 = i * 2;
      newBuf[idx2] = decodeBuf[idx1];
      newBuf[idx2 + 1] = decodeBuf[idx1 + 1];
    }
    return newBuf.toString("ucs2");
  };
  SBCSDecoder.prototype.end = function() {
  };
  return sbcsCodec;
}
var sbcsData;
var hasRequiredSbcsData;
function requireSbcsData() {
  if (hasRequiredSbcsData) return sbcsData;
  hasRequiredSbcsData = 1;
  sbcsData = {
    // Not supported by iconv, not sure why.
    "10029": "maccenteuro",
    "maccenteuro": {
      "type": "_sbcs",
      "chars": "ÄĀāÉĄÖÜáąČäčĆćéŹźĎíďĒēĖóėôöõúĚěü†°Ę£§•¶ß®©™ę¨≠ģĮįĪ≤≥īĶ∂∑łĻļĽľĹĺŅņŃ¬√ńŇ∆«»… ňŐÕőŌ–—“”‘’÷◊ōŔŕŘ‹›řŖŗŠ‚„šŚśÁŤťÍŽžŪÓÔūŮÚůŰűŲųÝýķŻŁżĢˇ"
    },
    "808": "cp808",
    "ibm808": "cp808",
    "cp808": {
      "type": "_sbcs",
      "chars": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёЄєЇїЎў°∙·√№€■ "
    },
    "mik": {
      "type": "_sbcs",
      "chars": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя└┴┬├─┼╣║╚╔╩╦╠═╬┐░▒▓│┤№§╗╝┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
    },
    // Aliases of generated encodings.
    "ascii8bit": "ascii",
    "usascii": "ascii",
    "ansix34": "ascii",
    "ansix341968": "ascii",
    "ansix341986": "ascii",
    "csascii": "ascii",
    "cp367": "ascii",
    "ibm367": "ascii",
    "isoir6": "ascii",
    "iso646us": "ascii",
    "iso646irv": "ascii",
    "us": "ascii",
    "latin1": "iso88591",
    "latin2": "iso88592",
    "latin3": "iso88593",
    "latin4": "iso88594",
    "latin5": "iso88599",
    "latin6": "iso885910",
    "latin7": "iso885913",
    "latin8": "iso885914",
    "latin9": "iso885915",
    "latin10": "iso885916",
    "csisolatin1": "iso88591",
    "csisolatin2": "iso88592",
    "csisolatin3": "iso88593",
    "csisolatin4": "iso88594",
    "csisolatincyrillic": "iso88595",
    "csisolatinarabic": "iso88596",
    "csisolatingreek": "iso88597",
    "csisolatinhebrew": "iso88598",
    "csisolatin5": "iso88599",
    "csisolatin6": "iso885910",
    "l1": "iso88591",
    "l2": "iso88592",
    "l3": "iso88593",
    "l4": "iso88594",
    "l5": "iso88599",
    "l6": "iso885910",
    "l7": "iso885913",
    "l8": "iso885914",
    "l9": "iso885915",
    "l10": "iso885916",
    "isoir14": "iso646jp",
    "isoir57": "iso646cn",
    "isoir100": "iso88591",
    "isoir101": "iso88592",
    "isoir109": "iso88593",
    "isoir110": "iso88594",
    "isoir144": "iso88595",
    "isoir127": "iso88596",
    "isoir126": "iso88597",
    "isoir138": "iso88598",
    "isoir148": "iso88599",
    "isoir157": "iso885910",
    "isoir166": "tis620",
    "isoir179": "iso885913",
    "isoir199": "iso885914",
    "isoir203": "iso885915",
    "isoir226": "iso885916",
    "cp819": "iso88591",
    "ibm819": "iso88591",
    "cyrillic": "iso88595",
    "arabic": "iso88596",
    "arabic8": "iso88596",
    "ecma114": "iso88596",
    "asmo708": "iso88596",
    "greek": "iso88597",
    "greek8": "iso88597",
    "ecma118": "iso88597",
    "elot928": "iso88597",
    "hebrew": "iso88598",
    "hebrew8": "iso88598",
    "turkish": "iso88599",
    "turkish8": "iso88599",
    "thai": "iso885911",
    "thai8": "iso885911",
    "celtic": "iso885914",
    "celtic8": "iso885914",
    "isoceltic": "iso885914",
    "tis6200": "tis620",
    "tis62025291": "tis620",
    "tis62025330": "tis620",
    "10000": "macroman",
    "10006": "macgreek",
    "10007": "maccyrillic",
    "10079": "maciceland",
    "10081": "macturkish",
    "cspc8codepage437": "cp437",
    "cspc775baltic": "cp775",
    "cspc850multilingual": "cp850",
    "cspcp852": "cp852",
    "cspc862latinhebrew": "cp862",
    "cpgr": "cp869",
    "msee": "cp1250",
    "mscyrl": "cp1251",
    "msansi": "cp1252",
    "msgreek": "cp1253",
    "msturk": "cp1254",
    "mshebr": "cp1255",
    "msarab": "cp1256",
    "winbaltrim": "cp1257",
    "cp20866": "koi8r",
    "20866": "koi8r",
    "ibm878": "koi8r",
    "cskoi8r": "koi8r",
    "cp21866": "koi8u",
    "21866": "koi8u",
    "ibm1168": "koi8u",
    "strk10482002": "rk1048",
    "tcvn5712": "tcvn",
    "tcvn57121": "tcvn",
    "gb198880": "iso646cn",
    "cn": "iso646cn",
    "csiso14jisc6220ro": "iso646jp",
    "jisc62201969ro": "iso646jp",
    "jp": "iso646jp",
    "cshproman8": "hproman8",
    "r8": "hproman8",
    "roman8": "hproman8",
    "xroman8": "hproman8",
    "ibm1051": "hproman8",
    "mac": "macintosh",
    "csmacintosh": "macintosh"
  };
  return sbcsData;
}
var sbcsDataGenerated;
var hasRequiredSbcsDataGenerated;
function requireSbcsDataGenerated() {
  if (hasRequiredSbcsDataGenerated) return sbcsDataGenerated;
  hasRequiredSbcsDataGenerated = 1;
  sbcsDataGenerated = {
    "437": "cp437",
    "737": "cp737",
    "775": "cp775",
    "850": "cp850",
    "852": "cp852",
    "855": "cp855",
    "856": "cp856",
    "857": "cp857",
    "858": "cp858",
    "860": "cp860",
    "861": "cp861",
    "862": "cp862",
    "863": "cp863",
    "864": "cp864",
    "865": "cp865",
    "866": "cp866",
    "869": "cp869",
    "874": "windows874",
    "922": "cp922",
    "1046": "cp1046",
    "1124": "cp1124",
    "1125": "cp1125",
    "1129": "cp1129",
    "1133": "cp1133",
    "1161": "cp1161",
    "1162": "cp1162",
    "1163": "cp1163",
    "1250": "windows1250",
    "1251": "windows1251",
    "1252": "windows1252",
    "1253": "windows1253",
    "1254": "windows1254",
    "1255": "windows1255",
    "1256": "windows1256",
    "1257": "windows1257",
    "1258": "windows1258",
    "28591": "iso88591",
    "28592": "iso88592",
    "28593": "iso88593",
    "28594": "iso88594",
    "28595": "iso88595",
    "28596": "iso88596",
    "28597": "iso88597",
    "28598": "iso88598",
    "28599": "iso88599",
    "28600": "iso885910",
    "28601": "iso885911",
    "28603": "iso885913",
    "28604": "iso885914",
    "28605": "iso885915",
    "28606": "iso885916",
    "windows874": {
      "type": "_sbcs",
      "chars": "€����…�����������‘’“”•–—�������� กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"
    },
    "win874": "windows874",
    "cp874": "windows874",
    "windows1250": {
      "type": "_sbcs",
      "chars": "€�‚�„…†‡�‰Š‹ŚŤŽŹ�‘’“”•–—�™š›śťžź ˇ˘Ł¤Ą¦§¨©Ş«¬­®Ż°±˛ł´µ¶·¸ąş»Ľ˝ľżŔÁÂĂÄĹĆÇČÉĘËĚÍÎĎĐŃŇÓÔŐÖ×ŘŮÚŰÜÝŢßŕáâăäĺćçčéęëěíîďđńňóôőö÷řůúűüýţ˙"
    },
    "win1250": "windows1250",
    "cp1250": "windows1250",
    "windows1251": {
      "type": "_sbcs",
      "chars": "ЂЃ‚ѓ„…†‡€‰Љ‹ЊЌЋЏђ‘’“”•–—�™љ›њќћџ ЎўЈ¤Ґ¦§Ё©Є«¬­®Ї°±Ііґµ¶·ё№є»јЅѕїАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя"
    },
    "win1251": "windows1251",
    "cp1251": "windows1251",
    "windows1252": {
      "type": "_sbcs",
      "chars": "€�‚ƒ„…†‡ˆ‰Š‹Œ�Ž��‘’“”•–—˜™š›œ�žŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
    },
    "win1252": "windows1252",
    "cp1252": "windows1252",
    "windows1253": {
      "type": "_sbcs",
      "chars": "€�‚ƒ„…†‡�‰�‹�����‘’“”•–—�™�›���� ΅Ά£¤¥¦§¨©�«¬­®―°±²³΄µ¶·ΈΉΊ»Ό½ΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ�ΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώ�"
    },
    "win1253": "windows1253",
    "cp1253": "windows1253",
    "windows1254": {
      "type": "_sbcs",
      "chars": "€�‚ƒ„…†‡ˆ‰Š‹Œ����‘’“”•–—˜™š›œ��Ÿ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏĞÑÒÓÔÕÖ×ØÙÚÛÜİŞßàáâãäåæçèéêëìíîïğñòóôõö÷øùúûüışÿ"
    },
    "win1254": "windows1254",
    "cp1254": "windows1254",
    "windows1255": {
      "type": "_sbcs",
      "chars": "€�‚ƒ„…†‡ˆ‰�‹�����‘’“”•–—˜™�›���� ¡¢£₪¥¦§¨©×«¬­®¯°±²³´µ¶·¸¹÷»¼½¾¿ְֱֲֳִֵֶַָֹֺֻּֽ־ֿ׀ׁׂ׃װױײ׳״�������אבגדהוזחטיךכלםמןנסעףפץצקרשת��‎‏�"
    },
    "win1255": "windows1255",
    "cp1255": "windows1255",
    "windows1256": {
      "type": "_sbcs",
      "chars": "€پ‚ƒ„…†‡ˆ‰ٹ‹Œچژڈگ‘’“”•–—ک™ڑ›œ‌‍ں ،¢£¤¥¦§¨©ھ«¬­®¯°±²³´µ¶·¸¹؛»¼½¾؟ہءآأؤإئابةتثجحخدذرزسشصض×طظعغـفقكàلâمنهوçèéêëىيîïًٌٍَôُِ÷ّùْûü‎‏ے"
    },
    "win1256": "windows1256",
    "cp1256": "windows1256",
    "windows1257": {
      "type": "_sbcs",
      "chars": "€�‚�„…†‡�‰�‹�¨ˇ¸�‘’“”•–—�™�›�¯˛� �¢£¤�¦§Ø©Ŗ«¬­®Æ°±²³´µ¶·ø¹ŗ»¼½¾æĄĮĀĆÄÅĘĒČÉŹĖĢĶĪĻŠŃŅÓŌÕÖ×ŲŁŚŪÜŻŽßąįāćäåęēčéźėģķīļšńņóōõö÷ųłśūüżž˙"
    },
    "win1257": "windows1257",
    "cp1257": "windows1257",
    "windows1258": {
      "type": "_sbcs",
      "chars": "€�‚ƒ„…†‡ˆ‰�‹Œ����‘’“”•–—˜™�›œ��Ÿ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ×ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö÷øùúûüư₫ÿ"
    },
    "win1258": "windows1258",
    "cp1258": "windows1258",
    "iso88591": {
      "type": "_sbcs",
      "chars": " ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
    },
    "cp28591": "iso88591",
    "iso88592": {
      "type": "_sbcs",
      "chars": " Ą˘Ł¤ĽŚ§¨ŠŞŤŹ­ŽŻ°ą˛ł´ľśˇ¸šşťź˝žżŔÁÂĂÄĹĆÇČÉĘËĚÍÎĎĐŃŇÓÔŐÖ×ŘŮÚŰÜÝŢßŕáâăäĺćçčéęëěíîďđńňóôőö÷řůúűüýţ˙"
    },
    "cp28592": "iso88592",
    "iso88593": {
      "type": "_sbcs",
      "chars": " Ħ˘£¤�Ĥ§¨İŞĞĴ­�Ż°ħ²³´µĥ·¸ışğĵ½�żÀÁÂ�ÄĊĈÇÈÉÊËÌÍÎÏ�ÑÒÓÔĠÖ×ĜÙÚÛÜŬŜßàáâ�äċĉçèéêëìíîï�ñòóôġö÷ĝùúûüŭŝ˙"
    },
    "cp28593": "iso88593",
    "iso88594": {
      "type": "_sbcs",
      "chars": " ĄĸŖ¤ĨĻ§¨ŠĒĢŦ­Ž¯°ą˛ŗ´ĩļˇ¸šēģŧŊžŋĀÁÂÃÄÅÆĮČÉĘËĖÍÎĪĐŅŌĶÔÕÖ×ØŲÚÛÜŨŪßāáâãäåæįčéęëėíîīđņōķôõö÷øųúûüũū˙"
    },
    "cp28594": "iso88594",
    "iso88595": {
      "type": "_sbcs",
      "chars": " ЁЂЃЄЅІЇЈЉЊЋЌ­ЎЏАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя№ёђѓєѕіїјљњћќ§ўџ"
    },
    "cp28595": "iso88595",
    "iso88596": {
      "type": "_sbcs",
      "chars": " ���¤�������،­�������������؛���؟�ءآأؤإئابةتثجحخدذرزسشصضطظعغ�����ـفقكلمنهوىيًٌٍَُِّْ�������������"
    },
    "cp28596": "iso88596",
    "iso88597": {
      "type": "_sbcs",
      "chars": " ‘’£€₯¦§¨©ͺ«¬­�―°±²³΄΅Ά·ΈΉΊ»Ό½ΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ�ΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώ�"
    },
    "cp28597": "iso88597",
    "iso88598": {
      "type": "_sbcs",
      "chars": " �¢£¤¥¦§¨©×«¬­®¯°±²³´µ¶·¸¹÷»¼½¾��������������������������������‗אבגדהוזחטיךכלםמןנסעףפץצקרשת��‎‏�"
    },
    "cp28598": "iso88598",
    "iso88599": {
      "type": "_sbcs",
      "chars": " ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏĞÑÒÓÔÕÖ×ØÙÚÛÜİŞßàáâãäåæçèéêëìíîïğñòóôõö÷øùúûüışÿ"
    },
    "cp28599": "iso88599",
    "iso885910": {
      "type": "_sbcs",
      "chars": " ĄĒĢĪĨĶ§ĻĐŠŦŽ­ŪŊ°ąēģīĩķ·ļđšŧž―ūŋĀÁÂÃÄÅÆĮČÉĘËĖÍÎÏÐŅŌÓÔÕÖŨØŲÚÛÜÝÞßāáâãäåæįčéęëėíîïðņōóôõöũøųúûüýþĸ"
    },
    "cp28600": "iso885910",
    "iso885911": {
      "type": "_sbcs",
      "chars": " กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"
    },
    "cp28601": "iso885911",
    "iso885913": {
      "type": "_sbcs",
      "chars": " ”¢£¤„¦§Ø©Ŗ«¬­®Æ°±²³“µ¶·ø¹ŗ»¼½¾æĄĮĀĆÄÅĘĒČÉŹĖĢĶĪĻŠŃŅÓŌÕÖ×ŲŁŚŪÜŻŽßąįāćäåęēčéźėģķīļšńņóōõö÷ųłśūüżž’"
    },
    "cp28603": "iso885913",
    "iso885914": {
      "type": "_sbcs",
      "chars": " Ḃḃ£ĊċḊ§Ẁ©ẂḋỲ­®ŸḞḟĠġṀṁ¶ṖẁṗẃṠỳẄẅṡÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏŴÑÒÓÔÕÖṪØÙÚÛÜÝŶßàáâãäåæçèéêëìíîïŵñòóôõöṫøùúûüýŷÿ"
    },
    "cp28604": "iso885914",
    "iso885915": {
      "type": "_sbcs",
      "chars": " ¡¢£€¥Š§š©ª«¬­®¯°±²³Žµ¶·ž¹º»ŒœŸ¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
    },
    "cp28605": "iso885915",
    "iso885916": {
      "type": "_sbcs",
      "chars": " ĄąŁ€„Š§š©Ș«Ź­źŻ°±ČłŽ”¶·žčș»ŒœŸżÀÁÂĂÄĆÆÇÈÉÊËÌÍÎÏĐŃÒÓÔŐÖŚŰÙÚÛÜĘȚßàáâăäćæçèéêëìíîïđńòóôőöśűùúûüęțÿ"
    },
    "cp28606": "iso885916",
    "cp437": {
      "type": "_sbcs",
      "chars": "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
    },
    "ibm437": "cp437",
    "csibm437": "cp437",
    "cp737": {
      "type": "_sbcs",
      "chars": "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρσςτυφχψ░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀ωάέήϊίόύϋώΆΈΉΊΌΎΏ±≥≤ΪΫ÷≈°∙·√ⁿ²■ "
    },
    "ibm737": "cp737",
    "csibm737": "cp737",
    "cp775": {
      "type": "_sbcs",
      "chars": "ĆüéāäģåćłēŖŗīŹÄÅÉæÆōöĢ¢ŚśÖÜø£Ø×¤ĀĪóŻżź”¦©®¬½¼Ł«»░▒▓│┤ĄČĘĖ╣║╗╝ĮŠ┐└┴┬├─┼ŲŪ╚╔╩╦╠═╬Žąčęėįšųūž┘┌█▄▌▐▀ÓßŌŃõÕµńĶķĻļņĒŅ’­±“¾¶§÷„°∙·¹³²■ "
    },
    "ibm775": "cp775",
    "csibm775": "cp775",
    "cp850": {
      "type": "_sbcs",
      "chars": "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈıÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ "
    },
    "ibm850": "cp850",
    "csibm850": "cp850",
    "cp852": {
      "type": "_sbcs",
      "chars": "ÇüéâäůćçłëŐőîŹÄĆÉĹĺôöĽľŚśÖÜŤťŁ×čáíóúĄąŽžĘę¬źČş«»░▒▓│┤ÁÂĚŞ╣║╗╝Żż┐└┴┬├─┼Ăă╚╔╩╦╠═╬¤đĐĎËďŇÍÎě┘┌█▄ŢŮ▀ÓßÔŃńňŠšŔÚŕŰýÝţ´­˝˛ˇ˘§÷¸°¨˙űŘř■ "
    },
    "ibm852": "cp852",
    "csibm852": "cp852",
    "cp855": {
      "type": "_sbcs",
      "chars": "ђЂѓЃёЁєЄѕЅіІїЇјЈљЉњЊћЋќЌўЎџЏюЮъЪаАбБцЦдДеЕфФгГ«»░▒▓│┤хХиИ╣║╗╝йЙ┐└┴┬├─┼кК╚╔╩╦╠═╬¤лЛмМнНоОп┘┌█▄Пя▀ЯрРсСтТуУжЖвВьЬ№­ыЫзЗшШэЭщЩчЧ§■ "
    },
    "ibm855": "cp855",
    "csibm855": "cp855",
    "cp856": {
      "type": "_sbcs",
      "chars": "אבגדהוזחטיךכלםמןנסעףפץצקרשת�£�×����������®¬½¼�«»░▒▓│┤���©╣║╗╝¢¥┐└┴┬├─┼��╚╔╩╦╠═╬¤���������┘┌█▄¦�▀������µ�������¯´­±‗¾¶§÷¸°¨·¹³²■ "
    },
    "ibm856": "cp856",
    "csibm856": "cp856",
    "cp857": {
      "type": "_sbcs",
      "chars": "ÇüéâäàåçêëèïîıÄÅÉæÆôöòûùİÖÜø£ØŞşáíóúñÑĞğ¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ºªÊËÈ�ÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµ�×ÚÛÙìÿ¯´­±�¾¶§÷¸°¨·¹³²■ "
    },
    "ibm857": "cp857",
    "csibm857": "cp857",
    "cp858": {
      "type": "_sbcs",
      "chars": "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈ€ÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ "
    },
    "ibm858": "cp858",
    "csibm858": "cp858",
    "cp860": {
      "type": "_sbcs",
      "chars": "ÇüéâãàÁçêÊèÍÔìÃÂÉÀÈôõòÚùÌÕÜ¢£Ù₧ÓáíóúñÑªº¿Ò¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
    },
    "ibm860": "cp860",
    "csibm860": "cp860",
    "cp861": {
      "type": "_sbcs",
      "chars": "ÇüéâäàåçêëèÐðÞÄÅÉæÆôöþûÝýÖÜø£Ø₧ƒáíóúÁÍÓÚ¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
    },
    "ibm861": "cp861",
    "csibm861": "cp861",
    "cp862": {
      "type": "_sbcs",
      "chars": "אבגדהוזחטיךכלםמןנסעףפץצקרשת¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
    },
    "ibm862": "cp862",
    "csibm862": "cp862",
    "cp863": {
      "type": "_sbcs",
      "chars": "ÇüéâÂà¶çêëèïî‗À§ÉÈÊôËÏûù¤ÔÜ¢£ÙÛƒ¦´óú¨¸³¯Î⌐¬½¼¾«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
    },
    "ibm863": "cp863",
    "csibm863": "cp863",
    "cp864": {
      "type": "_sbcs",
      "chars": "\0\x07\b	\n\v\f\r\x1B !\"#$٪&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~°·∙√▒─│┼┤┬├┴┐┌└┘β∞φ±½¼≈«»ﻷﻸ��ﻻﻼ� ­ﺂ£¤ﺄ��ﺎﺏﺕﺙ،ﺝﺡﺥ٠١٢٣٤٥٦٧٨٩ﻑ؛ﺱﺵﺹ؟¢ﺀﺁﺃﺅﻊﺋﺍﺑﺓﺗﺛﺟﺣﺧﺩﺫﺭﺯﺳﺷﺻﺿﻁﻅﻋﻏ¦¬÷×ﻉـﻓﻗﻛﻟﻣﻧﻫﻭﻯﻳﺽﻌﻎﻍﻡﹽّﻥﻩﻬﻰﻲﻐﻕﻵﻶﻝﻙﻱ■�"
    },
    "ibm864": "cp864",
    "csibm864": "cp864",
    "cp865": {
      "type": "_sbcs",
      "chars": "ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø₧ƒáíóúñÑªº¿⌐¬½¼¡«¤░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ "
    },
    "ibm865": "cp865",
    "csibm865": "cp865",
    "cp866": {
      "type": "_sbcs",
      "chars": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёЄєЇїЎў°∙·√№¤■ "
    },
    "ibm866": "cp866",
    "csibm866": "cp866",
    "cp869": {
      "type": "_sbcs",
      "chars": "������Ά�·¬¦‘’Έ―ΉΊΪΌ��ΎΫ©Ώ²³ά£έήίϊΐόύΑΒΓΔΕΖΗ½ΘΙ«»░▒▓│┤ΚΛΜΝ╣║╗╝ΞΟ┐└┴┬├─┼ΠΡ╚╔╩╦╠═╬ΣΤΥΦΧΨΩαβγ┘┌█▄δε▀ζηθικλμνξοπρσςτ΄­±υφχ§ψ΅°¨ωϋΰώ■ "
    },
    "ibm869": "cp869",
    "csibm869": "cp869",
    "cp922": {
      "type": "_sbcs",
      "chars": " ¡¢£¤¥¦§¨©ª«¬­®‾°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏŠÑÒÓÔÕÖ×ØÙÚÛÜÝŽßàáâãäåæçèéêëìíîïšñòóôõö÷øùúûüýžÿ"
    },
    "ibm922": "cp922",
    "csibm922": "cp922",
    "cp1046": {
      "type": "_sbcs",
      "chars": "ﺈ×÷ﹱ■│─┐┌└┘ﹹﹻﹽﹿﹷﺊﻰﻳﻲﻎﻏﻐﻶﻸﻺﻼ ¤ﺋﺑﺗﺛﺟﺣ،­ﺧﺳ٠١٢٣٤٥٦٧٨٩ﺷ؛ﺻﺿﻊ؟ﻋءآأؤإئابةتثجحخدذرزسشصضطﻇعغﻌﺂﺄﺎﻓـفقكلمنهوىيًٌٍَُِّْﻗﻛﻟﻵﻷﻹﻻﻣﻧﻬﻩ�"
    },
    "ibm1046": "cp1046",
    "csibm1046": "cp1046",
    "cp1124": {
      "type": "_sbcs",
      "chars": " ЁЂҐЄЅІЇЈЉЊЋЌ­ЎЏАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя№ёђґєѕіїјљњћќ§ўџ"
    },
    "ibm1124": "cp1124",
    "csibm1124": "cp1124",
    "cp1125": {
      "type": "_sbcs",
      "chars": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёҐґЄєІіЇї·√№¤■ "
    },
    "ibm1125": "cp1125",
    "csibm1125": "cp1125",
    "cp1129": {
      "type": "_sbcs",
      "chars": " ¡¢£¤¥¦§œ©ª«¬­®¯°±²³Ÿµ¶·Œ¹º»¼½¾¿ÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ×ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö÷øùúûüư₫ÿ"
    },
    "ibm1129": "cp1129",
    "csibm1129": "cp1129",
    "cp1133": {
      "type": "_sbcs",
      "chars": " ກຂຄງຈສຊຍດຕຖທນບປຜຝພຟມຢຣລວຫອຮ���ຯະາຳິີຶືຸູຼັົຽ���ເແໂໃໄ່້໊໋໌ໍໆ�ໜໝ₭����������������໐໑໒໓໔໕໖໗໘໙��¢¬¦�"
    },
    "ibm1133": "cp1133",
    "csibm1133": "cp1133",
    "cp1161": {
      "type": "_sbcs",
      "chars": "��������������������������������่กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู้๊๋€฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛¢¬¦ "
    },
    "ibm1161": "cp1161",
    "csibm1161": "cp1161",
    "cp1162": {
      "type": "_sbcs",
      "chars": "€…‘’“”•–— กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"
    },
    "ibm1162": "cp1162",
    "csibm1162": "cp1162",
    "cp1163": {
      "type": "_sbcs",
      "chars": " ¡¢£€¥¦§œ©ª«¬­®¯°±²³Ÿµ¶·Œ¹º»¼½¾¿ÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ×ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö÷øùúûüư₫ÿ"
    },
    "ibm1163": "cp1163",
    "csibm1163": "cp1163",
    "maccroatian": {
      "type": "_sbcs",
      "chars": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®Š™´¨≠ŽØ∞±≤≥∆µ∂∑∏š∫ªºΩžø¿¡¬√ƒ≈Ć«Č… ÀÃÕŒœĐ—“”‘’÷◊�©⁄¤‹›Æ»–·‚„‰ÂćÁčÈÍÎÏÌÓÔđÒÚÛÙıˆ˜¯πË˚¸Êæˇ"
    },
    "maccyrillic": {
      "type": "_sbcs",
      "chars": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°¢£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµ∂ЈЄєЇїЉљЊњјЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю¤"
    },
    "macgreek": {
      "type": "_sbcs",
      "chars": "Ä¹²É³ÖÜ΅àâä΄¨çéèêë£™îï•½‰ôö¦­ùûü†ΓΔΘΛΞΠß®©ΣΪ§≠°·Α±≤≥¥ΒΕΖΗΙΚΜΦΫΨΩάΝ¬ΟΡ≈Τ«»… ΥΧΆΈœ–―“”‘’÷ΉΊΌΎέήίόΏύαβψδεφγηιξκλμνοπώρστθωςχυζϊϋΐΰ�"
    },
    "maciceland": {
      "type": "_sbcs",
      "chars": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûüÝ°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤ÐðÞþý·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"
    },
    "macroman": {
      "type": "_sbcs",
      "chars": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"
    },
    "macromania": {
      "type": "_sbcs",
      "chars": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ĂŞ∞±≤≥¥µ∂∑∏π∫ªºΩăş¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤‹›Ţţ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"
    },
    "macthai": {
      "type": "_sbcs",
      "chars": "«»…“”�•‘’� กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู\uFEFF​–—฿เแโใไๅๆ็่้๊๋์ํ™๏๐๑๒๓๔๕๖๗๘๙®©����"
    },
    "macturkish": {
      "type": "_sbcs",
      "chars": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸĞğİıŞş‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙ�ˆ˜¯˘˙˚¸˝˛ˇ"
    },
    "macukraine": {
      "type": "_sbcs",
      "chars": "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°Ґ£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµґЈЄєЇїЉљЊњјЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю¤"
    },
    "koi8r": {
      "type": "_sbcs",
      "chars": "─│┌┐└┘├┤┬┴┼▀▄█▌▐░▒▓⌠■∙√≈≤≥ ⌡°²·÷═║╒ё╓╔╕╖╗╘╙╚╛╜╝╞╟╠╡Ё╢╣╤╥╦╧╨╩╪╫╬©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"
    },
    "koi8u": {
      "type": "_sbcs",
      "chars": "─│┌┐└┘├┤┬┴┼▀▄█▌▐░▒▓⌠■∙√≈≤≥ ⌡°²·÷═║╒ёє╔ії╗╘╙╚╛ґ╝╞╟╠╡ЁЄ╣ІЇ╦╧╨╩╪Ґ╬©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"
    },
    "koi8ru": {
      "type": "_sbcs",
      "chars": "─│┌┐└┘├┤┬┴┼▀▄█▌▐░▒▓⌠■∙√≈≤≥ ⌡°²·÷═║╒ёє╔ії╗╘╙╚╛ґў╞╟╠╡ЁЄ╣ІЇ╦╧╨╩╪ҐЎ©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"
    },
    "koi8t": {
      "type": "_sbcs",
      "chars": "қғ‚Ғ„…†‡�‰ҳ‹ҲҷҶ�Қ‘’“”•–—�™�›�����ӯӮё¤ӣ¦§���«¬­®�°±²Ё�Ӣ¶·�№�»���©юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧЪ"
    },
    "armscii8": {
      "type": "_sbcs",
      "chars": " �և։)(»«—.՝,-֊…՜՛՞ԱաԲբԳգԴդԵեԶզԷէԸըԹթԺժԻիԼլԽխԾծԿկՀհՁձՂղՃճՄմՅյՆնՇշՈոՉչՊպՋջՌռՍսՎվՏտՐրՑցՒւՓփՔքՕօՖֆ՚�"
    },
    "rk1048": {
      "type": "_sbcs",
      "chars": "ЂЃ‚ѓ„…†‡€‰Љ‹ЊҚҺЏђ‘’“”•–—�™љ›њқһџ ҰұӘ¤Ө¦§Ё©Ғ«¬­®Ү°±Ііөµ¶·ё№ғ»әҢңүАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя"
    },
    "tcvn": {
      "type": "_sbcs",
      "chars": "\0ÚỤỪỬỮ\x07\b	\n\v\f\rỨỰỲỶỸÝỴ\x1B !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ÀẢÃÁẠẶẬÈẺẼÉẸỆÌỈĨÍỊÒỎÕÓỌỘỜỞỠỚỢÙỦŨ ĂÂÊÔƠƯĐăâêôơưđẶ̀̀̉̃́àảãáạẲằẳẵắẴẮẦẨẪẤỀặầẩẫấậèỂẻẽéẹềểễếệìỉỄẾỒĩíịòỔỏõóọồổỗốộờởỡớợùỖủũúụừửữứựỳỷỹýỵỐ"
    },
    "georgianacademy": {
      "type": "_sbcs",
      "chars": "‚ƒ„…†‡ˆ‰Š‹Œ‘’“”•–—˜™š›œŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰჱჲჳჴჵჶçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
    },
    "georgianps": {
      "type": "_sbcs",
      "chars": "‚ƒ„…†‡ˆ‰Š‹Œ‘’“”•–—˜™š›œŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿აბგდევზჱთიკლმნჲოპჟრსტჳუფქღყშჩცძწჭხჴჯჰჵæçèéêëìíîïðñòóôõö÷øùúûüýþÿ"
    },
    "pt154": {
      "type": "_sbcs",
      "chars": "ҖҒӮғ„…ҶҮҲүҠӢҢҚҺҸҗ‘’“”•–—ҳҷҡӣңқһҹ ЎўЈӨҘҰ§Ё©Ә«¬ӯ®Ҝ°ұІіҙө¶·ё№ә»јҪҫҝАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя"
    },
    "viscii": {
      "type": "_sbcs",
      "chars": "\0ẲẴẪ\x07\b	\n\v\f\rỶỸ\x1BỴ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ẠẮẰẶẤẦẨẬẼẸẾỀỂỄỆỐỒỔỖỘỢỚỜỞỊỎỌỈỦŨỤỲÕắằặấầẩậẽẹếềểễệốồổỗỠƠộờởịỰỨỪỬơớƯÀÁÂÃẢĂẳẵÈÉÊẺÌÍĨỳĐứÒÓÔạỷừửÙÚỹỵÝỡưàáâãảăữẫèéêẻìíĩỉđựòóôõỏọụùúũủýợỮ"
    },
    "iso646cn": {
      "type": "_sbcs",
      "chars": "\0\x07\b	\n\v\f\r\x1B !\"#¥%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}‾��������������������������������������������������������������������������������������������������������������������������������"
    },
    "iso646jp": {
      "type": "_sbcs",
      "chars": "\0\x07\b	\n\v\f\r\x1B !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[¥]^_`abcdefghijklmnopqrstuvwxyz{|}‾��������������������������������������������������������������������������������������������������������������������������������"
    },
    "hproman8": {
      "type": "_sbcs",
      "chars": " ÀÂÈÊËÎÏ´ˋˆ¨˜ÙÛ₤¯Ýý°ÇçÑñ¡¿¤£¥§ƒ¢âêôûáéóúàèòùäëöüÅîØÆåíøæÄìÖÜÉïßÔÁÃãÐðÍÌÓÒÕõŠšÚŸÿÞþ·µ¶¾—¼½ªº«■»±�"
    },
    "macintosh": {
      "type": "_sbcs",
      "chars": "ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄¤‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔ�ÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ"
    },
    "ascii": {
      "type": "_sbcs",
      "chars": "��������������������������������������������������������������������������������������������������������������������������������"
    },
    "tis620": {
      "type": "_sbcs",
      "chars": "���������������������������������กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����"
    }
  };
  return sbcsDataGenerated;
}
var dbcsCodec = {};
var hasRequiredDbcsCodec;
function requireDbcsCodec() {
  if (hasRequiredDbcsCodec) return dbcsCodec;
  hasRequiredDbcsCodec = 1;
  var Buffer2 = requireSafer().Buffer;
  dbcsCodec._dbcs = DBCSCodec;
  var UNASSIGNED = -1, GB18030_CODE = -2, SEQ_START = -10, NODE_START = -1e3, UNASSIGNED_NODE = new Array(256), DEF_CHAR = -1;
  for (var i = 0; i < 256; i++)
    UNASSIGNED_NODE[i] = UNASSIGNED;
  function DBCSCodec(codecOptions, iconv) {
    this.encodingName = codecOptions.encodingName;
    if (!codecOptions)
      throw new Error("DBCS codec is called without the data.");
    if (!codecOptions.table)
      throw new Error("Encoding '" + this.encodingName + "' has no data.");
    var mappingTable = codecOptions.table();
    this.decodeTables = [];
    this.decodeTables[0] = UNASSIGNED_NODE.slice(0);
    this.decodeTableSeq = [];
    for (var i2 = 0; i2 < mappingTable.length; i2++)
      this._addDecodeChunk(mappingTable[i2]);
    this.defaultCharUnicode = iconv.defaultCharUnicode;
    this.encodeTable = [];
    this.encodeTableSeq = [];
    var skipEncodeChars = {};
    if (codecOptions.encodeSkipVals)
      for (var i2 = 0; i2 < codecOptions.encodeSkipVals.length; i2++) {
        var val = codecOptions.encodeSkipVals[i2];
        if (typeof val === "number")
          skipEncodeChars[val] = true;
        else
          for (var j = val.from; j <= val.to; j++)
            skipEncodeChars[j] = true;
      }
    this._fillEncodeTable(0, 0, skipEncodeChars);
    if (codecOptions.encodeAdd) {
      for (var uChar in codecOptions.encodeAdd)
        if (Object.prototype.hasOwnProperty.call(codecOptions.encodeAdd, uChar))
          this._setEncodeChar(uChar.charCodeAt(0), codecOptions.encodeAdd[uChar]);
    }
    this.defCharSB = this.encodeTable[0][iconv.defaultCharSingleByte.charCodeAt(0)];
    if (this.defCharSB === UNASSIGNED) this.defCharSB = this.encodeTable[0]["?"];
    if (this.defCharSB === UNASSIGNED) this.defCharSB = "?".charCodeAt(0);
    if (typeof codecOptions.gb18030 === "function") {
      this.gb18030 = codecOptions.gb18030();
      var thirdByteNodeIdx = this.decodeTables.length;
      var thirdByteNode = this.decodeTables[thirdByteNodeIdx] = UNASSIGNED_NODE.slice(0);
      var fourthByteNodeIdx = this.decodeTables.length;
      var fourthByteNode = this.decodeTables[fourthByteNodeIdx] = UNASSIGNED_NODE.slice(0);
      for (var i2 = 129; i2 <= 254; i2++) {
        var secondByteNodeIdx = NODE_START - this.decodeTables[0][i2];
        var secondByteNode = this.decodeTables[secondByteNodeIdx];
        for (var j = 48; j <= 57; j++)
          secondByteNode[j] = NODE_START - thirdByteNodeIdx;
      }
      for (var i2 = 129; i2 <= 254; i2++)
        thirdByteNode[i2] = NODE_START - fourthByteNodeIdx;
      for (var i2 = 48; i2 <= 57; i2++)
        fourthByteNode[i2] = GB18030_CODE;
    }
  }
  DBCSCodec.prototype.encoder = DBCSEncoder;
  DBCSCodec.prototype.decoder = DBCSDecoder;
  DBCSCodec.prototype._getDecodeTrieNode = function(addr) {
    var bytes = [];
    for (; addr > 0; addr >>= 8)
      bytes.push(addr & 255);
    if (bytes.length == 0)
      bytes.push(0);
    var node = this.decodeTables[0];
    for (var i2 = bytes.length - 1; i2 > 0; i2--) {
      var val = node[bytes[i2]];
      if (val == UNASSIGNED) {
        node[bytes[i2]] = NODE_START - this.decodeTables.length;
        this.decodeTables.push(node = UNASSIGNED_NODE.slice(0));
      } else if (val <= NODE_START) {
        node = this.decodeTables[NODE_START - val];
      } else
        throw new Error("Overwrite byte in " + this.encodingName + ", addr: " + addr.toString(16));
    }
    return node;
  };
  DBCSCodec.prototype._addDecodeChunk = function(chunk) {
    var curAddr = parseInt(chunk[0], 16);
    var writeTable = this._getDecodeTrieNode(curAddr);
    curAddr = curAddr & 255;
    for (var k = 1; k < chunk.length; k++) {
      var part = chunk[k];
      if (typeof part === "string") {
        for (var l = 0; l < part.length; ) {
          var code = part.charCodeAt(l++);
          if (55296 <= code && code < 56320) {
            var codeTrail = part.charCodeAt(l++);
            if (56320 <= codeTrail && codeTrail < 57344)
              writeTable[curAddr++] = 65536 + (code - 55296) * 1024 + (codeTrail - 56320);
            else
              throw new Error("Incorrect surrogate pair in " + this.encodingName + " at chunk " + chunk[0]);
          } else if (4080 < code && code <= 4095) {
            var len = 4095 - code + 2;
            var seq = [];
            for (var m = 0; m < len; m++)
              seq.push(part.charCodeAt(l++));
            writeTable[curAddr++] = SEQ_START - this.decodeTableSeq.length;
            this.decodeTableSeq.push(seq);
          } else
            writeTable[curAddr++] = code;
        }
      } else if (typeof part === "number") {
        var charCode = writeTable[curAddr - 1] + 1;
        for (var l = 0; l < part; l++)
          writeTable[curAddr++] = charCode++;
      } else
        throw new Error("Incorrect type '" + typeof part + "' given in " + this.encodingName + " at chunk " + chunk[0]);
    }
    if (curAddr > 255)
      throw new Error("Incorrect chunk in " + this.encodingName + " at addr " + chunk[0] + ": too long" + curAddr);
  };
  DBCSCodec.prototype._getEncodeBucket = function(uCode) {
    var high = uCode >> 8;
    if (this.encodeTable[high] === void 0)
      this.encodeTable[high] = UNASSIGNED_NODE.slice(0);
    return this.encodeTable[high];
  };
  DBCSCodec.prototype._setEncodeChar = function(uCode, dbcsCode) {
    var bucket = this._getEncodeBucket(uCode);
    var low = uCode & 255;
    if (bucket[low] <= SEQ_START)
      this.encodeTableSeq[SEQ_START - bucket[low]][DEF_CHAR] = dbcsCode;
    else if (bucket[low] == UNASSIGNED)
      bucket[low] = dbcsCode;
  };
  DBCSCodec.prototype._setEncodeSequence = function(seq, dbcsCode) {
    var uCode = seq[0];
    var bucket = this._getEncodeBucket(uCode);
    var low = uCode & 255;
    var node;
    if (bucket[low] <= SEQ_START) {
      node = this.encodeTableSeq[SEQ_START - bucket[low]];
    } else {
      node = {};
      if (bucket[low] !== UNASSIGNED) node[DEF_CHAR] = bucket[low];
      bucket[low] = SEQ_START - this.encodeTableSeq.length;
      this.encodeTableSeq.push(node);
    }
    for (var j = 1; j < seq.length - 1; j++) {
      var oldVal = node[uCode];
      if (typeof oldVal === "object")
        node = oldVal;
      else {
        node = node[uCode] = {};
        if (oldVal !== void 0)
          node[DEF_CHAR] = oldVal;
      }
    }
    uCode = seq[seq.length - 1];
    node[uCode] = dbcsCode;
  };
  DBCSCodec.prototype._fillEncodeTable = function(nodeIdx, prefix, skipEncodeChars) {
    var node = this.decodeTables[nodeIdx];
    for (var i2 = 0; i2 < 256; i2++) {
      var uCode = node[i2];
      var mbCode = prefix + i2;
      if (skipEncodeChars[mbCode])
        continue;
      if (uCode >= 0)
        this._setEncodeChar(uCode, mbCode);
      else if (uCode <= NODE_START)
        this._fillEncodeTable(NODE_START - uCode, mbCode << 8, skipEncodeChars);
      else if (uCode <= SEQ_START)
        this._setEncodeSequence(this.decodeTableSeq[SEQ_START - uCode], mbCode);
    }
  };
  function DBCSEncoder(options, codec) {
    this.leadSurrogate = -1;
    this.seqObj = void 0;
    this.encodeTable = codec.encodeTable;
    this.encodeTableSeq = codec.encodeTableSeq;
    this.defaultCharSingleByte = codec.defCharSB;
    this.gb18030 = codec.gb18030;
  }
  DBCSEncoder.prototype.write = function(str) {
    var newBuf = Buffer2.alloc(str.length * (this.gb18030 ? 4 : 3)), leadSurrogate = this.leadSurrogate, seqObj = this.seqObj, nextChar = -1, i2 = 0, j = 0;
    while (true) {
      if (nextChar === -1) {
        if (i2 == str.length) break;
        var uCode = str.charCodeAt(i2++);
      } else {
        var uCode = nextChar;
        nextChar = -1;
      }
      if (55296 <= uCode && uCode < 57344) {
        if (uCode < 56320) {
          if (leadSurrogate === -1) {
            leadSurrogate = uCode;
            continue;
          } else {
            leadSurrogate = uCode;
            uCode = UNASSIGNED;
          }
        } else {
          if (leadSurrogate !== -1) {
            uCode = 65536 + (leadSurrogate - 55296) * 1024 + (uCode - 56320);
            leadSurrogate = -1;
          } else {
            uCode = UNASSIGNED;
          }
        }
      } else if (leadSurrogate !== -1) {
        nextChar = uCode;
        uCode = UNASSIGNED;
        leadSurrogate = -1;
      }
      var dbcsCode = UNASSIGNED;
      if (seqObj !== void 0 && uCode != UNASSIGNED) {
        var resCode = seqObj[uCode];
        if (typeof resCode === "object") {
          seqObj = resCode;
          continue;
        } else if (typeof resCode == "number") {
          dbcsCode = resCode;
        } else if (resCode == void 0) {
          resCode = seqObj[DEF_CHAR];
          if (resCode !== void 0) {
            dbcsCode = resCode;
            nextChar = uCode;
          }
        }
        seqObj = void 0;
      } else if (uCode >= 0) {
        var subtable = this.encodeTable[uCode >> 8];
        if (subtable !== void 0)
          dbcsCode = subtable[uCode & 255];
        if (dbcsCode <= SEQ_START) {
          seqObj = this.encodeTableSeq[SEQ_START - dbcsCode];
          continue;
        }
        if (dbcsCode == UNASSIGNED && this.gb18030) {
          var idx = findIdx(this.gb18030.uChars, uCode);
          if (idx != -1) {
            var dbcsCode = this.gb18030.gbChars[idx] + (uCode - this.gb18030.uChars[idx]);
            newBuf[j++] = 129 + Math.floor(dbcsCode / 12600);
            dbcsCode = dbcsCode % 12600;
            newBuf[j++] = 48 + Math.floor(dbcsCode / 1260);
            dbcsCode = dbcsCode % 1260;
            newBuf[j++] = 129 + Math.floor(dbcsCode / 10);
            dbcsCode = dbcsCode % 10;
            newBuf[j++] = 48 + dbcsCode;
            continue;
          }
        }
      }
      if (dbcsCode === UNASSIGNED)
        dbcsCode = this.defaultCharSingleByte;
      if (dbcsCode < 256) {
        newBuf[j++] = dbcsCode;
      } else if (dbcsCode < 65536) {
        newBuf[j++] = dbcsCode >> 8;
        newBuf[j++] = dbcsCode & 255;
      } else {
        newBuf[j++] = dbcsCode >> 16;
        newBuf[j++] = dbcsCode >> 8 & 255;
        newBuf[j++] = dbcsCode & 255;
      }
    }
    this.seqObj = seqObj;
    this.leadSurrogate = leadSurrogate;
    return newBuf.slice(0, j);
  };
  DBCSEncoder.prototype.end = function() {
    if (this.leadSurrogate === -1 && this.seqObj === void 0)
      return;
    var newBuf = Buffer2.alloc(10), j = 0;
    if (this.seqObj) {
      var dbcsCode = this.seqObj[DEF_CHAR];
      if (dbcsCode !== void 0) {
        if (dbcsCode < 256) {
          newBuf[j++] = dbcsCode;
        } else {
          newBuf[j++] = dbcsCode >> 8;
          newBuf[j++] = dbcsCode & 255;
        }
      }
      this.seqObj = void 0;
    }
    if (this.leadSurrogate !== -1) {
      newBuf[j++] = this.defaultCharSingleByte;
      this.leadSurrogate = -1;
    }
    return newBuf.slice(0, j);
  };
  DBCSEncoder.prototype.findIdx = findIdx;
  function DBCSDecoder(options, codec) {
    this.nodeIdx = 0;
    this.prevBuf = Buffer2.alloc(0);
    this.decodeTables = codec.decodeTables;
    this.decodeTableSeq = codec.decodeTableSeq;
    this.defaultCharUnicode = codec.defaultCharUnicode;
    this.gb18030 = codec.gb18030;
  }
  DBCSDecoder.prototype.write = function(buf) {
    var newBuf = Buffer2.alloc(buf.length * 2), nodeIdx = this.nodeIdx, prevBuf = this.prevBuf, prevBufOffset = this.prevBuf.length, seqStart = -this.prevBuf.length, uCode;
    if (prevBufOffset > 0)
      prevBuf = Buffer2.concat([prevBuf, buf.slice(0, 10)]);
    for (var i2 = 0, j = 0; i2 < buf.length; i2++) {
      var curByte = i2 >= 0 ? buf[i2] : prevBuf[i2 + prevBufOffset];
      var uCode = this.decodeTables[nodeIdx][curByte];
      if (uCode >= 0) ;
      else if (uCode === UNASSIGNED) {
        i2 = seqStart;
        uCode = this.defaultCharUnicode.charCodeAt(0);
      } else if (uCode === GB18030_CODE) {
        var curSeq = seqStart >= 0 ? buf.slice(seqStart, i2 + 1) : prevBuf.slice(seqStart + prevBufOffset, i2 + 1 + prevBufOffset);
        var ptr = (curSeq[0] - 129) * 12600 + (curSeq[1] - 48) * 1260 + (curSeq[2] - 129) * 10 + (curSeq[3] - 48);
        var idx = findIdx(this.gb18030.gbChars, ptr);
        uCode = this.gb18030.uChars[idx] + ptr - this.gb18030.gbChars[idx];
      } else if (uCode <= NODE_START) {
        nodeIdx = NODE_START - uCode;
        continue;
      } else if (uCode <= SEQ_START) {
        var seq = this.decodeTableSeq[SEQ_START - uCode];
        for (var k = 0; k < seq.length - 1; k++) {
          uCode = seq[k];
          newBuf[j++] = uCode & 255;
          newBuf[j++] = uCode >> 8;
        }
        uCode = seq[seq.length - 1];
      } else
        throw new Error("iconv-lite internal error: invalid decoding table value " + uCode + " at " + nodeIdx + "/" + curByte);
      if (uCode > 65535) {
        uCode -= 65536;
        var uCodeLead = 55296 + Math.floor(uCode / 1024);
        newBuf[j++] = uCodeLead & 255;
        newBuf[j++] = uCodeLead >> 8;
        uCode = 56320 + uCode % 1024;
      }
      newBuf[j++] = uCode & 255;
      newBuf[j++] = uCode >> 8;
      nodeIdx = 0;
      seqStart = i2 + 1;
    }
    this.nodeIdx = nodeIdx;
    this.prevBuf = seqStart >= 0 ? buf.slice(seqStart) : prevBuf.slice(seqStart + prevBufOffset);
    return newBuf.slice(0, j).toString("ucs2");
  };
  DBCSDecoder.prototype.end = function() {
    var ret = "";
    while (this.prevBuf.length > 0) {
      ret += this.defaultCharUnicode;
      var buf = this.prevBuf.slice(1);
      this.prevBuf = Buffer2.alloc(0);
      this.nodeIdx = 0;
      if (buf.length > 0)
        ret += this.write(buf);
    }
    this.nodeIdx = 0;
    return ret;
  };
  function findIdx(table, val) {
    if (table[0] > val)
      return -1;
    var l = 0, r = table.length;
    while (l < r - 1) {
      var mid = l + Math.floor((r - l + 1) / 2);
      if (table[mid] <= val)
        l = mid;
      else
        r = mid;
    }
    return l;
  }
  return dbcsCodec;
}
const require$$0 = [
  [
    "0",
    "\0",
    128
  ],
  [
    "a1",
    "｡",
    62
  ],
  [
    "8140",
    "　、。，．・：；？！゛゜´｀¨＾￣＿ヽヾゝゞ〃仝々〆〇ー―‐／＼～∥｜…‥‘’“”（）〔〕［］｛｝〈",
    9,
    "＋－±×"
  ],
  [
    "8180",
    "÷＝≠＜＞≦≧∞∴♂♀°′″℃￥＄￠￡％＃＆＊＠§☆★○●◎◇◆□■△▲▽▼※〒→←↑↓〓"
  ],
  [
    "81b8",
    "∈∋⊆⊇⊂⊃∪∩"
  ],
  [
    "81c8",
    "∧∨￢⇒⇔∀∃"
  ],
  [
    "81da",
    "∠⊥⌒∂∇≡≒≪≫√∽∝∵∫∬"
  ],
  [
    "81f0",
    "Å‰♯♭♪†‡¶"
  ],
  [
    "81fc",
    "◯"
  ],
  [
    "824f",
    "０",
    9
  ],
  [
    "8260",
    "Ａ",
    25
  ],
  [
    "8281",
    "ａ",
    25
  ],
  [
    "829f",
    "ぁ",
    82
  ],
  [
    "8340",
    "ァ",
    62
  ],
  [
    "8380",
    "ム",
    22
  ],
  [
    "839f",
    "Α",
    16,
    "Σ",
    6
  ],
  [
    "83bf",
    "α",
    16,
    "σ",
    6
  ],
  [
    "8440",
    "А",
    5,
    "ЁЖ",
    25
  ],
  [
    "8470",
    "а",
    5,
    "ёж",
    7
  ],
  [
    "8480",
    "о",
    17
  ],
  [
    "849f",
    "─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂"
  ],
  [
    "8740",
    "①",
    19,
    "Ⅰ",
    9
  ],
  [
    "875f",
    "㍉㌔㌢㍍㌘㌧㌃㌶㍑㍗㌍㌦㌣㌫㍊㌻㎜㎝㎞㎎㎏㏄㎡"
  ],
  [
    "877e",
    "㍻"
  ],
  [
    "8780",
    "〝〟№㏍℡㊤",
    4,
    "㈱㈲㈹㍾㍽㍼≒≡∫∮∑√⊥∠∟⊿∵∩∪"
  ],
  [
    "889f",
    "亜唖娃阿哀愛挨姶逢葵茜穐悪握渥旭葦芦鯵梓圧斡扱宛姐虻飴絢綾鮎或粟袷安庵按暗案闇鞍杏以伊位依偉囲夷委威尉惟意慰易椅為畏異移維緯胃萎衣謂違遺医井亥域育郁磯一壱溢逸稲茨芋鰯允印咽員因姻引飲淫胤蔭"
  ],
  [
    "8940",
    "院陰隠韻吋右宇烏羽迂雨卯鵜窺丑碓臼渦嘘唄欝蔚鰻姥厩浦瓜閏噂云運雲荏餌叡営嬰影映曳栄永泳洩瑛盈穎頴英衛詠鋭液疫益駅悦謁越閲榎厭円"
  ],
  [
    "8980",
    "園堰奄宴延怨掩援沿演炎焔煙燕猿縁艶苑薗遠鉛鴛塩於汚甥凹央奥往応押旺横欧殴王翁襖鴬鴎黄岡沖荻億屋憶臆桶牡乙俺卸恩温穏音下化仮何伽価佳加可嘉夏嫁家寡科暇果架歌河火珂禍禾稼箇花苛茄荷華菓蝦課嘩貨迦過霞蚊俄峨我牙画臥芽蛾賀雅餓駕介会解回塊壊廻快怪悔恢懐戒拐改"
  ],
  [
    "8a40",
    "魁晦械海灰界皆絵芥蟹開階貝凱劾外咳害崖慨概涯碍蓋街該鎧骸浬馨蛙垣柿蛎鈎劃嚇各廓拡撹格核殻獲確穫覚角赫較郭閣隔革学岳楽額顎掛笠樫"
  ],
  [
    "8a80",
    "橿梶鰍潟割喝恰括活渇滑葛褐轄且鰹叶椛樺鞄株兜竃蒲釜鎌噛鴨栢茅萱粥刈苅瓦乾侃冠寒刊勘勧巻喚堪姦完官寛干幹患感慣憾換敢柑桓棺款歓汗漢澗潅環甘監看竿管簡緩缶翰肝艦莞観諌貫還鑑間閑関陥韓館舘丸含岸巌玩癌眼岩翫贋雁頑顔願企伎危喜器基奇嬉寄岐希幾忌揮机旗既期棋棄"
  ],
  [
    "8b40",
    "機帰毅気汽畿祈季稀紀徽規記貴起軌輝飢騎鬼亀偽儀妓宜戯技擬欺犠疑祇義蟻誼議掬菊鞠吉吃喫桔橘詰砧杵黍却客脚虐逆丘久仇休及吸宮弓急救"
  ],
  [
    "8b80",
    "朽求汲泣灸球究窮笈級糾給旧牛去居巨拒拠挙渠虚許距鋸漁禦魚亨享京供侠僑兇競共凶協匡卿叫喬境峡強彊怯恐恭挟教橋況狂狭矯胸脅興蕎郷鏡響饗驚仰凝尭暁業局曲極玉桐粁僅勤均巾錦斤欣欽琴禁禽筋緊芹菌衿襟謹近金吟銀九倶句区狗玖矩苦躯駆駈駒具愚虞喰空偶寓遇隅串櫛釧屑屈"
  ],
  [
    "8c40",
    "掘窟沓靴轡窪熊隈粂栗繰桑鍬勲君薫訓群軍郡卦袈祁係傾刑兄啓圭珪型契形径恵慶慧憩掲携敬景桂渓畦稽系経継繋罫茎荊蛍計詣警軽頚鶏芸迎鯨"
  ],
  [
    "8c80",
    "劇戟撃激隙桁傑欠決潔穴結血訣月件倹倦健兼券剣喧圏堅嫌建憲懸拳捲検権牽犬献研硯絹県肩見謙賢軒遣鍵険顕験鹸元原厳幻弦減源玄現絃舷言諺限乎個古呼固姑孤己庫弧戸故枯湖狐糊袴股胡菰虎誇跨鈷雇顧鼓五互伍午呉吾娯後御悟梧檎瑚碁語誤護醐乞鯉交佼侯候倖光公功効勾厚口向"
  ],
  [
    "8d40",
    "后喉坑垢好孔孝宏工巧巷幸広庚康弘恒慌抗拘控攻昂晃更杭校梗構江洪浩港溝甲皇硬稿糠紅紘絞綱耕考肯肱腔膏航荒行衡講貢購郊酵鉱砿鋼閤降"
  ],
  [
    "8d80",
    "項香高鴻剛劫号合壕拷濠豪轟麹克刻告国穀酷鵠黒獄漉腰甑忽惚骨狛込此頃今困坤墾婚恨懇昏昆根梱混痕紺艮魂些佐叉唆嵯左差査沙瑳砂詐鎖裟坐座挫債催再最哉塞妻宰彩才採栽歳済災采犀砕砦祭斎細菜裁載際剤在材罪財冴坂阪堺榊肴咲崎埼碕鷺作削咋搾昨朔柵窄策索錯桜鮭笹匙冊刷"
  ],
  [
    "8e40",
    "察拶撮擦札殺薩雑皐鯖捌錆鮫皿晒三傘参山惨撒散桟燦珊産算纂蚕讃賛酸餐斬暫残仕仔伺使刺司史嗣四士始姉姿子屍市師志思指支孜斯施旨枝止"
  ],
  [
    "8e80",
    "死氏獅祉私糸紙紫肢脂至視詞詩試誌諮資賜雌飼歯事似侍児字寺慈持時次滋治爾璽痔磁示而耳自蒔辞汐鹿式識鴫竺軸宍雫七叱執失嫉室悉湿漆疾質実蔀篠偲柴芝屡蕊縞舎写射捨赦斜煮社紗者謝車遮蛇邪借勺尺杓灼爵酌釈錫若寂弱惹主取守手朱殊狩珠種腫趣酒首儒受呪寿授樹綬需囚収周"
  ],
  [
    "8f40",
    "宗就州修愁拾洲秀秋終繍習臭舟蒐衆襲讐蹴輯週酋酬集醜什住充十従戎柔汁渋獣縦重銃叔夙宿淑祝縮粛塾熟出術述俊峻春瞬竣舜駿准循旬楯殉淳"
  ],
  [
    "8f80",
    "準潤盾純巡遵醇順処初所暑曙渚庶緒署書薯藷諸助叙女序徐恕鋤除傷償勝匠升召哨商唱嘗奨妾娼宵将小少尚庄床廠彰承抄招掌捷昇昌昭晶松梢樟樵沼消渉湘焼焦照症省硝礁祥称章笑粧紹肖菖蒋蕉衝裳訟証詔詳象賞醤鉦鍾鐘障鞘上丈丞乗冗剰城場壌嬢常情擾条杖浄状畳穣蒸譲醸錠嘱埴飾"
  ],
  [
    "9040",
    "拭植殖燭織職色触食蝕辱尻伸信侵唇娠寝審心慎振新晋森榛浸深申疹真神秦紳臣芯薪親診身辛進針震人仁刃塵壬尋甚尽腎訊迅陣靭笥諏須酢図厨"
  ],
  [
    "9080",
    "逗吹垂帥推水炊睡粋翠衰遂酔錐錘随瑞髄崇嵩数枢趨雛据杉椙菅頗雀裾澄摺寸世瀬畝是凄制勢姓征性成政整星晴棲栖正清牲生盛精聖声製西誠誓請逝醒青静斉税脆隻席惜戚斥昔析石積籍績脊責赤跡蹟碩切拙接摂折設窃節説雪絶舌蝉仙先千占宣専尖川戦扇撰栓栴泉浅洗染潜煎煽旋穿箭線"
  ],
  [
    "9140",
    "繊羨腺舛船薦詮賎践選遷銭銑閃鮮前善漸然全禅繕膳糎噌塑岨措曾曽楚狙疏疎礎祖租粗素組蘇訴阻遡鼠僧創双叢倉喪壮奏爽宋層匝惣想捜掃挿掻"
  ],
  [
    "9180",
    "操早曹巣槍槽漕燥争痩相窓糟総綜聡草荘葬蒼藻装走送遭鎗霜騒像増憎臓蔵贈造促側則即息捉束測足速俗属賊族続卒袖其揃存孫尊損村遜他多太汰詑唾堕妥惰打柁舵楕陀駄騨体堆対耐岱帯待怠態戴替泰滞胎腿苔袋貸退逮隊黛鯛代台大第醍題鷹滝瀧卓啄宅托択拓沢濯琢託鐸濁諾茸凧蛸只"
  ],
  [
    "9240",
    "叩但達辰奪脱巽竪辿棚谷狸鱈樽誰丹単嘆坦担探旦歎淡湛炭短端箪綻耽胆蛋誕鍛団壇弾断暖檀段男談値知地弛恥智池痴稚置致蜘遅馳築畜竹筑蓄"
  ],
  [
    "9280",
    "逐秩窒茶嫡着中仲宙忠抽昼柱注虫衷註酎鋳駐樗瀦猪苧著貯丁兆凋喋寵帖帳庁弔張彫徴懲挑暢朝潮牒町眺聴脹腸蝶調諜超跳銚長頂鳥勅捗直朕沈珍賃鎮陳津墜椎槌追鎚痛通塚栂掴槻佃漬柘辻蔦綴鍔椿潰坪壷嬬紬爪吊釣鶴亭低停偵剃貞呈堤定帝底庭廷弟悌抵挺提梯汀碇禎程締艇訂諦蹄逓"
  ],
  [
    "9340",
    "邸鄭釘鼎泥摘擢敵滴的笛適鏑溺哲徹撤轍迭鉄典填天展店添纏甜貼転顛点伝殿澱田電兎吐堵塗妬屠徒斗杜渡登菟賭途都鍍砥砺努度土奴怒倒党冬"
  ],
  [
    "9380",
    "凍刀唐塔塘套宕島嶋悼投搭東桃梼棟盗淘湯涛灯燈当痘祷等答筒糖統到董蕩藤討謄豆踏逃透鐙陶頭騰闘働動同堂導憧撞洞瞳童胴萄道銅峠鴇匿得徳涜特督禿篤毒独読栃橡凸突椴届鳶苫寅酉瀞噸屯惇敦沌豚遁頓呑曇鈍奈那内乍凪薙謎灘捺鍋楢馴縄畷南楠軟難汝二尼弐迩匂賑肉虹廿日乳入"
  ],
  [
    "9440",
    "如尿韮任妊忍認濡禰祢寧葱猫熱年念捻撚燃粘乃廼之埜嚢悩濃納能脳膿農覗蚤巴把播覇杷波派琶破婆罵芭馬俳廃拝排敗杯盃牌背肺輩配倍培媒梅"
  ],
  [
    "9480",
    "楳煤狽買売賠陪這蝿秤矧萩伯剥博拍柏泊白箔粕舶薄迫曝漠爆縛莫駁麦函箱硲箸肇筈櫨幡肌畑畠八鉢溌発醗髪伐罰抜筏閥鳩噺塙蛤隼伴判半反叛帆搬斑板氾汎版犯班畔繁般藩販範釆煩頒飯挽晩番盤磐蕃蛮匪卑否妃庇彼悲扉批披斐比泌疲皮碑秘緋罷肥被誹費避非飛樋簸備尾微枇毘琵眉美"
  ],
  [
    "9540",
    "鼻柊稗匹疋髭彦膝菱肘弼必畢筆逼桧姫媛紐百謬俵彪標氷漂瓢票表評豹廟描病秒苗錨鋲蒜蛭鰭品彬斌浜瀕貧賓頻敏瓶不付埠夫婦富冨布府怖扶敷"
  ],
  [
    "9580",
    "斧普浮父符腐膚芙譜負賦赴阜附侮撫武舞葡蕪部封楓風葺蕗伏副復幅服福腹複覆淵弗払沸仏物鮒分吻噴墳憤扮焚奮粉糞紛雰文聞丙併兵塀幣平弊柄並蔽閉陛米頁僻壁癖碧別瞥蔑箆偏変片篇編辺返遍便勉娩弁鞭保舗鋪圃捕歩甫補輔穂募墓慕戊暮母簿菩倣俸包呆報奉宝峰峯崩庖抱捧放方朋"
  ],
  [
    "9640",
    "法泡烹砲縫胞芳萌蓬蜂褒訪豊邦鋒飽鳳鵬乏亡傍剖坊妨帽忘忙房暴望某棒冒紡肪膨謀貌貿鉾防吠頬北僕卜墨撲朴牧睦穆釦勃没殆堀幌奔本翻凡盆"
  ],
  [
    "9680",
    "摩磨魔麻埋妹昧枚毎哩槙幕膜枕鮪柾鱒桝亦俣又抹末沫迄侭繭麿万慢満漫蔓味未魅巳箕岬密蜜湊蓑稔脈妙粍民眠務夢無牟矛霧鵡椋婿娘冥名命明盟迷銘鳴姪牝滅免棉綿緬面麺摸模茂妄孟毛猛盲網耗蒙儲木黙目杢勿餅尤戻籾貰問悶紋門匁也冶夜爺耶野弥矢厄役約薬訳躍靖柳薮鑓愉愈油癒"
  ],
  [
    "9740",
    "諭輸唯佑優勇友宥幽悠憂揖有柚湧涌猶猷由祐裕誘遊邑郵雄融夕予余与誉輿預傭幼妖容庸揚揺擁曜楊様洋溶熔用窯羊耀葉蓉要謡踊遥陽養慾抑欲"
  ],
  [
    "9780",
    "沃浴翌翼淀羅螺裸来莱頼雷洛絡落酪乱卵嵐欄濫藍蘭覧利吏履李梨理璃痢裏裡里離陸律率立葎掠略劉流溜琉留硫粒隆竜龍侶慮旅虜了亮僚両凌寮料梁涼猟療瞭稜糧良諒遼量陵領力緑倫厘林淋燐琳臨輪隣鱗麟瑠塁涙累類令伶例冷励嶺怜玲礼苓鈴隷零霊麗齢暦歴列劣烈裂廉恋憐漣煉簾練聯"
  ],
  [
    "9840",
    "蓮連錬呂魯櫓炉賂路露労婁廊弄朗楼榔浪漏牢狼篭老聾蝋郎六麓禄肋録論倭和話歪賄脇惑枠鷲亙亘鰐詫藁蕨椀湾碗腕"
  ],
  [
    "989f",
    "弌丐丕个丱丶丼丿乂乖乘亂亅豫亊舒弍于亞亟亠亢亰亳亶从仍仄仆仂仗仞仭仟价伉佚估佛佝佗佇佶侈侏侘佻佩佰侑佯來侖儘俔俟俎俘俛俑俚俐俤俥倚倨倔倪倥倅伜俶倡倩倬俾俯們倆偃假會偕偐偈做偖偬偸傀傚傅傴傲"
  ],
  [
    "9940",
    "僉僊傳僂僖僞僥僭僣僮價僵儉儁儂儖儕儔儚儡儺儷儼儻儿兀兒兌兔兢竸兩兪兮冀冂囘册冉冏冑冓冕冖冤冦冢冩冪冫决冱冲冰况冽凅凉凛几處凩凭"
  ],
  [
    "9980",
    "凰凵凾刄刋刔刎刧刪刮刳刹剏剄剋剌剞剔剪剴剩剳剿剽劍劔劒剱劈劑辨辧劬劭劼劵勁勍勗勞勣勦飭勠勳勵勸勹匆匈甸匍匐匏匕匚匣匯匱匳匸區卆卅丗卉卍凖卞卩卮夘卻卷厂厖厠厦厥厮厰厶參簒雙叟曼燮叮叨叭叺吁吽呀听吭吼吮吶吩吝呎咏呵咎呟呱呷呰咒呻咀呶咄咐咆哇咢咸咥咬哄哈咨"
  ],
  [
    "9a40",
    "咫哂咤咾咼哘哥哦唏唔哽哮哭哺哢唹啀啣啌售啜啅啖啗唸唳啝喙喀咯喊喟啻啾喘喞單啼喃喩喇喨嗚嗅嗟嗄嗜嗤嗔嘔嗷嘖嗾嗽嘛嗹噎噐營嘴嘶嘲嘸"
  ],
  [
    "9a80",
    "噫噤嘯噬噪嚆嚀嚊嚠嚔嚏嚥嚮嚶嚴囂嚼囁囃囀囈囎囑囓囗囮囹圀囿圄圉圈國圍圓團圖嗇圜圦圷圸坎圻址坏坩埀垈坡坿垉垓垠垳垤垪垰埃埆埔埒埓堊埖埣堋堙堝塲堡塢塋塰毀塒堽塹墅墹墟墫墺壞墻墸墮壅壓壑壗壙壘壥壜壤壟壯壺壹壻壼壽夂夊夐夛梦夥夬夭夲夸夾竒奕奐奎奚奘奢奠奧奬奩"
  ],
  [
    "9b40",
    "奸妁妝佞侫妣妲姆姨姜妍姙姚娥娟娑娜娉娚婀婬婉娵娶婢婪媚媼媾嫋嫂媽嫣嫗嫦嫩嫖嫺嫻嬌嬋嬖嬲嫐嬪嬶嬾孃孅孀孑孕孚孛孥孩孰孳孵學斈孺宀"
  ],
  [
    "9b80",
    "它宦宸寃寇寉寔寐寤實寢寞寥寫寰寶寳尅將專對尓尠尢尨尸尹屁屆屎屓屐屏孱屬屮乢屶屹岌岑岔妛岫岻岶岼岷峅岾峇峙峩峽峺峭嶌峪崋崕崗嵜崟崛崑崔崢崚崙崘嵌嵒嵎嵋嵬嵳嵶嶇嶄嶂嶢嶝嶬嶮嶽嶐嶷嶼巉巍巓巒巖巛巫已巵帋帚帙帑帛帶帷幄幃幀幎幗幔幟幢幤幇幵并幺麼广庠廁廂廈廐廏"
  ],
  [
    "9c40",
    "廖廣廝廚廛廢廡廨廩廬廱廳廰廴廸廾弃弉彝彜弋弑弖弩弭弸彁彈彌彎弯彑彖彗彙彡彭彳彷徃徂彿徊很徑徇從徙徘徠徨徭徼忖忻忤忸忱忝悳忿怡恠"
  ],
  [
    "9c80",
    "怙怐怩怎怱怛怕怫怦怏怺恚恁恪恷恟恊恆恍恣恃恤恂恬恫恙悁悍惧悃悚悄悛悖悗悒悧悋惡悸惠惓悴忰悽惆悵惘慍愕愆惶惷愀惴惺愃愡惻惱愍愎慇愾愨愧慊愿愼愬愴愽慂慄慳慷慘慙慚慫慴慯慥慱慟慝慓慵憙憖憇憬憔憚憊憑憫憮懌懊應懷懈懃懆憺懋罹懍懦懣懶懺懴懿懽懼懾戀戈戉戍戌戔戛"
  ],
  [
    "9d40",
    "戞戡截戮戰戲戳扁扎扞扣扛扠扨扼抂抉找抒抓抖拔抃抔拗拑抻拏拿拆擔拈拜拌拊拂拇抛拉挌拮拱挧挂挈拯拵捐挾捍搜捏掖掎掀掫捶掣掏掉掟掵捫"
  ],
  [
    "9d80",
    "捩掾揩揀揆揣揉插揶揄搖搴搆搓搦搶攝搗搨搏摧摯摶摎攪撕撓撥撩撈撼據擒擅擇撻擘擂擱擧舉擠擡抬擣擯攬擶擴擲擺攀擽攘攜攅攤攣攫攴攵攷收攸畋效敖敕敍敘敞敝敲數斂斃變斛斟斫斷旃旆旁旄旌旒旛旙无旡旱杲昊昃旻杳昵昶昴昜晏晄晉晁晞晝晤晧晨晟晢晰暃暈暎暉暄暘暝曁暹曉暾暼"
  ],
  [
    "9e40",
    "曄暸曖曚曠昿曦曩曰曵曷朏朖朞朦朧霸朮朿朶杁朸朷杆杞杠杙杣杤枉杰枩杼杪枌枋枦枡枅枷柯枴柬枳柩枸柤柞柝柢柮枹柎柆柧檜栞框栩桀桍栲桎"
  ],
  [
    "9e80",
    "梳栫桙档桷桿梟梏梭梔條梛梃檮梹桴梵梠梺椏梍桾椁棊椈棘椢椦棡椌棍棔棧棕椶椒椄棗棣椥棹棠棯椨椪椚椣椡棆楹楷楜楸楫楔楾楮椹楴椽楙椰楡楞楝榁楪榲榮槐榿槁槓榾槎寨槊槝榻槃榧樮榑榠榜榕榴槞槨樂樛槿權槹槲槧樅榱樞槭樔槫樊樒櫁樣樓橄樌橲樶橸橇橢橙橦橈樸樢檐檍檠檄檢檣"
  ],
  [
    "9f40",
    "檗蘗檻櫃櫂檸檳檬櫞櫑櫟檪櫚櫪櫻欅蘖櫺欒欖鬱欟欸欷盜欹飮歇歃歉歐歙歔歛歟歡歸歹歿殀殄殃殍殘殕殞殤殪殫殯殲殱殳殷殼毆毋毓毟毬毫毳毯"
  ],
  [
    "9f80",
    "麾氈氓气氛氤氣汞汕汢汪沂沍沚沁沛汾汨汳沒沐泄泱泓沽泗泅泝沮沱沾沺泛泯泙泪洟衍洶洫洽洸洙洵洳洒洌浣涓浤浚浹浙涎涕濤涅淹渕渊涵淇淦涸淆淬淞淌淨淒淅淺淙淤淕淪淮渭湮渮渙湲湟渾渣湫渫湶湍渟湃渺湎渤滿渝游溂溪溘滉溷滓溽溯滄溲滔滕溏溥滂溟潁漑灌滬滸滾漿滲漱滯漲滌"
  ],
  [
    "e040",
    "漾漓滷澆潺潸澁澀潯潛濳潭澂潼潘澎澑濂潦澳澣澡澤澹濆澪濟濕濬濔濘濱濮濛瀉瀋濺瀑瀁瀏濾瀛瀚潴瀝瀘瀟瀰瀾瀲灑灣炙炒炯烱炬炸炳炮烟烋烝"
  ],
  [
    "e080",
    "烙焉烽焜焙煥煕熈煦煢煌煖煬熏燻熄熕熨熬燗熹熾燒燉燔燎燠燬燧燵燼燹燿爍爐爛爨爭爬爰爲爻爼爿牀牆牋牘牴牾犂犁犇犒犖犢犧犹犲狃狆狄狎狒狢狠狡狹狷倏猗猊猜猖猝猴猯猩猥猾獎獏默獗獪獨獰獸獵獻獺珈玳珎玻珀珥珮珞璢琅瑯琥珸琲琺瑕琿瑟瑙瑁瑜瑩瑰瑣瑪瑶瑾璋璞璧瓊瓏瓔珱"
  ],
  [
    "e140",
    "瓠瓣瓧瓩瓮瓲瓰瓱瓸瓷甄甃甅甌甎甍甕甓甞甦甬甼畄畍畊畉畛畆畚畩畤畧畫畭畸當疆疇畴疊疉疂疔疚疝疥疣痂疳痃疵疽疸疼疱痍痊痒痙痣痞痾痿"
  ],
  [
    "e180",
    "痼瘁痰痺痲痳瘋瘍瘉瘟瘧瘠瘡瘢瘤瘴瘰瘻癇癈癆癜癘癡癢癨癩癪癧癬癰癲癶癸發皀皃皈皋皎皖皓皙皚皰皴皸皹皺盂盍盖盒盞盡盥盧盪蘯盻眈眇眄眩眤眞眥眦眛眷眸睇睚睨睫睛睥睿睾睹瞎瞋瞑瞠瞞瞰瞶瞹瞿瞼瞽瞻矇矍矗矚矜矣矮矼砌砒礦砠礪硅碎硴碆硼碚碌碣碵碪碯磑磆磋磔碾碼磅磊磬"
  ],
  [
    "e240",
    "磧磚磽磴礇礒礑礙礬礫祀祠祗祟祚祕祓祺祿禊禝禧齋禪禮禳禹禺秉秕秧秬秡秣稈稍稘稙稠稟禀稱稻稾稷穃穗穉穡穢穩龝穰穹穽窈窗窕窘窖窩竈窰"
  ],
  [
    "e280",
    "窶竅竄窿邃竇竊竍竏竕竓站竚竝竡竢竦竭竰笂笏笊笆笳笘笙笞笵笨笶筐筺笄筍笋筌筅筵筥筴筧筰筱筬筮箝箘箟箍箜箚箋箒箏筝箙篋篁篌篏箴篆篝篩簑簔篦篥籠簀簇簓篳篷簗簍篶簣簧簪簟簷簫簽籌籃籔籏籀籐籘籟籤籖籥籬籵粃粐粤粭粢粫粡粨粳粲粱粮粹粽糀糅糂糘糒糜糢鬻糯糲糴糶糺紆"
  ],
  [
    "e340",
    "紂紜紕紊絅絋紮紲紿紵絆絳絖絎絲絨絮絏絣經綉絛綏絽綛綺綮綣綵緇綽綫總綢綯緜綸綟綰緘緝緤緞緻緲緡縅縊縣縡縒縱縟縉縋縢繆繦縻縵縹繃縷"
  ],
  [
    "e380",
    "縲縺繧繝繖繞繙繚繹繪繩繼繻纃緕繽辮繿纈纉續纒纐纓纔纖纎纛纜缸缺罅罌罍罎罐网罕罔罘罟罠罨罩罧罸羂羆羃羈羇羌羔羞羝羚羣羯羲羹羮羶羸譱翅翆翊翕翔翡翦翩翳翹飜耆耄耋耒耘耙耜耡耨耿耻聊聆聒聘聚聟聢聨聳聲聰聶聹聽聿肄肆肅肛肓肚肭冐肬胛胥胙胝胄胚胖脉胯胱脛脩脣脯腋"
  ],
  [
    "e440",
    "隋腆脾腓腑胼腱腮腥腦腴膃膈膊膀膂膠膕膤膣腟膓膩膰膵膾膸膽臀臂膺臉臍臑臙臘臈臚臟臠臧臺臻臾舁舂舅與舊舍舐舖舩舫舸舳艀艙艘艝艚艟艤"
  ],
  [
    "e480",
    "艢艨艪艫舮艱艷艸艾芍芒芫芟芻芬苡苣苟苒苴苳苺莓范苻苹苞茆苜茉苙茵茴茖茲茱荀茹荐荅茯茫茗茘莅莚莪莟莢莖茣莎莇莊荼莵荳荵莠莉莨菴萓菫菎菽萃菘萋菁菷萇菠菲萍萢萠莽萸蔆菻葭萪萼蕚蒄葷葫蒭葮蒂葩葆萬葯葹萵蓊葢蒹蒿蒟蓙蓍蒻蓚蓐蓁蓆蓖蒡蔡蓿蓴蔗蔘蔬蔟蔕蔔蓼蕀蕣蕘蕈"
  ],
  [
    "e540",
    "蕁蘂蕋蕕薀薤薈薑薊薨蕭薔薛藪薇薜蕷蕾薐藉薺藏薹藐藕藝藥藜藹蘊蘓蘋藾藺蘆蘢蘚蘰蘿虍乕虔號虧虱蚓蚣蚩蚪蚋蚌蚶蚯蛄蛆蚰蛉蠣蚫蛔蛞蛩蛬"
  ],
  [
    "e580",
    "蛟蛛蛯蜒蜆蜈蜀蜃蛻蜑蜉蜍蛹蜊蜴蜿蜷蜻蜥蜩蜚蝠蝟蝸蝌蝎蝴蝗蝨蝮蝙蝓蝣蝪蠅螢螟螂螯蟋螽蟀蟐雖螫蟄螳蟇蟆螻蟯蟲蟠蠏蠍蟾蟶蟷蠎蟒蠑蠖蠕蠢蠡蠱蠶蠹蠧蠻衄衂衒衙衞衢衫袁衾袞衵衽袵衲袂袗袒袮袙袢袍袤袰袿袱裃裄裔裘裙裝裹褂裼裴裨裲褄褌褊褓襃褞褥褪褫襁襄褻褶褸襌褝襠襞"
  ],
  [
    "e640",
    "襦襤襭襪襯襴襷襾覃覈覊覓覘覡覩覦覬覯覲覺覽覿觀觚觜觝觧觴觸訃訖訐訌訛訝訥訶詁詛詒詆詈詼詭詬詢誅誂誄誨誡誑誥誦誚誣諄諍諂諚諫諳諧"
  ],
  [
    "e680",
    "諤諱謔諠諢諷諞諛謌謇謚諡謖謐謗謠謳鞫謦謫謾謨譁譌譏譎證譖譛譚譫譟譬譯譴譽讀讌讎讒讓讖讙讚谺豁谿豈豌豎豐豕豢豬豸豺貂貉貅貊貍貎貔豼貘戝貭貪貽貲貳貮貶賈賁賤賣賚賽賺賻贄贅贊贇贏贍贐齎贓賍贔贖赧赭赱赳趁趙跂趾趺跏跚跖跌跛跋跪跫跟跣跼踈踉跿踝踞踐踟蹂踵踰踴蹊"
  ],
  [
    "e740",
    "蹇蹉蹌蹐蹈蹙蹤蹠踪蹣蹕蹶蹲蹼躁躇躅躄躋躊躓躑躔躙躪躡躬躰軆躱躾軅軈軋軛軣軼軻軫軾輊輅輕輒輙輓輜輟輛輌輦輳輻輹轅轂輾轌轉轆轎轗轜"
  ],
  [
    "e780",
    "轢轣轤辜辟辣辭辯辷迚迥迢迪迯邇迴逅迹迺逑逕逡逍逞逖逋逧逶逵逹迸遏遐遑遒逎遉逾遖遘遞遨遯遶隨遲邂遽邁邀邊邉邏邨邯邱邵郢郤扈郛鄂鄒鄙鄲鄰酊酖酘酣酥酩酳酲醋醉醂醢醫醯醪醵醴醺釀釁釉釋釐釖釟釡釛釼釵釶鈞釿鈔鈬鈕鈑鉞鉗鉅鉉鉤鉈銕鈿鉋鉐銜銖銓銛鉚鋏銹銷鋩錏鋺鍄錮"
  ],
  [
    "e840",
    "錙錢錚錣錺錵錻鍜鍠鍼鍮鍖鎰鎬鎭鎔鎹鏖鏗鏨鏥鏘鏃鏝鏐鏈鏤鐚鐔鐓鐃鐇鐐鐶鐫鐵鐡鐺鑁鑒鑄鑛鑠鑢鑞鑪鈩鑰鑵鑷鑽鑚鑼鑾钁鑿閂閇閊閔閖閘閙"
  ],
  [
    "e880",
    "閠閨閧閭閼閻閹閾闊濶闃闍闌闕闔闖關闡闥闢阡阨阮阯陂陌陏陋陷陜陞陝陟陦陲陬隍隘隕隗險隧隱隲隰隴隶隸隹雎雋雉雍襍雜霍雕雹霄霆霈霓霎霑霏霖霙霤霪霰霹霽霾靄靆靈靂靉靜靠靤靦靨勒靫靱靹鞅靼鞁靺鞆鞋鞏鞐鞜鞨鞦鞣鞳鞴韃韆韈韋韜韭齏韲竟韶韵頏頌頸頤頡頷頽顆顏顋顫顯顰"
  ],
  [
    "e940",
    "顱顴顳颪颯颱颶飄飃飆飩飫餃餉餒餔餘餡餝餞餤餠餬餮餽餾饂饉饅饐饋饑饒饌饕馗馘馥馭馮馼駟駛駝駘駑駭駮駱駲駻駸騁騏騅駢騙騫騷驅驂驀驃"
  ],
  [
    "e980",
    "騾驕驍驛驗驟驢驥驤驩驫驪骭骰骼髀髏髑髓體髞髟髢髣髦髯髫髮髴髱髷髻鬆鬘鬚鬟鬢鬣鬥鬧鬨鬩鬪鬮鬯鬲魄魃魏魍魎魑魘魴鮓鮃鮑鮖鮗鮟鮠鮨鮴鯀鯊鮹鯆鯏鯑鯒鯣鯢鯤鯔鯡鰺鯲鯱鯰鰕鰔鰉鰓鰌鰆鰈鰒鰊鰄鰮鰛鰥鰤鰡鰰鱇鰲鱆鰾鱚鱠鱧鱶鱸鳧鳬鳰鴉鴈鳫鴃鴆鴪鴦鶯鴣鴟鵄鴕鴒鵁鴿鴾鵆鵈"
  ],
  [
    "ea40",
    "鵝鵞鵤鵑鵐鵙鵲鶉鶇鶫鵯鵺鶚鶤鶩鶲鷄鷁鶻鶸鶺鷆鷏鷂鷙鷓鷸鷦鷭鷯鷽鸚鸛鸞鹵鹹鹽麁麈麋麌麒麕麑麝麥麩麸麪麭靡黌黎黏黐黔黜點黝黠黥黨黯"
  ],
  [
    "ea80",
    "黴黶黷黹黻黼黽鼇鼈皷鼕鼡鼬鼾齊齒齔齣齟齠齡齦齧齬齪齷齲齶龕龜龠堯槇遙瑤凜熙"
  ],
  [
    "ed40",
    "纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏"
  ],
  [
    "ed80",
    "塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱"
  ],
  [
    "ee40",
    "犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙"
  ],
  [
    "ee80",
    "蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑"
  ],
  [
    "eeef",
    "ⅰ",
    9,
    "￢￤＇＂"
  ],
  [
    "f040",
    "",
    62
  ],
  [
    "f080",
    "",
    124
  ],
  [
    "f140",
    "",
    62
  ],
  [
    "f180",
    "",
    124
  ],
  [
    "f240",
    "",
    62
  ],
  [
    "f280",
    "",
    124
  ],
  [
    "f340",
    "",
    62
  ],
  [
    "f380",
    "",
    124
  ],
  [
    "f440",
    "",
    62
  ],
  [
    "f480",
    "",
    124
  ],
  [
    "f540",
    "",
    62
  ],
  [
    "f580",
    "",
    124
  ],
  [
    "f640",
    "",
    62
  ],
  [
    "f680",
    "",
    124
  ],
  [
    "f740",
    "",
    62
  ],
  [
    "f780",
    "",
    124
  ],
  [
    "f840",
    "",
    62
  ],
  [
    "f880",
    "",
    124
  ],
  [
    "f940",
    ""
  ],
  [
    "fa40",
    "ⅰ",
    9,
    "Ⅰ",
    9,
    "￢￤＇＂㈱№℡∵纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊"
  ],
  [
    "fa80",
    "兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯"
  ],
  [
    "fb40",
    "涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神"
  ],
  [
    "fb80",
    "祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙"
  ],
  [
    "fc40",
    "髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑"
  ]
];
const require$$1 = /* @__PURE__ */ JSON.parse('[["0","\\u0000",127],["8ea1","｡",62],["a1a1","　、。，．・：；？！゛゜´｀¨＾￣＿ヽヾゝゞ〃仝々〆〇ー―‐／＼～∥｜…‥‘’“”（）〔〕［］｛｝〈",9,"＋－±×÷＝≠＜＞≦≧∞∴♂♀°′″℃￥＄￠￡％＃＆＊＠§☆★○●◎◇"],["a2a1","◆□■△▲▽▼※〒→←↑↓〓"],["a2ba","∈∋⊆⊇⊂⊃∪∩"],["a2ca","∧∨￢⇒⇔∀∃"],["a2dc","∠⊥⌒∂∇≡≒≪≫√∽∝∵∫∬"],["a2f2","Å‰♯♭♪†‡¶"],["a2fe","◯"],["a3b0","０",9],["a3c1","Ａ",25],["a3e1","ａ",25],["a4a1","ぁ",82],["a5a1","ァ",85],["a6a1","Α",16,"Σ",6],["a6c1","α",16,"σ",6],["a7a1","А",5,"ЁЖ",25],["a7d1","а",5,"ёж",25],["a8a1","─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂"],["ada1","①",19,"Ⅰ",9],["adc0","㍉㌔㌢㍍㌘㌧㌃㌶㍑㍗㌍㌦㌣㌫㍊㌻㎜㎝㎞㎎㎏㏄㎡"],["addf","㍻〝〟№㏍℡㊤",4,"㈱㈲㈹㍾㍽㍼≒≡∫∮∑√⊥∠∟⊿∵∩∪"],["b0a1","亜唖娃阿哀愛挨姶逢葵茜穐悪握渥旭葦芦鯵梓圧斡扱宛姐虻飴絢綾鮎或粟袷安庵按暗案闇鞍杏以伊位依偉囲夷委威尉惟意慰易椅為畏異移維緯胃萎衣謂違遺医井亥域育郁磯一壱溢逸稲茨芋鰯允印咽員因姻引飲淫胤蔭"],["b1a1","院陰隠韻吋右宇烏羽迂雨卯鵜窺丑碓臼渦嘘唄欝蔚鰻姥厩浦瓜閏噂云運雲荏餌叡営嬰影映曳栄永泳洩瑛盈穎頴英衛詠鋭液疫益駅悦謁越閲榎厭円園堰奄宴延怨掩援沿演炎焔煙燕猿縁艶苑薗遠鉛鴛塩於汚甥凹央奥往応"],["b2a1","押旺横欧殴王翁襖鴬鴎黄岡沖荻億屋憶臆桶牡乙俺卸恩温穏音下化仮何伽価佳加可嘉夏嫁家寡科暇果架歌河火珂禍禾稼箇花苛茄荷華菓蝦課嘩貨迦過霞蚊俄峨我牙画臥芽蛾賀雅餓駕介会解回塊壊廻快怪悔恢懐戒拐改"],["b3a1","魁晦械海灰界皆絵芥蟹開階貝凱劾外咳害崖慨概涯碍蓋街該鎧骸浬馨蛙垣柿蛎鈎劃嚇各廓拡撹格核殻獲確穫覚角赫較郭閣隔革学岳楽額顎掛笠樫橿梶鰍潟割喝恰括活渇滑葛褐轄且鰹叶椛樺鞄株兜竃蒲釜鎌噛鴨栢茅萱"],["b4a1","粥刈苅瓦乾侃冠寒刊勘勧巻喚堪姦完官寛干幹患感慣憾換敢柑桓棺款歓汗漢澗潅環甘監看竿管簡緩缶翰肝艦莞観諌貫還鑑間閑関陥韓館舘丸含岸巌玩癌眼岩翫贋雁頑顔願企伎危喜器基奇嬉寄岐希幾忌揮机旗既期棋棄"],["b5a1","機帰毅気汽畿祈季稀紀徽規記貴起軌輝飢騎鬼亀偽儀妓宜戯技擬欺犠疑祇義蟻誼議掬菊鞠吉吃喫桔橘詰砧杵黍却客脚虐逆丘久仇休及吸宮弓急救朽求汲泣灸球究窮笈級糾給旧牛去居巨拒拠挙渠虚許距鋸漁禦魚亨享京"],["b6a1","供侠僑兇競共凶協匡卿叫喬境峡強彊怯恐恭挟教橋況狂狭矯胸脅興蕎郷鏡響饗驚仰凝尭暁業局曲極玉桐粁僅勤均巾錦斤欣欽琴禁禽筋緊芹菌衿襟謹近金吟銀九倶句区狗玖矩苦躯駆駈駒具愚虞喰空偶寓遇隅串櫛釧屑屈"],["b7a1","掘窟沓靴轡窪熊隈粂栗繰桑鍬勲君薫訓群軍郡卦袈祁係傾刑兄啓圭珪型契形径恵慶慧憩掲携敬景桂渓畦稽系経継繋罫茎荊蛍計詣警軽頚鶏芸迎鯨劇戟撃激隙桁傑欠決潔穴結血訣月件倹倦健兼券剣喧圏堅嫌建憲懸拳捲"],["b8a1","検権牽犬献研硯絹県肩見謙賢軒遣鍵険顕験鹸元原厳幻弦減源玄現絃舷言諺限乎個古呼固姑孤己庫弧戸故枯湖狐糊袴股胡菰虎誇跨鈷雇顧鼓五互伍午呉吾娯後御悟梧檎瑚碁語誤護醐乞鯉交佼侯候倖光公功効勾厚口向"],["b9a1","后喉坑垢好孔孝宏工巧巷幸広庚康弘恒慌抗拘控攻昂晃更杭校梗構江洪浩港溝甲皇硬稿糠紅紘絞綱耕考肯肱腔膏航荒行衡講貢購郊酵鉱砿鋼閤降項香高鴻剛劫号合壕拷濠豪轟麹克刻告国穀酷鵠黒獄漉腰甑忽惚骨狛込"],["baa1","此頃今困坤墾婚恨懇昏昆根梱混痕紺艮魂些佐叉唆嵯左差査沙瑳砂詐鎖裟坐座挫債催再最哉塞妻宰彩才採栽歳済災采犀砕砦祭斎細菜裁載際剤在材罪財冴坂阪堺榊肴咲崎埼碕鷺作削咋搾昨朔柵窄策索錯桜鮭笹匙冊刷"],["bba1","察拶撮擦札殺薩雑皐鯖捌錆鮫皿晒三傘参山惨撒散桟燦珊産算纂蚕讃賛酸餐斬暫残仕仔伺使刺司史嗣四士始姉姿子屍市師志思指支孜斯施旨枝止死氏獅祉私糸紙紫肢脂至視詞詩試誌諮資賜雌飼歯事似侍児字寺慈持時"],["bca1","次滋治爾璽痔磁示而耳自蒔辞汐鹿式識鴫竺軸宍雫七叱執失嫉室悉湿漆疾質実蔀篠偲柴芝屡蕊縞舎写射捨赦斜煮社紗者謝車遮蛇邪借勺尺杓灼爵酌釈錫若寂弱惹主取守手朱殊狩珠種腫趣酒首儒受呪寿授樹綬需囚収周"],["bda1","宗就州修愁拾洲秀秋終繍習臭舟蒐衆襲讐蹴輯週酋酬集醜什住充十従戎柔汁渋獣縦重銃叔夙宿淑祝縮粛塾熟出術述俊峻春瞬竣舜駿准循旬楯殉淳準潤盾純巡遵醇順処初所暑曙渚庶緒署書薯藷諸助叙女序徐恕鋤除傷償"],["bea1","勝匠升召哨商唱嘗奨妾娼宵将小少尚庄床廠彰承抄招掌捷昇昌昭晶松梢樟樵沼消渉湘焼焦照症省硝礁祥称章笑粧紹肖菖蒋蕉衝裳訟証詔詳象賞醤鉦鍾鐘障鞘上丈丞乗冗剰城場壌嬢常情擾条杖浄状畳穣蒸譲醸錠嘱埴飾"],["bfa1","拭植殖燭織職色触食蝕辱尻伸信侵唇娠寝審心慎振新晋森榛浸深申疹真神秦紳臣芯薪親診身辛進針震人仁刃塵壬尋甚尽腎訊迅陣靭笥諏須酢図厨逗吹垂帥推水炊睡粋翠衰遂酔錐錘随瑞髄崇嵩数枢趨雛据杉椙菅頗雀裾"],["c0a1","澄摺寸世瀬畝是凄制勢姓征性成政整星晴棲栖正清牲生盛精聖声製西誠誓請逝醒青静斉税脆隻席惜戚斥昔析石積籍績脊責赤跡蹟碩切拙接摂折設窃節説雪絶舌蝉仙先千占宣専尖川戦扇撰栓栴泉浅洗染潜煎煽旋穿箭線"],["c1a1","繊羨腺舛船薦詮賎践選遷銭銑閃鮮前善漸然全禅繕膳糎噌塑岨措曾曽楚狙疏疎礎祖租粗素組蘇訴阻遡鼠僧創双叢倉喪壮奏爽宋層匝惣想捜掃挿掻操早曹巣槍槽漕燥争痩相窓糟総綜聡草荘葬蒼藻装走送遭鎗霜騒像増憎"],["c2a1","臓蔵贈造促側則即息捉束測足速俗属賊族続卒袖其揃存孫尊損村遜他多太汰詑唾堕妥惰打柁舵楕陀駄騨体堆対耐岱帯待怠態戴替泰滞胎腿苔袋貸退逮隊黛鯛代台大第醍題鷹滝瀧卓啄宅托択拓沢濯琢託鐸濁諾茸凧蛸只"],["c3a1","叩但達辰奪脱巽竪辿棚谷狸鱈樽誰丹単嘆坦担探旦歎淡湛炭短端箪綻耽胆蛋誕鍛団壇弾断暖檀段男談値知地弛恥智池痴稚置致蜘遅馳築畜竹筑蓄逐秩窒茶嫡着中仲宙忠抽昼柱注虫衷註酎鋳駐樗瀦猪苧著貯丁兆凋喋寵"],["c4a1","帖帳庁弔張彫徴懲挑暢朝潮牒町眺聴脹腸蝶調諜超跳銚長頂鳥勅捗直朕沈珍賃鎮陳津墜椎槌追鎚痛通塚栂掴槻佃漬柘辻蔦綴鍔椿潰坪壷嬬紬爪吊釣鶴亭低停偵剃貞呈堤定帝底庭廷弟悌抵挺提梯汀碇禎程締艇訂諦蹄逓"],["c5a1","邸鄭釘鼎泥摘擢敵滴的笛適鏑溺哲徹撤轍迭鉄典填天展店添纏甜貼転顛点伝殿澱田電兎吐堵塗妬屠徒斗杜渡登菟賭途都鍍砥砺努度土奴怒倒党冬凍刀唐塔塘套宕島嶋悼投搭東桃梼棟盗淘湯涛灯燈当痘祷等答筒糖統到"],["c6a1","董蕩藤討謄豆踏逃透鐙陶頭騰闘働動同堂導憧撞洞瞳童胴萄道銅峠鴇匿得徳涜特督禿篤毒独読栃橡凸突椴届鳶苫寅酉瀞噸屯惇敦沌豚遁頓呑曇鈍奈那内乍凪薙謎灘捺鍋楢馴縄畷南楠軟難汝二尼弐迩匂賑肉虹廿日乳入"],["c7a1","如尿韮任妊忍認濡禰祢寧葱猫熱年念捻撚燃粘乃廼之埜嚢悩濃納能脳膿農覗蚤巴把播覇杷波派琶破婆罵芭馬俳廃拝排敗杯盃牌背肺輩配倍培媒梅楳煤狽買売賠陪這蝿秤矧萩伯剥博拍柏泊白箔粕舶薄迫曝漠爆縛莫駁麦"],["c8a1","函箱硲箸肇筈櫨幡肌畑畠八鉢溌発醗髪伐罰抜筏閥鳩噺塙蛤隼伴判半反叛帆搬斑板氾汎版犯班畔繁般藩販範釆煩頒飯挽晩番盤磐蕃蛮匪卑否妃庇彼悲扉批披斐比泌疲皮碑秘緋罷肥被誹費避非飛樋簸備尾微枇毘琵眉美"],["c9a1","鼻柊稗匹疋髭彦膝菱肘弼必畢筆逼桧姫媛紐百謬俵彪標氷漂瓢票表評豹廟描病秒苗錨鋲蒜蛭鰭品彬斌浜瀕貧賓頻敏瓶不付埠夫婦富冨布府怖扶敷斧普浮父符腐膚芙譜負賦赴阜附侮撫武舞葡蕪部封楓風葺蕗伏副復幅服"],["caa1","福腹複覆淵弗払沸仏物鮒分吻噴墳憤扮焚奮粉糞紛雰文聞丙併兵塀幣平弊柄並蔽閉陛米頁僻壁癖碧別瞥蔑箆偏変片篇編辺返遍便勉娩弁鞭保舗鋪圃捕歩甫補輔穂募墓慕戊暮母簿菩倣俸包呆報奉宝峰峯崩庖抱捧放方朋"],["cba1","法泡烹砲縫胞芳萌蓬蜂褒訪豊邦鋒飽鳳鵬乏亡傍剖坊妨帽忘忙房暴望某棒冒紡肪膨謀貌貿鉾防吠頬北僕卜墨撲朴牧睦穆釦勃没殆堀幌奔本翻凡盆摩磨魔麻埋妹昧枚毎哩槙幕膜枕鮪柾鱒桝亦俣又抹末沫迄侭繭麿万慢満"],["cca1","漫蔓味未魅巳箕岬密蜜湊蓑稔脈妙粍民眠務夢無牟矛霧鵡椋婿娘冥名命明盟迷銘鳴姪牝滅免棉綿緬面麺摸模茂妄孟毛猛盲網耗蒙儲木黙目杢勿餅尤戻籾貰問悶紋門匁也冶夜爺耶野弥矢厄役約薬訳躍靖柳薮鑓愉愈油癒"],["cda1","諭輸唯佑優勇友宥幽悠憂揖有柚湧涌猶猷由祐裕誘遊邑郵雄融夕予余与誉輿預傭幼妖容庸揚揺擁曜楊様洋溶熔用窯羊耀葉蓉要謡踊遥陽養慾抑欲沃浴翌翼淀羅螺裸来莱頼雷洛絡落酪乱卵嵐欄濫藍蘭覧利吏履李梨理璃"],["cea1","痢裏裡里離陸律率立葎掠略劉流溜琉留硫粒隆竜龍侶慮旅虜了亮僚両凌寮料梁涼猟療瞭稜糧良諒遼量陵領力緑倫厘林淋燐琳臨輪隣鱗麟瑠塁涙累類令伶例冷励嶺怜玲礼苓鈴隷零霊麗齢暦歴列劣烈裂廉恋憐漣煉簾練聯"],["cfa1","蓮連錬呂魯櫓炉賂路露労婁廊弄朗楼榔浪漏牢狼篭老聾蝋郎六麓禄肋録論倭和話歪賄脇惑枠鷲亙亘鰐詫藁蕨椀湾碗腕"],["d0a1","弌丐丕个丱丶丼丿乂乖乘亂亅豫亊舒弍于亞亟亠亢亰亳亶从仍仄仆仂仗仞仭仟价伉佚估佛佝佗佇佶侈侏侘佻佩佰侑佯來侖儘俔俟俎俘俛俑俚俐俤俥倚倨倔倪倥倅伜俶倡倩倬俾俯們倆偃假會偕偐偈做偖偬偸傀傚傅傴傲"],["d1a1","僉僊傳僂僖僞僥僭僣僮價僵儉儁儂儖儕儔儚儡儺儷儼儻儿兀兒兌兔兢竸兩兪兮冀冂囘册冉冏冑冓冕冖冤冦冢冩冪冫决冱冲冰况冽凅凉凛几處凩凭凰凵凾刄刋刔刎刧刪刮刳刹剏剄剋剌剞剔剪剴剩剳剿剽劍劔劒剱劈劑辨"],["d2a1","辧劬劭劼劵勁勍勗勞勣勦飭勠勳勵勸勹匆匈甸匍匐匏匕匚匣匯匱匳匸區卆卅丗卉卍凖卞卩卮夘卻卷厂厖厠厦厥厮厰厶參簒雙叟曼燮叮叨叭叺吁吽呀听吭吼吮吶吩吝呎咏呵咎呟呱呷呰咒呻咀呶咄咐咆哇咢咸咥咬哄哈咨"],["d3a1","咫哂咤咾咼哘哥哦唏唔哽哮哭哺哢唹啀啣啌售啜啅啖啗唸唳啝喙喀咯喊喟啻啾喘喞單啼喃喩喇喨嗚嗅嗟嗄嗜嗤嗔嘔嗷嘖嗾嗽嘛嗹噎噐營嘴嘶嘲嘸噫噤嘯噬噪嚆嚀嚊嚠嚔嚏嚥嚮嚶嚴囂嚼囁囃囀囈囎囑囓囗囮囹圀囿圄圉"],["d4a1","圈國圍圓團圖嗇圜圦圷圸坎圻址坏坩埀垈坡坿垉垓垠垳垤垪垰埃埆埔埒埓堊埖埣堋堙堝塲堡塢塋塰毀塒堽塹墅墹墟墫墺壞墻墸墮壅壓壑壗壙壘壥壜壤壟壯壺壹壻壼壽夂夊夐夛梦夥夬夭夲夸夾竒奕奐奎奚奘奢奠奧奬奩"],["d5a1","奸妁妝佞侫妣妲姆姨姜妍姙姚娥娟娑娜娉娚婀婬婉娵娶婢婪媚媼媾嫋嫂媽嫣嫗嫦嫩嫖嫺嫻嬌嬋嬖嬲嫐嬪嬶嬾孃孅孀孑孕孚孛孥孩孰孳孵學斈孺宀它宦宸寃寇寉寔寐寤實寢寞寥寫寰寶寳尅將專對尓尠尢尨尸尹屁屆屎屓"],["d6a1","屐屏孱屬屮乢屶屹岌岑岔妛岫岻岶岼岷峅岾峇峙峩峽峺峭嶌峪崋崕崗嵜崟崛崑崔崢崚崙崘嵌嵒嵎嵋嵬嵳嵶嶇嶄嶂嶢嶝嶬嶮嶽嶐嶷嶼巉巍巓巒巖巛巫已巵帋帚帙帑帛帶帷幄幃幀幎幗幔幟幢幤幇幵并幺麼广庠廁廂廈廐廏"],["d7a1","廖廣廝廚廛廢廡廨廩廬廱廳廰廴廸廾弃弉彝彜弋弑弖弩弭弸彁彈彌彎弯彑彖彗彙彡彭彳彷徃徂彿徊很徑徇從徙徘徠徨徭徼忖忻忤忸忱忝悳忿怡恠怙怐怩怎怱怛怕怫怦怏怺恚恁恪恷恟恊恆恍恣恃恤恂恬恫恙悁悍惧悃悚"],["d8a1","悄悛悖悗悒悧悋惡悸惠惓悴忰悽惆悵惘慍愕愆惶惷愀惴惺愃愡惻惱愍愎慇愾愨愧慊愿愼愬愴愽慂慄慳慷慘慙慚慫慴慯慥慱慟慝慓慵憙憖憇憬憔憚憊憑憫憮懌懊應懷懈懃懆憺懋罹懍懦懣懶懺懴懿懽懼懾戀戈戉戍戌戔戛"],["d9a1","戞戡截戮戰戲戳扁扎扞扣扛扠扨扼抂抉找抒抓抖拔抃抔拗拑抻拏拿拆擔拈拜拌拊拂拇抛拉挌拮拱挧挂挈拯拵捐挾捍搜捏掖掎掀掫捶掣掏掉掟掵捫捩掾揩揀揆揣揉插揶揄搖搴搆搓搦搶攝搗搨搏摧摯摶摎攪撕撓撥撩撈撼"],["daa1","據擒擅擇撻擘擂擱擧舉擠擡抬擣擯攬擶擴擲擺攀擽攘攜攅攤攣攫攴攵攷收攸畋效敖敕敍敘敞敝敲數斂斃變斛斟斫斷旃旆旁旄旌旒旛旙无旡旱杲昊昃旻杳昵昶昴昜晏晄晉晁晞晝晤晧晨晟晢晰暃暈暎暉暄暘暝曁暹曉暾暼"],["dba1","曄暸曖曚曠昿曦曩曰曵曷朏朖朞朦朧霸朮朿朶杁朸朷杆杞杠杙杣杤枉杰枩杼杪枌枋枦枡枅枷柯枴柬枳柩枸柤柞柝柢柮枹柎柆柧檜栞框栩桀桍栲桎梳栫桙档桷桿梟梏梭梔條梛梃檮梹桴梵梠梺椏梍桾椁棊椈棘椢椦棡椌棍"],["dca1","棔棧棕椶椒椄棗棣椥棹棠棯椨椪椚椣椡棆楹楷楜楸楫楔楾楮椹楴椽楙椰楡楞楝榁楪榲榮槐榿槁槓榾槎寨槊槝榻槃榧樮榑榠榜榕榴槞槨樂樛槿權槹槲槧樅榱樞槭樔槫樊樒櫁樣樓橄樌橲樶橸橇橢橙橦橈樸樢檐檍檠檄檢檣"],["dda1","檗蘗檻櫃櫂檸檳檬櫞櫑櫟檪櫚櫪櫻欅蘖櫺欒欖鬱欟欸欷盜欹飮歇歃歉歐歙歔歛歟歡歸歹歿殀殄殃殍殘殕殞殤殪殫殯殲殱殳殷殼毆毋毓毟毬毫毳毯麾氈氓气氛氤氣汞汕汢汪沂沍沚沁沛汾汨汳沒沐泄泱泓沽泗泅泝沮沱沾"],["dea1","沺泛泯泙泪洟衍洶洫洽洸洙洵洳洒洌浣涓浤浚浹浙涎涕濤涅淹渕渊涵淇淦涸淆淬淞淌淨淒淅淺淙淤淕淪淮渭湮渮渙湲湟渾渣湫渫湶湍渟湃渺湎渤滿渝游溂溪溘滉溷滓溽溯滄溲滔滕溏溥滂溟潁漑灌滬滸滾漿滲漱滯漲滌"],["dfa1","漾漓滷澆潺潸澁澀潯潛濳潭澂潼潘澎澑濂潦澳澣澡澤澹濆澪濟濕濬濔濘濱濮濛瀉瀋濺瀑瀁瀏濾瀛瀚潴瀝瀘瀟瀰瀾瀲灑灣炙炒炯烱炬炸炳炮烟烋烝烙焉烽焜焙煥煕熈煦煢煌煖煬熏燻熄熕熨熬燗熹熾燒燉燔燎燠燬燧燵燼"],["e0a1","燹燿爍爐爛爨爭爬爰爲爻爼爿牀牆牋牘牴牾犂犁犇犒犖犢犧犹犲狃狆狄狎狒狢狠狡狹狷倏猗猊猜猖猝猴猯猩猥猾獎獏默獗獪獨獰獸獵獻獺珈玳珎玻珀珥珮珞璢琅瑯琥珸琲琺瑕琿瑟瑙瑁瑜瑩瑰瑣瑪瑶瑾璋璞璧瓊瓏瓔珱"],["e1a1","瓠瓣瓧瓩瓮瓲瓰瓱瓸瓷甄甃甅甌甎甍甕甓甞甦甬甼畄畍畊畉畛畆畚畩畤畧畫畭畸當疆疇畴疊疉疂疔疚疝疥疣痂疳痃疵疽疸疼疱痍痊痒痙痣痞痾痿痼瘁痰痺痲痳瘋瘍瘉瘟瘧瘠瘡瘢瘤瘴瘰瘻癇癈癆癜癘癡癢癨癩癪癧癬癰"],["e2a1","癲癶癸發皀皃皈皋皎皖皓皙皚皰皴皸皹皺盂盍盖盒盞盡盥盧盪蘯盻眈眇眄眩眤眞眥眦眛眷眸睇睚睨睫睛睥睿睾睹瞎瞋瞑瞠瞞瞰瞶瞹瞿瞼瞽瞻矇矍矗矚矜矣矮矼砌砒礦砠礪硅碎硴碆硼碚碌碣碵碪碯磑磆磋磔碾碼磅磊磬"],["e3a1","磧磚磽磴礇礒礑礙礬礫祀祠祗祟祚祕祓祺祿禊禝禧齋禪禮禳禹禺秉秕秧秬秡秣稈稍稘稙稠稟禀稱稻稾稷穃穗穉穡穢穩龝穰穹穽窈窗窕窘窖窩竈窰窶竅竄窿邃竇竊竍竏竕竓站竚竝竡竢竦竭竰笂笏笊笆笳笘笙笞笵笨笶筐"],["e4a1","筺笄筍笋筌筅筵筥筴筧筰筱筬筮箝箘箟箍箜箚箋箒箏筝箙篋篁篌篏箴篆篝篩簑簔篦篥籠簀簇簓篳篷簗簍篶簣簧簪簟簷簫簽籌籃籔籏籀籐籘籟籤籖籥籬籵粃粐粤粭粢粫粡粨粳粲粱粮粹粽糀糅糂糘糒糜糢鬻糯糲糴糶糺紆"],["e5a1","紂紜紕紊絅絋紮紲紿紵絆絳絖絎絲絨絮絏絣經綉絛綏絽綛綺綮綣綵緇綽綫總綢綯緜綸綟綰緘緝緤緞緻緲緡縅縊縣縡縒縱縟縉縋縢繆繦縻縵縹繃縷縲縺繧繝繖繞繙繚繹繪繩繼繻纃緕繽辮繿纈纉續纒纐纓纔纖纎纛纜缸缺"],["e6a1","罅罌罍罎罐网罕罔罘罟罠罨罩罧罸羂羆羃羈羇羌羔羞羝羚羣羯羲羹羮羶羸譱翅翆翊翕翔翡翦翩翳翹飜耆耄耋耒耘耙耜耡耨耿耻聊聆聒聘聚聟聢聨聳聲聰聶聹聽聿肄肆肅肛肓肚肭冐肬胛胥胙胝胄胚胖脉胯胱脛脩脣脯腋"],["e7a1","隋腆脾腓腑胼腱腮腥腦腴膃膈膊膀膂膠膕膤膣腟膓膩膰膵膾膸膽臀臂膺臉臍臑臙臘臈臚臟臠臧臺臻臾舁舂舅與舊舍舐舖舩舫舸舳艀艙艘艝艚艟艤艢艨艪艫舮艱艷艸艾芍芒芫芟芻芬苡苣苟苒苴苳苺莓范苻苹苞茆苜茉苙"],["e8a1","茵茴茖茲茱荀茹荐荅茯茫茗茘莅莚莪莟莢莖茣莎莇莊荼莵荳荵莠莉莨菴萓菫菎菽萃菘萋菁菷萇菠菲萍萢萠莽萸蔆菻葭萪萼蕚蒄葷葫蒭葮蒂葩葆萬葯葹萵蓊葢蒹蒿蒟蓙蓍蒻蓚蓐蓁蓆蓖蒡蔡蓿蓴蔗蔘蔬蔟蔕蔔蓼蕀蕣蕘蕈"],["e9a1","蕁蘂蕋蕕薀薤薈薑薊薨蕭薔薛藪薇薜蕷蕾薐藉薺藏薹藐藕藝藥藜藹蘊蘓蘋藾藺蘆蘢蘚蘰蘿虍乕虔號虧虱蚓蚣蚩蚪蚋蚌蚶蚯蛄蛆蚰蛉蠣蚫蛔蛞蛩蛬蛟蛛蛯蜒蜆蜈蜀蜃蛻蜑蜉蜍蛹蜊蜴蜿蜷蜻蜥蜩蜚蝠蝟蝸蝌蝎蝴蝗蝨蝮蝙"],["eaa1","蝓蝣蝪蠅螢螟螂螯蟋螽蟀蟐雖螫蟄螳蟇蟆螻蟯蟲蟠蠏蠍蟾蟶蟷蠎蟒蠑蠖蠕蠢蠡蠱蠶蠹蠧蠻衄衂衒衙衞衢衫袁衾袞衵衽袵衲袂袗袒袮袙袢袍袤袰袿袱裃裄裔裘裙裝裹褂裼裴裨裲褄褌褊褓襃褞褥褪褫襁襄褻褶褸襌褝襠襞"],["eba1","襦襤襭襪襯襴襷襾覃覈覊覓覘覡覩覦覬覯覲覺覽覿觀觚觜觝觧觴觸訃訖訐訌訛訝訥訶詁詛詒詆詈詼詭詬詢誅誂誄誨誡誑誥誦誚誣諄諍諂諚諫諳諧諤諱謔諠諢諷諞諛謌謇謚諡謖謐謗謠謳鞫謦謫謾謨譁譌譏譎證譖譛譚譫"],["eca1","譟譬譯譴譽讀讌讎讒讓讖讙讚谺豁谿豈豌豎豐豕豢豬豸豺貂貉貅貊貍貎貔豼貘戝貭貪貽貲貳貮貶賈賁賤賣賚賽賺賻贄贅贊贇贏贍贐齎贓賍贔贖赧赭赱赳趁趙跂趾趺跏跚跖跌跛跋跪跫跟跣跼踈踉跿踝踞踐踟蹂踵踰踴蹊"],["eda1","蹇蹉蹌蹐蹈蹙蹤蹠踪蹣蹕蹶蹲蹼躁躇躅躄躋躊躓躑躔躙躪躡躬躰軆躱躾軅軈軋軛軣軼軻軫軾輊輅輕輒輙輓輜輟輛輌輦輳輻輹轅轂輾轌轉轆轎轗轜轢轣轤辜辟辣辭辯辷迚迥迢迪迯邇迴逅迹迺逑逕逡逍逞逖逋逧逶逵逹迸"],["eea1","遏遐遑遒逎遉逾遖遘遞遨遯遶隨遲邂遽邁邀邊邉邏邨邯邱邵郢郤扈郛鄂鄒鄙鄲鄰酊酖酘酣酥酩酳酲醋醉醂醢醫醯醪醵醴醺釀釁釉釋釐釖釟釡釛釼釵釶鈞釿鈔鈬鈕鈑鉞鉗鉅鉉鉤鉈銕鈿鉋鉐銜銖銓銛鉚鋏銹銷鋩錏鋺鍄錮"],["efa1","錙錢錚錣錺錵錻鍜鍠鍼鍮鍖鎰鎬鎭鎔鎹鏖鏗鏨鏥鏘鏃鏝鏐鏈鏤鐚鐔鐓鐃鐇鐐鐶鐫鐵鐡鐺鑁鑒鑄鑛鑠鑢鑞鑪鈩鑰鑵鑷鑽鑚鑼鑾钁鑿閂閇閊閔閖閘閙閠閨閧閭閼閻閹閾闊濶闃闍闌闕闔闖關闡闥闢阡阨阮阯陂陌陏陋陷陜陞"],["f0a1","陝陟陦陲陬隍隘隕隗險隧隱隲隰隴隶隸隹雎雋雉雍襍雜霍雕雹霄霆霈霓霎霑霏霖霙霤霪霰霹霽霾靄靆靈靂靉靜靠靤靦靨勒靫靱靹鞅靼鞁靺鞆鞋鞏鞐鞜鞨鞦鞣鞳鞴韃韆韈韋韜韭齏韲竟韶韵頏頌頸頤頡頷頽顆顏顋顫顯顰"],["f1a1","顱顴顳颪颯颱颶飄飃飆飩飫餃餉餒餔餘餡餝餞餤餠餬餮餽餾饂饉饅饐饋饑饒饌饕馗馘馥馭馮馼駟駛駝駘駑駭駮駱駲駻駸騁騏騅駢騙騫騷驅驂驀驃騾驕驍驛驗驟驢驥驤驩驫驪骭骰骼髀髏髑髓體髞髟髢髣髦髯髫髮髴髱髷"],["f2a1","髻鬆鬘鬚鬟鬢鬣鬥鬧鬨鬩鬪鬮鬯鬲魄魃魏魍魎魑魘魴鮓鮃鮑鮖鮗鮟鮠鮨鮴鯀鯊鮹鯆鯏鯑鯒鯣鯢鯤鯔鯡鰺鯲鯱鯰鰕鰔鰉鰓鰌鰆鰈鰒鰊鰄鰮鰛鰥鰤鰡鰰鱇鰲鱆鰾鱚鱠鱧鱶鱸鳧鳬鳰鴉鴈鳫鴃鴆鴪鴦鶯鴣鴟鵄鴕鴒鵁鴿鴾鵆鵈"],["f3a1","鵝鵞鵤鵑鵐鵙鵲鶉鶇鶫鵯鵺鶚鶤鶩鶲鷄鷁鶻鶸鶺鷆鷏鷂鷙鷓鷸鷦鷭鷯鷽鸚鸛鸞鹵鹹鹽麁麈麋麌麒麕麑麝麥麩麸麪麭靡黌黎黏黐黔黜點黝黠黥黨黯黴黶黷黹黻黼黽鼇鼈皷鼕鼡鼬鼾齊齒齔齣齟齠齡齦齧齬齪齷齲齶龕龜龠"],["f4a1","堯槇遙瑤凜熙"],["f9a1","纊褜鍈銈蓜俉炻昱棈鋹曻彅丨仡仼伀伃伹佖侒侊侚侔俍偀倢俿倞偆偰偂傔僴僘兊兤冝冾凬刕劜劦勀勛匀匇匤卲厓厲叝﨎咜咊咩哿喆坙坥垬埈埇﨏塚增墲夋奓奛奝奣妤妺孖寀甯寘寬尞岦岺峵崧嵓﨑嵂嵭嶸嶹巐弡弴彧德"],["faa1","忞恝悅悊惞惕愠惲愑愷愰憘戓抦揵摠撝擎敎昀昕昻昉昮昞昤晥晗晙晴晳暙暠暲暿曺朎朗杦枻桒柀栁桄棏﨓楨﨔榘槢樰橫橆橳橾櫢櫤毖氿汜沆汯泚洄涇浯涖涬淏淸淲淼渹湜渧渼溿澈澵濵瀅瀇瀨炅炫焏焄煜煆煇凞燁燾犱"],["fba1","犾猤猪獷玽珉珖珣珒琇珵琦琪琩琮瑢璉璟甁畯皂皜皞皛皦益睆劯砡硎硤硺礰礼神祥禔福禛竑竧靖竫箞精絈絜綷綠緖繒罇羡羽茁荢荿菇菶葈蒴蕓蕙蕫﨟薰蘒﨡蠇裵訒訷詹誧誾諟諸諶譓譿賰賴贒赶﨣軏﨤逸遧郞都鄕鄧釚"],["fca1","釗釞釭釮釤釥鈆鈐鈊鈺鉀鈼鉎鉙鉑鈹鉧銧鉷鉸鋧鋗鋙鋐﨧鋕鋠鋓錥錡鋻﨨錞鋿錝錂鍰鍗鎤鏆鏞鏸鐱鑅鑈閒隆﨩隝隯霳霻靃靍靏靑靕顗顥飯飼餧館馞驎髙髜魵魲鮏鮱鮻鰀鵰鵫鶴鸙黑"],["fcf1","ⅰ",9,"￢￤＇＂"],["8fa2af","˘ˇ¸˙˝¯˛˚～΄΅"],["8fa2c2","¡¦¿"],["8fa2eb","ºª©®™¤№"],["8fa6e1","ΆΈΉΊΪ"],["8fa6e7","Ό"],["8fa6e9","ΎΫ"],["8fa6ec","Ώ"],["8fa6f1","άέήίϊΐόςύϋΰώ"],["8fa7c2","Ђ",10,"ЎЏ"],["8fa7f2","ђ",10,"ўџ"],["8fa9a1","ÆĐ"],["8fa9a4","Ħ"],["8fa9a6","Ĳ"],["8fa9a8","ŁĿ"],["8fa9ab","ŊØŒ"],["8fa9af","ŦÞ"],["8fa9c1","æđðħıĳĸłŀŉŋøœßŧþ"],["8faaa1","ÁÀÄÂĂǍĀĄÅÃĆĈČÇĊĎÉÈËÊĚĖĒĘ"],["8faaba","ĜĞĢĠĤÍÌÏÎǏİĪĮĨĴĶĹĽĻŃŇŅÑÓÒÖÔǑŐŌÕŔŘŖŚŜŠŞŤŢÚÙÜÛŬǓŰŪŲŮŨǗǛǙǕŴÝŸŶŹŽŻ"],["8faba1","áàäâăǎāąåãćĉčçċďéèëêěėēęǵĝğ"],["8fabbd","ġĥíìïîǐ"],["8fabc5","īįĩĵķĺľļńňņñóòöôǒőōõŕřŗśŝšşťţúùüûŭǔűūųůũǘǜǚǖŵýÿŷźžż"],["8fb0a1","丂丄丅丌丒丟丣两丨丫丮丯丰丵乀乁乄乇乑乚乜乣乨乩乴乵乹乿亍亖亗亝亯亹仃仐仚仛仠仡仢仨仯仱仳仵份仾仿伀伂伃伈伋伌伒伕伖众伙伮伱你伳伵伷伹伻伾佀佂佈佉佋佌佒佔佖佘佟佣佪佬佮佱佷佸佹佺佽佾侁侂侄"],["8fb1a1","侅侉侊侌侎侐侒侓侔侗侙侚侞侟侲侷侹侻侼侽侾俀俁俅俆俈俉俋俌俍俏俒俜俠俢俰俲俼俽俿倀倁倄倇倊倌倎倐倓倗倘倛倜倝倞倢倧倮倰倲倳倵偀偁偂偅偆偊偌偎偑偒偓偗偙偟偠偢偣偦偧偪偭偰偱倻傁傃傄傆傊傎傏傐"],["8fb2a1","傒傓傔傖傛傜傞",4,"傪傯傰傹傺傽僀僃僄僇僌僎僐僓僔僘僜僝僟僢僤僦僨僩僯僱僶僺僾儃儆儇儈儋儌儍儎僲儐儗儙儛儜儝儞儣儧儨儬儭儯儱儳儴儵儸儹兂兊兏兓兕兗兘兟兤兦兾冃冄冋冎冘冝冡冣冭冸冺冼冾冿凂"],["8fb3a1","凈减凑凒凓凕凘凞凢凥凮凲凳凴凷刁刂刅划刓刕刖刘刢刨刱刲刵刼剅剉剕剗剘剚剜剟剠剡剦剮剷剸剹劀劂劅劊劌劓劕劖劗劘劚劜劤劥劦劧劯劰劶劷劸劺劻劽勀勄勆勈勌勏勑勔勖勛勜勡勥勨勩勪勬勰勱勴勶勷匀匃匊匋"],["8fb4a1","匌匑匓匘匛匜匞匟匥匧匨匩匫匬匭匰匲匵匼匽匾卂卌卋卙卛卡卣卥卬卭卲卹卾厃厇厈厎厓厔厙厝厡厤厪厫厯厲厴厵厷厸厺厽叀叅叏叒叓叕叚叝叞叠另叧叵吂吓吚吡吧吨吪启吱吴吵呃呄呇呍呏呞呢呤呦呧呩呫呭呮呴呿"],["8fb5a1","咁咃咅咈咉咍咑咕咖咜咟咡咦咧咩咪咭咮咱咷咹咺咻咿哆哊响哎哠哪哬哯哶哼哾哿唀唁唅唈唉唌唍唎唕唪唫唲唵唶唻唼唽啁啇啉啊啍啐啑啘啚啛啞啠啡啤啦啿喁喂喆喈喎喏喑喒喓喔喗喣喤喭喲喿嗁嗃嗆嗉嗋嗌嗎嗑嗒"],["8fb6a1","嗓嗗嗘嗛嗞嗢嗩嗶嗿嘅嘈嘊嘍",5,"嘙嘬嘰嘳嘵嘷嘹嘻嘼嘽嘿噀噁噃噄噆噉噋噍噏噔噞噠噡噢噣噦噩噭噯噱噲噵嚄嚅嚈嚋嚌嚕嚙嚚嚝嚞嚟嚦嚧嚨嚩嚫嚬嚭嚱嚳嚷嚾囅囉囊囋囏囐囌囍囙囜囝囟囡囤",4,"囱囫园"],["8fb7a1","囶囷圁圂圇圊圌圑圕圚圛圝圠圢圣圤圥圩圪圬圮圯圳圴圽圾圿坅坆坌坍坒坢坥坧坨坫坭",4,"坳坴坵坷坹坺坻坼坾垁垃垌垔垗垙垚垜垝垞垟垡垕垧垨垩垬垸垽埇埈埌埏埕埝埞埤埦埧埩埭埰埵埶埸埽埾埿堃堄堈堉埡"],["8fb8a1","堌堍堛堞堟堠堦堧堭堲堹堿塉塌塍塏塐塕塟塡塤塧塨塸塼塿墀墁墇墈墉墊墌墍墏墐墔墖墝墠墡墢墦墩墱墲壄墼壂壈壍壎壐壒壔壖壚壝壡壢壩壳夅夆夋夌夒夓夔虁夝夡夣夤夨夯夰夳夵夶夿奃奆奒奓奙奛奝奞奟奡奣奫奭"],["8fb9a1","奯奲奵奶她奻奼妋妌妎妒妕妗妟妤妧妭妮妯妰妳妷妺妼姁姃姄姈姊姍姒姝姞姟姣姤姧姮姯姱姲姴姷娀娄娌娍娎娒娓娞娣娤娧娨娪娭娰婄婅婇婈婌婐婕婞婣婥婧婭婷婺婻婾媋媐媓媖媙媜媞媟媠媢媧媬媱媲媳媵媸媺媻媿"],["8fbaa1","嫄嫆嫈嫏嫚嫜嫠嫥嫪嫮嫵嫶嫽嬀嬁嬈嬗嬴嬙嬛嬝嬡嬥嬭嬸孁孋孌孒孖孞孨孮孯孼孽孾孿宁宄宆宊宎宐宑宓宔宖宨宩宬宭宯宱宲宷宺宼寀寁寍寏寖",4,"寠寯寱寴寽尌尗尞尟尣尦尩尫尬尮尰尲尵尶屙屚屜屢屣屧屨屩"],["8fbba1","屭屰屴屵屺屻屼屽岇岈岊岏岒岝岟岠岢岣岦岪岲岴岵岺峉峋峒峝峗峮峱峲峴崁崆崍崒崫崣崤崦崧崱崴崹崽崿嵂嵃嵆嵈嵕嵑嵙嵊嵟嵠嵡嵢嵤嵪嵭嵰嵹嵺嵾嵿嶁嶃嶈嶊嶒嶓嶔嶕嶙嶛嶟嶠嶧嶫嶰嶴嶸嶹巃巇巋巐巎巘巙巠巤"],["8fbca1","巩巸巹帀帇帍帒帔帕帘帟帠帮帨帲帵帾幋幐幉幑幖幘幛幜幞幨幪",4,"幰庀庋庎庢庤庥庨庪庬庱庳庽庾庿廆廌廋廎廑廒廔廕廜廞廥廫异弆弇弈弎弙弜弝弡弢弣弤弨弫弬弮弰弴弶弻弽弿彀彄彅彇彍彐彔彘彛彠彣彤彧"],["8fbda1","彯彲彴彵彸彺彽彾徉徍徏徖徜徝徢徧徫徤徬徯徰徱徸忄忇忈忉忋忐",4,"忞忡忢忨忩忪忬忭忮忯忲忳忶忺忼怇怊怍怓怔怗怘怚怟怤怭怳怵恀恇恈恉恌恑恔恖恗恝恡恧恱恾恿悂悆悈悊悎悑悓悕悘悝悞悢悤悥您悰悱悷"],["8fbea1","悻悾惂惄惈惉惊惋惎惏惔惕惙惛惝惞惢惥惲惵惸惼惽愂愇愊愌愐",4,"愖愗愙愜愞愢愪愫愰愱愵愶愷愹慁慅慆慉慞慠慬慲慸慻慼慿憀憁憃憄憋憍憒憓憗憘憜憝憟憠憥憨憪憭憸憹憼懀懁懂懎懏懕懜懝懞懟懡懢懧懩懥"],["8fbfa1","懬懭懯戁戃戄戇戓戕戜戠戢戣戧戩戫戹戽扂扃扄扆扌扐扑扒扔扖扚扜扤扭扯扳扺扽抍抎抏抐抦抨抳抶抷抺抾抿拄拎拕拖拚拪拲拴拼拽挃挄挊挋挍挐挓挖挘挩挪挭挵挶挹挼捁捂捃捄捆捊捋捎捒捓捔捘捛捥捦捬捭捱捴捵"],["8fc0a1","捸捼捽捿掂掄掇掊掐掔掕掙掚掞掤掦掭掮掯掽揁揅揈揎揑揓揔揕揜揠揥揪揬揲揳揵揸揹搉搊搐搒搔搘搞搠搢搤搥搩搪搯搰搵搽搿摋摏摑摒摓摔摚摛摜摝摟摠摡摣摭摳摴摻摽撅撇撏撐撑撘撙撛撝撟撡撣撦撨撬撳撽撾撿"],["8fc1a1","擄擉擊擋擌擎擐擑擕擗擤擥擩擪擭擰擵擷擻擿攁攄攈攉攊攏攓攔攖攙攛攞攟攢攦攩攮攱攺攼攽敃敇敉敐敒敔敟敠敧敫敺敽斁斅斊斒斕斘斝斠斣斦斮斲斳斴斿旂旈旉旎旐旔旖旘旟旰旲旴旵旹旾旿昀昄昈昉昍昑昒昕昖昝"],["8fc2a1","昞昡昢昣昤昦昩昪昫昬昮昰昱昳昹昷晀晅晆晊晌晑晎晗晘晙晛晜晠晡曻晪晫晬晾晳晵晿晷晸晹晻暀晼暋暌暍暐暒暙暚暛暜暟暠暤暭暱暲暵暻暿曀曂曃曈曌曎曏曔曛曟曨曫曬曮曺朅朇朎朓朙朜朠朢朳朾杅杇杈杌杔杕杝"],["8fc3a1","杦杬杮杴杶杻极构枎枏枑枓枖枘枙枛枰枱枲枵枻枼枽柹柀柂柃柅柈柉柒柗柙柜柡柦柰柲柶柷桒栔栙栝栟栨栧栬栭栯栰栱栳栻栿桄桅桊桌桕桗桘桛桫桮",4,"桵桹桺桻桼梂梄梆梈梖梘梚梜梡梣梥梩梪梮梲梻棅棈棌棏"],["8fc4a1","棐棑棓棖棙棜棝棥棨棪棫棬棭棰棱棵棶棻棼棽椆椉椊椐椑椓椖椗椱椳椵椸椻楂楅楉楎楗楛楣楤楥楦楨楩楬楰楱楲楺楻楿榀榍榒榖榘榡榥榦榨榫榭榯榷榸榺榼槅槈槑槖槗槢槥槮槯槱槳槵槾樀樁樃樏樑樕樚樝樠樤樨樰樲"],["8fc5a1","樴樷樻樾樿橅橆橉橊橎橐橑橒橕橖橛橤橧橪橱橳橾檁檃檆檇檉檋檑檛檝檞檟檥檫檯檰檱檴檽檾檿櫆櫉櫈櫌櫐櫔櫕櫖櫜櫝櫤櫧櫬櫰櫱櫲櫼櫽欂欃欆欇欉欏欐欑欗欛欞欤欨欫欬欯欵欶欻欿歆歊歍歒歖歘歝歠歧歫歮歰歵歽"],["8fc6a1","歾殂殅殗殛殟殠殢殣殨殩殬殭殮殰殸殹殽殾毃毄毉毌毖毚毡毣毦毧毮毱毷毹毿氂氄氅氉氍氎氐氒氙氟氦氧氨氬氮氳氵氶氺氻氿汊汋汍汏汒汔汙汛汜汫汭汯汴汶汸汹汻沅沆沇沉沔沕沗沘沜沟沰沲沴泂泆泍泏泐泑泒泔泖"],["8fc7a1","泚泜泠泧泩泫泬泮泲泴洄洇洊洎洏洑洓洚洦洧洨汧洮洯洱洹洼洿浗浞浟浡浥浧浯浰浼涂涇涑涒涔涖涗涘涪涬涴涷涹涽涿淄淈淊淎淏淖淛淝淟淠淢淥淩淯淰淴淶淼渀渄渞渢渧渲渶渹渻渼湄湅湈湉湋湏湑湒湓湔湗湜湝湞"],["8fc8a1","湢湣湨湳湻湽溍溓溙溠溧溭溮溱溳溻溿滀滁滃滇滈滊滍滎滏滫滭滮滹滻滽漄漈漊漌漍漖漘漚漛漦漩漪漯漰漳漶漻漼漭潏潑潒潓潗潙潚潝潞潡潢潨潬潽潾澃澇澈澋澌澍澐澒澓澔澖澚澟澠澥澦澧澨澮澯澰澵澶澼濅濇濈濊"],["8fc9a1","濚濞濨濩濰濵濹濼濽瀀瀅瀆瀇瀍瀗瀠瀣瀯瀴瀷瀹瀼灃灄灈灉灊灋灔灕灝灞灎灤灥灬灮灵灶灾炁炅炆炔",4,"炛炤炫炰炱炴炷烊烑烓烔烕烖烘烜烤烺焃",4,"焋焌焏焞焠焫焭焯焰焱焸煁煅煆煇煊煋煐煒煗煚煜煞煠"],["8fcaa1","煨煹熀熅熇熌熒熚熛熠熢熯熰熲熳熺熿燀燁燄燋燌燓燖燙燚燜燸燾爀爇爈爉爓爗爚爝爟爤爫爯爴爸爹牁牂牃牅牎牏牐牓牕牖牚牜牞牠牣牨牫牮牯牱牷牸牻牼牿犄犉犍犎犓犛犨犭犮犱犴犾狁狇狉狌狕狖狘狟狥狳狴狺狻"],["8fcba1","狾猂猄猅猇猋猍猒猓猘猙猞猢猤猧猨猬猱猲猵猺猻猽獃獍獐獒獖獘獝獞獟獠獦獧獩獫獬獮獯獱獷獹獼玀玁玃玅玆玎玐玓玕玗玘玜玞玟玠玢玥玦玪玫玭玵玷玹玼玽玿珅珆珉珋珌珏珒珓珖珙珝珡珣珦珧珩珴珵珷珹珺珻珽"],["8fcca1","珿琀琁琄琇琊琑琚琛琤琦琨",9,"琹瑀瑃瑄瑆瑇瑋瑍瑑瑒瑗瑝瑢瑦瑧瑨瑫瑭瑮瑱瑲璀璁璅璆璇璉璏璐璑璒璘璙璚璜璟璠璡璣璦璨璩璪璫璮璯璱璲璵璹璻璿瓈瓉瓌瓐瓓瓘瓚瓛瓞瓟瓤瓨瓪瓫瓯瓴瓺瓻瓼瓿甆"],["8fcda1","甒甖甗甠甡甤甧甩甪甯甶甹甽甾甿畀畃畇畈畎畐畒畗畞畟畡畯畱畹",5,"疁疅疐疒疓疕疙疜疢疤疴疺疿痀痁痄痆痌痎痏痗痜痟痠痡痤痧痬痮痯痱痹瘀瘂瘃瘄瘇瘈瘊瘌瘏瘒瘓瘕瘖瘙瘛瘜瘝瘞瘣瘥瘦瘩瘭瘲瘳瘵瘸瘹"],["8fcea1","瘺瘼癊癀癁癃癄癅癉癋癕癙癟癤癥癭癮癯癱癴皁皅皌皍皕皛皜皝皟皠皢",6,"皪皭皽盁盅盉盋盌盎盔盙盠盦盨盬盰盱盶盹盼眀眆眊眎眒眔眕眗眙眚眜眢眨眭眮眯眴眵眶眹眽眾睂睅睆睊睍睎睏睒睖睗睜睞睟睠睢"],["8fcfa1","睤睧睪睬睰睲睳睴睺睽瞀瞄瞌瞍瞔瞕瞖瞚瞟瞢瞧瞪瞮瞯瞱瞵瞾矃矉矑矒矕矙矞矟矠矤矦矪矬矰矱矴矸矻砅砆砉砍砎砑砝砡砢砣砭砮砰砵砷硃硄硇硈硌硎硒硜硞硠硡硣硤硨硪确硺硾碊碏碔碘碡碝碞碟碤碨碬碭碰碱碲碳"],["8fd0a1","碻碽碿磇磈磉磌磎磒磓磕磖磤磛磟磠磡磦磪磲磳礀磶磷磺磻磿礆礌礐礚礜礞礟礠礥礧礩礭礱礴礵礻礽礿祄祅祆祊祋祏祑祔祘祛祜祧祩祫祲祹祻祼祾禋禌禑禓禔禕禖禘禛禜禡禨禩禫禯禱禴禸离秂秄秇秈秊秏秔秖秚秝秞"],["8fd1a1","秠秢秥秪秫秭秱秸秼稂稃稇稉稊稌稑稕稛稞稡稧稫稭稯稰稴稵稸稹稺穄穅穇穈穌穕穖穙穜穝穟穠穥穧穪穭穵穸穾窀窂窅窆窊窋窐窑窔窞窠窣窬窳窵窹窻窼竆竉竌竎竑竛竨竩竫竬竱竴竻竽竾笇笔笟笣笧笩笪笫笭笮笯笰"],["8fd2a1","笱笴笽笿筀筁筇筎筕筠筤筦筩筪筭筯筲筳筷箄箉箎箐箑箖箛箞箠箥箬箯箰箲箵箶箺箻箼箽篂篅篈篊篔篖篗篙篚篛篨篪篲篴篵篸篹篺篼篾簁簂簃簄簆簉簋簌簎簏簙簛簠簥簦簨簬簱簳簴簶簹簺籆籊籕籑籒籓籙",5],["8fd3a1","籡籣籧籩籭籮籰籲籹籼籽粆粇粏粔粞粠粦粰粶粷粺粻粼粿糄糇糈糉糍糏糓糔糕糗糙糚糝糦糩糫糵紃紇紈紉紏紑紒紓紖紝紞紣紦紪紭紱紼紽紾絀絁絇絈絍絑絓絗絙絚絜絝絥絧絪絰絸絺絻絿綁綂綃綅綆綈綋綌綍綑綖綗綝"],["8fd4a1","綞綦綧綪綳綶綷綹緂",4,"緌緍緎緗緙縀緢緥緦緪緫緭緱緵緶緹緺縈縐縑縕縗縜縝縠縧縨縬縭縯縳縶縿繄繅繇繎繐繒繘繟繡繢繥繫繮繯繳繸繾纁纆纇纊纍纑纕纘纚纝纞缼缻缽缾缿罃罄罇罏罒罓罛罜罝罡罣罤罥罦罭"],["8fd5a1","罱罽罾罿羀羋羍羏羐羑羖羗羜羡羢羦羪羭羴羼羿翀翃翈翎翏翛翟翣翥翨翬翮翯翲翺翽翾翿耇耈耊耍耎耏耑耓耔耖耝耞耟耠耤耦耬耮耰耴耵耷耹耺耼耾聀聄聠聤聦聭聱聵肁肈肎肜肞肦肧肫肸肹胈胍胏胒胔胕胗胘胠胭胮"],["8fd6a1","胰胲胳胶胹胺胾脃脋脖脗脘脜脞脠脤脧脬脰脵脺脼腅腇腊腌腒腗腠腡腧腨腩腭腯腷膁膐膄膅膆膋膎膖膘膛膞膢膮膲膴膻臋臃臅臊臎臏臕臗臛臝臞臡臤臫臬臰臱臲臵臶臸臹臽臿舀舃舏舓舔舙舚舝舡舢舨舲舴舺艃艄艅艆"],["8fd7a1","艋艎艏艑艖艜艠艣艧艭艴艻艽艿芀芁芃芄芇芉芊芎芑芔芖芘芚芛芠芡芣芤芧芨芩芪芮芰芲芴芷芺芼芾芿苆苐苕苚苠苢苤苨苪苭苯苶苷苽苾茀茁茇茈茊茋荔茛茝茞茟茡茢茬茭茮茰茳茷茺茼茽荂荃荄荇荍荎荑荕荖荗荰荸"],["8fd8a1","荽荿莀莂莄莆莍莒莔莕莘莙莛莜莝莦莧莩莬莾莿菀菇菉菏菐菑菔菝荓菨菪菶菸菹菼萁萆萊萏萑萕萙莭萯萹葅葇葈葊葍葏葑葒葖葘葙葚葜葠葤葥葧葪葰葳葴葶葸葼葽蒁蒅蒒蒓蒕蒞蒦蒨蒩蒪蒯蒱蒴蒺蒽蒾蓀蓂蓇蓈蓌蓏蓓"],["8fd9a1","蓜蓧蓪蓯蓰蓱蓲蓷蔲蓺蓻蓽蔂蔃蔇蔌蔎蔐蔜蔞蔢蔣蔤蔥蔧蔪蔫蔯蔳蔴蔶蔿蕆蕏",4,"蕖蕙蕜",6,"蕤蕫蕯蕹蕺蕻蕽蕿薁薅薆薉薋薌薏薓薘薝薟薠薢薥薧薴薶薷薸薼薽薾薿藂藇藊藋藎薭藘藚藟藠藦藨藭藳藶藼"],["8fdaa1","藿蘀蘄蘅蘍蘎蘐蘑蘒蘘蘙蘛蘞蘡蘧蘩蘶蘸蘺蘼蘽虀虂虆虒虓虖虗虘虙虝虠",4,"虩虬虯虵虶虷虺蚍蚑蚖蚘蚚蚜蚡蚦蚧蚨蚭蚱蚳蚴蚵蚷蚸蚹蚿蛀蛁蛃蛅蛑蛒蛕蛗蛚蛜蛠蛣蛥蛧蚈蛺蛼蛽蜄蜅蜇蜋蜎蜏蜐蜓蜔蜙蜞蜟蜡蜣"],["8fdba1","蜨蜮蜯蜱蜲蜹蜺蜼蜽蜾蝀蝃蝅蝍蝘蝝蝡蝤蝥蝯蝱蝲蝻螃",6,"螋螌螐螓螕螗螘螙螞螠螣螧螬螭螮螱螵螾螿蟁蟈蟉蟊蟎蟕蟖蟙蟚蟜蟟蟢蟣蟤蟪蟫蟭蟱蟳蟸蟺蟿蠁蠃蠆蠉蠊蠋蠐蠙蠒蠓蠔蠘蠚蠛蠜蠞蠟蠨蠭蠮蠰蠲蠵"],["8fdca1","蠺蠼衁衃衅衈衉衊衋衎衑衕衖衘衚衜衟衠衤衩衱衹衻袀袘袚袛袜袟袠袨袪袺袽袾裀裊",4,"裑裒裓裛裞裧裯裰裱裵裷褁褆褍褎褏褕褖褘褙褚褜褠褦褧褨褰褱褲褵褹褺褾襀襂襅襆襉襏襒襗襚襛襜襡襢襣襫襮襰襳襵襺"],["8fdda1","襻襼襽覉覍覐覔覕覛覜覟覠覥覰覴覵覶覷覼觔",4,"觥觩觫觭觱觳觶觹觽觿訄訅訇訏訑訒訔訕訞訠訢訤訦訫訬訯訵訷訽訾詀詃詅詇詉詍詎詓詖詗詘詜詝詡詥詧詵詶詷詹詺詻詾詿誀誃誆誋誏誐誒誖誗誙誟誧誩誮誯誳"],["8fdea1","誶誷誻誾諃諆諈諉諊諑諓諔諕諗諝諟諬諰諴諵諶諼諿謅謆謋謑謜謞謟謊謭謰謷謼譂",4,"譈譒譓譔譙譍譞譣譭譶譸譹譼譾讁讄讅讋讍讏讔讕讜讞讟谸谹谽谾豅豇豉豋豏豑豓豔豗豘豛豝豙豣豤豦豨豩豭豳豵豶豻豾貆"],["8fdfa1","貇貋貐貒貓貙貛貜貤貹貺賅賆賉賋賏賖賕賙賝賡賨賬賯賰賲賵賷賸賾賿贁贃贉贒贗贛赥赩赬赮赿趂趄趈趍趐趑趕趞趟趠趦趫趬趯趲趵趷趹趻跀跅跆跇跈跊跎跑跔跕跗跙跤跥跧跬跰趼跱跲跴跽踁踄踅踆踋踑踔踖踠踡踢"],["8fe0a1","踣踦踧踱踳踶踷踸踹踽蹀蹁蹋蹍蹎蹏蹔蹛蹜蹝蹞蹡蹢蹩蹬蹭蹯蹰蹱蹹蹺蹻躂躃躉躐躒躕躚躛躝躞躢躧躩躭躮躳躵躺躻軀軁軃軄軇軏軑軔軜軨軮軰軱軷軹軺軭輀輂輇輈輏輐輖輗輘輞輠輡輣輥輧輨輬輭輮輴輵輶輷輺轀轁"],["8fe1a1","轃轇轏轑",4,"轘轝轞轥辝辠辡辤辥辦辵辶辸达迀迁迆迊迋迍运迒迓迕迠迣迤迨迮迱迵迶迻迾适逄逈逌逘逛逨逩逯逪逬逭逳逴逷逿遃遄遌遛遝遢遦遧遬遰遴遹邅邈邋邌邎邐邕邗邘邙邛邠邡邢邥邰邲邳邴邶邽郌邾郃"],["8fe2a1","郄郅郇郈郕郗郘郙郜郝郟郥郒郶郫郯郰郴郾郿鄀鄄鄅鄆鄈鄍鄐鄔鄖鄗鄘鄚鄜鄞鄠鄥鄢鄣鄧鄩鄮鄯鄱鄴鄶鄷鄹鄺鄼鄽酃酇酈酏酓酗酙酚酛酡酤酧酭酴酹酺酻醁醃醅醆醊醎醑醓醔醕醘醞醡醦醨醬醭醮醰醱醲醳醶醻醼醽醿"],["8fe3a1","釂釃釅釓釔釗釙釚釞釤釥釩釪釬",5,"釷釹釻釽鈀鈁鈄鈅鈆鈇鈉鈊鈌鈐鈒鈓鈖鈘鈜鈝鈣鈤鈥鈦鈨鈮鈯鈰鈳鈵鈶鈸鈹鈺鈼鈾鉀鉂鉃鉆鉇鉊鉍鉎鉏鉑鉘鉙鉜鉝鉠鉡鉥鉧鉨鉩鉮鉯鉰鉵",4,"鉻鉼鉽鉿銈銉銊銍銎銒銗"],["8fe4a1","銙銟銠銤銥銧銨銫銯銲銶銸銺銻銼銽銿",4,"鋅鋆鋇鋈鋋鋌鋍鋎鋐鋓鋕鋗鋘鋙鋜鋝鋟鋠鋡鋣鋥鋧鋨鋬鋮鋰鋹鋻鋿錀錂錈錍錑錔錕錜錝錞錟錡錤錥錧錩錪錳錴錶錷鍇鍈鍉鍐鍑鍒鍕鍗鍘鍚鍞鍤鍥鍧鍩鍪鍭鍯鍰鍱鍳鍴鍶"],["8fe5a1","鍺鍽鍿鎀鎁鎂鎈鎊鎋鎍鎏鎒鎕鎘鎛鎞鎡鎣鎤鎦鎨鎫鎴鎵鎶鎺鎩鏁鏄鏅鏆鏇鏉",4,"鏓鏙鏜鏞鏟鏢鏦鏧鏹鏷鏸鏺鏻鏽鐁鐂鐄鐈鐉鐍鐎鐏鐕鐖鐗鐟鐮鐯鐱鐲鐳鐴鐻鐿鐽鑃鑅鑈鑊鑌鑕鑙鑜鑟鑡鑣鑨鑫鑭鑮鑯鑱鑲钄钃镸镹"],["8fe6a1","镾閄閈閌閍閎閝閞閟閡閦閩閫閬閴閶閺閽閿闆闈闉闋闐闑闒闓闙闚闝闞闟闠闤闦阝阞阢阤阥阦阬阱阳阷阸阹阺阼阽陁陒陔陖陗陘陡陮陴陻陼陾陿隁隂隃隄隉隑隖隚隝隟隤隥隦隩隮隯隳隺雊雒嶲雘雚雝雞雟雩雯雱雺霂"],["8fe7a1","霃霅霉霚霛霝霡霢霣霨霱霳靁靃靊靎靏靕靗靘靚靛靣靧靪靮靳靶靷靸靻靽靿鞀鞉鞕鞖鞗鞙鞚鞞鞟鞢鞬鞮鞱鞲鞵鞶鞸鞹鞺鞼鞾鞿韁韄韅韇韉韊韌韍韎韐韑韔韗韘韙韝韞韠韛韡韤韯韱韴韷韸韺頇頊頙頍頎頔頖頜頞頠頣頦"],["8fe8a1","頫頮頯頰頲頳頵頥頾顄顇顊顑顒顓顖顗顙顚顢顣顥顦顪顬颫颭颮颰颴颷颸颺颻颿飂飅飈飌飡飣飥飦飧飪飳飶餂餇餈餑餕餖餗餚餛餜餟餢餦餧餫餱",4,"餹餺餻餼饀饁饆饇饈饍饎饔饘饙饛饜饞饟饠馛馝馟馦馰馱馲馵"],["8fe9a1","馹馺馽馿駃駉駓駔駙駚駜駞駧駪駫駬駰駴駵駹駽駾騂騃騄騋騌騐騑騖騞騠騢騣騤騧騭騮騳騵騶騸驇驁驄驊驋驌驎驑驔驖驝骪骬骮骯骲骴骵骶骹骻骾骿髁髃髆髈髎髐髒髕髖髗髛髜髠髤髥髧髩髬髲髳髵髹髺髽髿",4],["8feaa1","鬄鬅鬈鬉鬋鬌鬍鬎鬐鬒鬖鬙鬛鬜鬠鬦鬫鬭鬳鬴鬵鬷鬹鬺鬽魈魋魌魕魖魗魛魞魡魣魥魦魨魪",4,"魳魵魷魸魹魿鮀鮄鮅鮆鮇鮉鮊鮋鮍鮏鮐鮔鮚鮝鮞鮦鮧鮩鮬鮰鮱鮲鮷鮸鮻鮼鮾鮿鯁鯇鯈鯎鯐鯗鯘鯝鯟鯥鯧鯪鯫鯯鯳鯷鯸"],["8feba1","鯹鯺鯽鯿鰀鰂鰋鰏鰑鰖鰘鰙鰚鰜鰞鰢鰣鰦",4,"鰱鰵鰶鰷鰽鱁鱃鱄鱅鱉鱊鱎鱏鱐鱓鱔鱖鱘鱛鱝鱞鱟鱣鱩鱪鱜鱫鱨鱮鱰鱲鱵鱷鱻鳦鳲鳷鳹鴋鴂鴑鴗鴘鴜鴝鴞鴯鴰鴲鴳鴴鴺鴼鵅鴽鵂鵃鵇鵊鵓鵔鵟鵣鵢鵥鵩鵪鵫鵰鵶鵷鵻"],["8feca1","鵼鵾鶃鶄鶆鶊鶍鶎鶒鶓鶕鶖鶗鶘鶡鶪鶬鶮鶱鶵鶹鶼鶿鷃鷇鷉鷊鷔鷕鷖鷗鷚鷞鷟鷠鷥鷧鷩鷫鷮鷰鷳鷴鷾鸊鸂鸇鸎鸐鸑鸒鸕鸖鸙鸜鸝鹺鹻鹼麀麂麃麄麅麇麎麏麖麘麛麞麤麨麬麮麯麰麳麴麵黆黈黋黕黟黤黧黬黭黮黰黱黲黵"],["8feda1","黸黿鼂鼃鼉鼏鼐鼑鼒鼔鼖鼗鼙鼚鼛鼟鼢鼦鼪鼫鼯鼱鼲鼴鼷鼹鼺鼼鼽鼿齁齃",4,"齓齕齖齗齘齚齝齞齨齩齭",4,"齳齵齺齽龏龐龑龒龔龖龗龞龡龢龣龥"]]');
const require$$2 = /* @__PURE__ */ JSON.parse('[["0","\\u0000",127,"€"],["8140","丂丄丅丆丏丒丗丟丠両丣並丩丮丯丱丳丵丷丼乀乁乂乄乆乊乑乕乗乚乛乢乣乤乥乧乨乪",5,"乲乴",9,"乿",6,"亇亊"],["8180","亐亖亗亙亜亝亞亣亪亯亰亱亴亶亷亸亹亼亽亾仈仌仏仐仒仚仛仜仠仢仦仧仩仭仮仯仱仴仸仹仺仼仾伀伂",6,"伋伌伒",4,"伜伝伡伣伨伩伬伭伮伱伳伵伷伹伻伾",4,"佄佅佇",5,"佒佔佖佡佢佦佨佪佫佭佮佱佲併佷佸佹佺佽侀侁侂侅來侇侊侌侎侐侒侓侕侖侘侙侚侜侞侟価侢"],["8240","侤侫侭侰",4,"侶",8,"俀俁係俆俇俈俉俋俌俍俒",4,"俙俛俠俢俤俥俧俫俬俰俲俴俵俶俷俹俻俼俽俿",11],["8280","個倎倐們倓倕倖倗倛倝倞倠倢倣値倧倫倯",10,"倻倽倿偀偁偂偄偅偆偉偊偋偍偐",4,"偖偗偘偙偛偝",7,"偦",5,"偭",8,"偸偹偺偼偽傁傂傃傄傆傇傉傊傋傌傎",20,"傤傦傪傫傭",4,"傳",6,"傼"],["8340","傽",17,"僐",5,"僗僘僙僛",10,"僨僩僪僫僯僰僱僲僴僶",4,"僼",9,"儈"],["8380","儉儊儌",5,"儓",13,"儢",28,"兂兇兊兌兎兏児兒兓兗兘兙兛兝",4,"兣兤兦內兩兪兯兲兺兾兿冃冄円冇冊冋冎冏冐冑冓冔冘冚冝冞冟冡冣冦",4,"冭冮冴冸冹冺冾冿凁凂凃凅凈凊凍凎凐凒",5],["8440","凘凙凚凜凞凟凢凣凥",5,"凬凮凱凲凴凷凾刄刅刉刋刌刏刐刓刔刕刜刞刟刡刢刣別刦刧刪刬刯刱刲刴刵刼刾剄",5,"剋剎剏剒剓剕剗剘"],["8480","剙剚剛剝剟剠剢剣剤剦剨剫剬剭剮剰剱剳",9,"剾劀劃",4,"劉",6,"劑劒劔",6,"劜劤劥劦劧劮劯劰労",9,"勀勁勂勄勅勆勈勊勌勍勎勏勑勓勔動勗務",5,"勠勡勢勣勥",10,"勱",7,"勻勼勽匁匂匃匄匇匉匊匋匌匎"],["8540","匑匒匓匔匘匛匜匞匟匢匤匥匧匨匩匫匬匭匯",9,"匼匽區卂卄卆卋卌卍卐協単卙卛卝卥卨卪卬卭卲卶卹卻卼卽卾厀厁厃厇厈厊厎厏"],["8580","厐",4,"厖厗厙厛厜厞厠厡厤厧厪厫厬厭厯",6,"厷厸厹厺厼厽厾叀參",4,"収叏叐叒叓叕叚叜叝叞叡叢叧叴叺叾叿吀吂吅吇吋吔吘吙吚吜吢吤吥吪吰吳吶吷吺吽吿呁呂呄呅呇呉呌呍呎呏呑呚呝",4,"呣呥呧呩",7,"呴呹呺呾呿咁咃咅咇咈咉咊咍咑咓咗咘咜咞咟咠咡"],["8640","咢咥咮咰咲咵咶咷咹咺咼咾哃哅哊哋哖哘哛哠",4,"哫哬哯哰哱哴",5,"哻哾唀唂唃唄唅唈唊",4,"唒唓唕",5,"唜唝唞唟唡唥唦"],["8680","唨唩唫唭唲唴唵唶唸唹唺唻唽啀啂啅啇啈啋",4,"啑啒啓啔啗",4,"啝啞啟啠啢啣啨啩啫啯",5,"啹啺啽啿喅喆喌喍喎喐喒喓喕喖喗喚喛喞喠",6,"喨",8,"喲喴営喸喺喼喿",4,"嗆嗇嗈嗊嗋嗎嗏嗐嗕嗗",4,"嗞嗠嗢嗧嗩嗭嗮嗰嗱嗴嗶嗸",4,"嗿嘂嘃嘄嘅"],["8740","嘆嘇嘊嘋嘍嘐",7,"嘙嘚嘜嘝嘠嘡嘢嘥嘦嘨嘩嘪嘫嘮嘯嘰嘳嘵嘷嘸嘺嘼嘽嘾噀",11,"噏",4,"噕噖噚噛噝",4],["8780","噣噥噦噧噭噮噯噰噲噳噴噵噷噸噹噺噽",7,"嚇",6,"嚐嚑嚒嚔",14,"嚤",10,"嚰",6,"嚸嚹嚺嚻嚽",12,"囋",8,"囕囖囘囙囜団囥",5,"囬囮囯囲図囶囷囸囻囼圀圁圂圅圇國",6],["8840","園",9,"圝圞圠圡圢圤圥圦圧圫圱圲圴",4,"圼圽圿坁坃坄坅坆坈坉坋坒",4,"坘坙坢坣坥坧坬坮坰坱坲坴坵坸坹坺坽坾坿垀"],["8880","垁垇垈垉垊垍",4,"垔",6,"垜垝垞垟垥垨垪垬垯垰垱垳垵垶垷垹",8,"埄",6,"埌埍埐埑埓埖埗埛埜埞埡埢埣埥",7,"埮埰埱埲埳埵埶執埻埼埾埿堁堃堄堅堈堉堊堌堎堏堐堒堓堔堖堗堘堚堛堜堝堟堢堣堥",4,"堫",4,"報堲堳場堶",7],["8940","堾",5,"塅",6,"塎塏塐塒塓塕塖塗塙",4,"塟",5,"塦",4,"塭",16,"塿墂墄墆墇墈墊墋墌"],["8980","墍",4,"墔",4,"墛墜墝墠",7,"墪",17,"墽墾墿壀壂壃壄壆",10,"壒壓壔壖",13,"壥",5,"壭壯壱売壴壵壷壸壺",7,"夃夅夆夈",4,"夎夐夑夒夓夗夘夛夝夞夠夡夢夣夦夨夬夰夲夳夵夶夻"],["8a40","夽夾夿奀奃奅奆奊奌奍奐奒奓奙奛",4,"奡奣奤奦",12,"奵奷奺奻奼奾奿妀妅妉妋妌妎妏妐妑妔妕妘妚妛妜妝妟妠妡妢妦"],["8a80","妧妬妭妰妱妳",5,"妺妼妽妿",6,"姇姈姉姌姍姎姏姕姖姙姛姞",4,"姤姦姧姩姪姫姭",11,"姺姼姽姾娀娂娊娋娍娎娏娐娒娔娕娖娗娙娚娛娝娞娡娢娤娦娧娨娪",6,"娳娵娷",4,"娽娾娿婁",4,"婇婈婋",9,"婖婗婘婙婛",5],["8b40","婡婣婤婥婦婨婩婫",8,"婸婹婻婼婽婾媀",17,"媓",6,"媜",13,"媫媬"],["8b80","媭",4,"媴媶媷媹",4,"媿嫀嫃",5,"嫊嫋嫍",4,"嫓嫕嫗嫙嫚嫛嫝嫞嫟嫢嫤嫥嫧嫨嫪嫬",4,"嫲",22,"嬊",11,"嬘",25,"嬳嬵嬶嬸",7,"孁",6],["8c40","孈",7,"孒孖孞孠孡孧孨孫孭孮孯孲孴孶孷學孹孻孼孾孿宂宆宊宍宎宐宑宒宔宖実宧宨宩宬宭宮宯宱宲宷宺宻宼寀寁寃寈寉寊寋寍寎寏"],["8c80","寑寔",8,"寠寢寣實寧審",4,"寯寱",6,"寽対尀専尃尅將專尋尌對導尐尒尓尗尙尛尞尟尠尡尣尦尨尩尪尫尭尮尯尰尲尳尵尶尷屃屄屆屇屌屍屒屓屔屖屗屘屚屛屜屝屟屢層屧",6,"屰屲",6,"屻屼屽屾岀岃",4,"岉岊岋岎岏岒岓岕岝",4,"岤",4],["8d40","岪岮岯岰岲岴岶岹岺岻岼岾峀峂峃峅",5,"峌",5,"峓",5,"峚",6,"峢峣峧峩峫峬峮峯峱",9,"峼",4],["8d80","崁崄崅崈",5,"崏",4,"崕崗崘崙崚崜崝崟",4,"崥崨崪崫崬崯",4,"崵",7,"崿",7,"嵈嵉嵍",10,"嵙嵚嵜嵞",10,"嵪嵭嵮嵰嵱嵲嵳嵵",12,"嶃",21,"嶚嶛嶜嶞嶟嶠"],["8e40","嶡",21,"嶸",12,"巆",6,"巎",12,"巜巟巠巣巤巪巬巭"],["8e80","巰巵巶巸",4,"巿帀帄帇帉帊帋帍帎帒帓帗帞",7,"帨",4,"帯帰帲",4,"帹帺帾帿幀幁幃幆",5,"幍",6,"幖",4,"幜幝幟幠幣",14,"幵幷幹幾庁庂広庅庈庉庌庍庎庒庘庛庝庡庢庣庤庨",4,"庮",4,"庴庺庻庼庽庿",6],["8f40","廆廇廈廋",5,"廔廕廗廘廙廚廜",11,"廩廫",8,"廵廸廹廻廼廽弅弆弇弉弌弍弎弐弒弔弖弙弚弜弝弞弡弢弣弤"],["8f80","弨弫弬弮弰弲",6,"弻弽弾弿彁",14,"彑彔彙彚彛彜彞彟彠彣彥彧彨彫彮彯彲彴彵彶彸彺彽彾彿徃徆徍徎徏徑従徔徖徚徛徝從徟徠徢",5,"復徫徬徯",5,"徶徸徹徺徻徾",4,"忇忈忊忋忎忓忔忕忚忛応忞忟忢忣忥忦忨忩忬忯忰忲忳忴忶忷忹忺忼怇"],["9040","怈怉怋怌怐怑怓怗怘怚怞怟怢怣怤怬怭怮怰",4,"怶",4,"怽怾恀恄",6,"恌恎恏恑恓恔恖恗恘恛恜恞恟恠恡恥恦恮恱恲恴恵恷恾悀"],["9080","悁悂悅悆悇悈悊悋悎悏悐悑悓悕悗悘悙悜悞悡悢悤悥悧悩悪悮悰悳悵悶悷悹悺悽",7,"惇惈惉惌",4,"惒惓惔惖惗惙惛惞惡",4,"惪惱惲惵惷惸惻",4,"愂愃愄愅愇愊愋愌愐",4,"愖愗愘愙愛愜愝愞愡愢愥愨愩愪愬",18,"慀",6],["9140","慇慉態慍慏慐慒慓慔慖",6,"慞慟慠慡慣慤慥慦慩",6,"慱慲慳慴慶慸",18,"憌憍憏",4,"憕"],["9180","憖",6,"憞",8,"憪憫憭",9,"憸",5,"憿懀懁懃",4,"應懌",4,"懓懕",16,"懧",13,"懶",8,"戀",5,"戇戉戓戔戙戜戝戞戠戣戦戧戨戩戫戭戯戰戱戲戵戶戸",4,"扂扄扅扆扊"],["9240","扏扐払扖扗扙扚扜",6,"扤扥扨扱扲扴扵扷扸扺扻扽抁抂抃抅抆抇抈抋",5,"抔抙抜抝択抣抦抧抩抪抭抮抯抰抲抳抴抶抷抸抺抾拀拁"],["9280","拃拋拏拑拕拝拞拠拡拤拪拫拰拲拵拸拹拺拻挀挃挄挅挆挊挋挌挍挏挐挒挓挔挕挗挘挙挜挦挧挩挬挭挮挰挱挳",5,"挻挼挾挿捀捁捄捇捈捊捑捒捓捔捖",7,"捠捤捥捦捨捪捫捬捯捰捲捳捴捵捸捹捼捽捾捿掁掃掄掅掆掋掍掑掓掔掕掗掙",6,"採掤掦掫掯掱掲掵掶掹掻掽掿揀"],["9340","揁揂揃揅揇揈揊揋揌揑揓揔揕揗",6,"揟揢揤",4,"揫揬揮揯揰揱揳揵揷揹揺揻揼揾搃搄搆",4,"損搎搑搒搕",5,"搝搟搢搣搤"],["9380","搥搧搨搩搫搮",5,"搵",4,"搻搼搾摀摂摃摉摋",6,"摓摕摖摗摙",4,"摟",7,"摨摪摫摬摮",9,"摻",6,"撃撆撈",8,"撓撔撗撘撚撛撜撝撟",4,"撥撦撧撨撪撫撯撱撲撳撴撶撹撻撽撾撿擁擃擄擆",6,"擏擑擓擔擕擖擙據"],["9440","擛擜擝擟擠擡擣擥擧",24,"攁",7,"攊",7,"攓",4,"攙",8],["9480","攢攣攤攦",4,"攬攭攰攱攲攳攷攺攼攽敀",4,"敆敇敊敋敍敎敐敒敓敔敗敘敚敜敟敠敡敤敥敧敨敩敪敭敮敯敱敳敵敶數",14,"斈斉斊斍斎斏斒斔斕斖斘斚斝斞斠斢斣斦斨斪斬斮斱",7,"斺斻斾斿旀旂旇旈旉旊旍旐旑旓旔旕旘",7,"旡旣旤旪旫"],["9540","旲旳旴旵旸旹旻",4,"昁昄昅昇昈昉昋昍昐昑昒昖昗昘昚昛昜昞昡昢昣昤昦昩昪昫昬昮昰昲昳昷",4,"昽昿晀時晄",6,"晍晎晐晑晘"],["9580","晙晛晜晝晞晠晢晣晥晧晩",4,"晱晲晳晵晸晹晻晼晽晿暀暁暃暅暆暈暉暊暋暍暎暏暐暒暓暔暕暘",4,"暞",8,"暩",4,"暯",4,"暵暶暷暸暺暻暼暽暿",25,"曚曞",7,"曧曨曪",5,"曱曵曶書曺曻曽朁朂會"],["9640","朄朅朆朇朌朎朏朑朒朓朖朘朙朚朜朞朠",5,"朧朩朮朰朲朳朶朷朸朹朻朼朾朿杁杄杅杇杊杋杍杒杔杕杗",4,"杝杢杣杤杦杧杫杬杮東杴杶"],["9680","杸杹杺杻杽枀枂枃枅枆枈枊枌枍枎枏枑枒枓枔枖枙枛枟枠枡枤枦枩枬枮枱枲枴枹",7,"柂柅",9,"柕柖柗柛柟柡柣柤柦柧柨柪柫柭柮柲柵",7,"柾栁栂栃栄栆栍栐栒栔栕栘",4,"栞栟栠栢",6,"栫",6,"栴栵栶栺栻栿桇桋桍桏桒桖",5],["9740","桜桝桞桟桪桬",7,"桵桸",8,"梂梄梇",7,"梐梑梒梔梕梖梘",9,"梣梤梥梩梪梫梬梮梱梲梴梶梷梸"],["9780","梹",6,"棁棃",5,"棊棌棎棏棐棑棓棔棖棗棙棛",4,"棡棢棤",9,"棯棲棳棴棶棷棸棻棽棾棿椀椂椃椄椆",4,"椌椏椑椓",11,"椡椢椣椥",7,"椮椯椱椲椳椵椶椷椸椺椻椼椾楀楁楃",16,"楕楖楘楙楛楜楟"],["9840","楡楢楤楥楧楨楩楪楬業楯楰楲",4,"楺楻楽楾楿榁榃榅榊榋榌榎",5,"榖榗榙榚榝",9,"榩榪榬榮榯榰榲榳榵榶榸榹榺榼榽"],["9880","榾榿槀槂",7,"構槍槏槑槒槓槕",5,"槜槝槞槡",11,"槮槯槰槱槳",9,"槾樀",9,"樋",11,"標",5,"樠樢",5,"権樫樬樭樮樰樲樳樴樶",6,"樿",4,"橅橆橈",7,"橑",6,"橚"],["9940","橜",4,"橢橣橤橦",10,"橲",6,"橺橻橽橾橿檁檂檃檅",8,"檏檒",4,"檘",7,"檡",5],["9980","檧檨檪檭",114,"欥欦欨",6],["9a40","欯欰欱欳欴欵欶欸欻欼欽欿歀歁歂歄歅歈歊歋歍",11,"歚",7,"歨歩歫",13,"歺歽歾歿殀殅殈"],["9a80","殌殎殏殐殑殔殕殗殘殙殜",4,"殢",7,"殫",7,"殶殸",6,"毀毃毄毆",4,"毌毎毐毑毘毚毜",4,"毢",7,"毬毭毮毰毱毲毴毶毷毸毺毻毼毾",6,"氈",4,"氎氒気氜氝氞氠氣氥氫氬氭氱氳氶氷氹氺氻氼氾氿汃汄汅汈汋",4,"汑汒汓汖汘"],["9b40","汙汚汢汣汥汦汧汫",4,"汱汳汵汷汸決汻汼汿沀沄沇沊沋沍沎沑沒沕沖沗沘沚沜沝沞沠沢沨沬沯沰沴沵沶沷沺泀況泂泃泆泇泈泋泍泎泏泑泒泘"],["9b80","泙泚泜泝泟泤泦泧泩泬泭泲泴泹泿洀洂洃洅洆洈洉洊洍洏洐洑洓洔洕洖洘洜洝洟",5,"洦洨洩洬洭洯洰洴洶洷洸洺洿浀浂浄浉浌浐浕浖浗浘浛浝浟浡浢浤浥浧浨浫浬浭浰浱浲浳浵浶浹浺浻浽",4,"涃涄涆涇涊涋涍涏涐涒涖",4,"涜涢涥涬涭涰涱涳涴涶涷涹",5,"淁淂淃淈淉淊"],["9c40","淍淎淏淐淒淓淔淕淗淚淛淜淟淢淣淥淧淨淩淪淭淯淰淲淴淵淶淸淺淽",7,"渆渇済渉渋渏渒渓渕渘渙減渜渞渟渢渦渧渨渪測渮渰渱渳渵"],["9c80","渶渷渹渻",7,"湅",7,"湏湐湑湒湕湗湙湚湜湝湞湠",10,"湬湭湯",14,"満溁溂溄溇溈溊",4,"溑",6,"溙溚溛溝溞溠溡溣溤溦溨溩溫溬溭溮溰溳溵溸溹溼溾溿滀滃滄滅滆滈滉滊滌滍滎滐滒滖滘滙滛滜滝滣滧滪",5],["9d40","滰滱滲滳滵滶滷滸滺",7,"漃漄漅漇漈漊",4,"漐漑漒漖",9,"漡漢漣漥漦漧漨漬漮漰漲漴漵漷",6,"漿潀潁潂"],["9d80","潃潄潅潈潉潊潌潎",9,"潙潚潛潝潟潠潡潣潤潥潧",5,"潯潰潱潳潵潶潷潹潻潽",6,"澅澆澇澊澋澏",12,"澝澞澟澠澢",4,"澨",10,"澴澵澷澸澺",5,"濁濃",5,"濊",6,"濓",10,"濟濢濣濤濥"],["9e40","濦",7,"濰",32,"瀒",7,"瀜",6,"瀤",6],["9e80","瀫",9,"瀶瀷瀸瀺",17,"灍灎灐",13,"灟",11,"灮灱灲灳灴灷灹灺灻災炁炂炃炄炆炇炈炋炌炍炏炐炑炓炗炘炚炛炞",12,"炰炲炴炵炶為炾炿烄烅烆烇烉烋",12,"烚"],["9f40","烜烝烞烠烡烢烣烥烪烮烰",6,"烸烺烻烼烾",10,"焋",4,"焑焒焔焗焛",10,"焧",7,"焲焳焴"],["9f80","焵焷",13,"煆煇煈煉煋煍煏",12,"煝煟",4,"煥煩",4,"煯煰煱煴煵煶煷煹煻煼煾",5,"熅",4,"熋熌熍熎熐熑熒熓熕熖熗熚",4,"熡",6,"熩熪熫熭",5,"熴熶熷熸熺",8,"燄",9,"燏",4],["a040","燖",9,"燡燢燣燤燦燨",5,"燯",9,"燺",11,"爇",19],["a080","爛爜爞",9,"爩爫爭爮爯爲爳爴爺爼爾牀",6,"牉牊牋牎牏牐牑牓牔牕牗牘牚牜牞牠牣牤牥牨牪牫牬牭牰牱牳牴牶牷牸牻牼牽犂犃犅",4,"犌犎犐犑犓",11,"犠",11,"犮犱犲犳犵犺",6,"狅狆狇狉狊狋狌狏狑狓狔狕狖狘狚狛"],["a1a1","　、。·ˉˇ¨〃々—～‖…‘’“”〔〕〈",7,"〖〗【】±×÷∶∧∨∑∏∪∩∈∷√⊥∥∠⌒⊙∫∮≡≌≈∽∝≠≮≯≤≥∞∵∴♂♀°′″℃＄¤￠￡‰§№☆★○●◎◇◆□■△▲※→←↑↓〓"],["a2a1","ⅰ",9],["a2b1","⒈",19,"⑴",19,"①",9],["a2e5","㈠",9],["a2f1","Ⅰ",11],["a3a1","！＂＃￥％",88,"￣"],["a4a1","ぁ",82],["a5a1","ァ",85],["a6a1","Α",16,"Σ",6],["a6c1","α",16,"σ",6],["a6e0","︵︶︹︺︿﹀︽︾﹁﹂﹃﹄"],["a6ee","︻︼︷︸︱"],["a6f4","︳︴"],["a7a1","А",5,"ЁЖ",25],["a7d1","а",5,"ёж",25],["a840","ˊˋ˙–―‥‵℅℉↖↗↘↙∕∟∣≒≦≧⊿═",35,"▁",6],["a880","█",7,"▓▔▕▼▽◢◣◤◥☉⊕〒〝〞"],["a8a1","āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜüêɑ"],["a8bd","ńň"],["a8c0","ɡ"],["a8c5","ㄅ",36],["a940","〡",8,"㊣㎎㎏㎜㎝㎞㎡㏄㏎㏑㏒㏕︰￢￤"],["a959","℡㈱"],["a95c","‐"],["a960","ー゛゜ヽヾ〆ゝゞ﹉",9,"﹔﹕﹖﹗﹙",8],["a980","﹢",4,"﹨﹩﹪﹫"],["a996","〇"],["a9a4","─",75],["aa40","狜狝狟狢",5,"狪狫狵狶狹狽狾狿猀猂猄",5,"猋猌猍猏猐猑猒猔猘猙猚猟猠猣猤猦猧猨猭猯猰猲猳猵猶猺猻猼猽獀",8],["aa80","獉獊獋獌獎獏獑獓獔獕獖獘",7,"獡",10,"獮獰獱"],["ab40","獲",11,"獿",4,"玅玆玈玊玌玍玏玐玒玓玔玕玗玘玙玚玜玝玞玠玡玣",5,"玪玬玭玱玴玵玶玸玹玼玽玾玿珁珃",4],["ab80","珋珌珎珒",6,"珚珛珜珝珟珡珢珣珤珦珨珪珫珬珮珯珰珱珳",4],["ac40","珸",10,"琄琇琈琋琌琍琎琑",8,"琜",5,"琣琤琧琩琫琭琯琱琲琷",4,"琽琾琿瑀瑂",11],["ac80","瑎",6,"瑖瑘瑝瑠",12,"瑮瑯瑱",4,"瑸瑹瑺"],["ad40","瑻瑼瑽瑿璂璄璅璆璈璉璊璌璍璏璑",10,"璝璟",7,"璪",15,"璻",12],["ad80","瓈",9,"瓓",8,"瓝瓟瓡瓥瓧",6,"瓰瓱瓲"],["ae40","瓳瓵瓸",6,"甀甁甂甃甅",7,"甎甐甒甔甕甖甗甛甝甞甠",4,"甦甧甪甮甴甶甹甼甽甿畁畂畃畄畆畇畉畊畍畐畑畒畓畕畖畗畘"],["ae80","畝",7,"畧畨畩畫",6,"畳畵當畷畺",4,"疀疁疂疄疅疇"],["af40","疈疉疊疌疍疎疐疓疕疘疛疜疞疢疦",4,"疭疶疷疺疻疿痀痁痆痋痌痎痏痐痑痓痗痙痚痜痝痟痠痡痥痩痬痭痮痯痲痳痵痶痷痸痺痻痽痾瘂瘄瘆瘇"],["af80","瘈瘉瘋瘍瘎瘏瘑瘒瘓瘔瘖瘚瘜瘝瘞瘡瘣瘧瘨瘬瘮瘯瘱瘲瘶瘷瘹瘺瘻瘽癁療癄"],["b040","癅",6,"癎",5,"癕癗",4,"癝癟癠癡癢癤",6,"癬癭癮癰",7,"癹発發癿皀皁皃皅皉皊皌皍皏皐皒皔皕皗皘皚皛"],["b080","皜",7,"皥",8,"皯皰皳皵",9,"盀盁盃啊阿埃挨哎唉哀皑癌蔼矮艾碍爱隘鞍氨安俺按暗岸胺案肮昂盎凹敖熬翱袄傲奥懊澳芭捌扒叭吧笆八疤巴拔跋靶把耙坝霸罢爸白柏百摆佰败拜稗斑班搬扳般颁板版扮拌伴瓣半办绊邦帮梆榜膀绑棒磅蚌镑傍谤苞胞包褒剥"],["b140","盄盇盉盋盌盓盕盙盚盜盝盞盠",4,"盦",7,"盰盳盵盶盷盺盻盽盿眀眂眃眅眆眊県眎",10,"眛眜眝眞眡眣眤眥眧眪眫"],["b180","眬眮眰",4,"眹眻眽眾眿睂睄睅睆睈",7,"睒",7,"睜薄雹保堡饱宝抱报暴豹鲍爆杯碑悲卑北辈背贝钡倍狈备惫焙被奔苯本笨崩绷甭泵蹦迸逼鼻比鄙笔彼碧蓖蔽毕毙毖币庇痹闭敝弊必辟壁臂避陛鞭边编贬扁便变卞辨辩辫遍标彪膘表鳖憋别瘪彬斌濒滨宾摈兵冰柄丙秉饼炳"],["b240","睝睞睟睠睤睧睩睪睭",11,"睺睻睼瞁瞂瞃瞆",5,"瞏瞐瞓",11,"瞡瞣瞤瞦瞨瞫瞭瞮瞯瞱瞲瞴瞶",4],["b280","瞼瞾矀",12,"矎",8,"矘矙矚矝",4,"矤病并玻菠播拨钵波博勃搏铂箔伯帛舶脖膊渤泊驳捕卜哺补埠不布步簿部怖擦猜裁材才财睬踩采彩菜蔡餐参蚕残惭惨灿苍舱仓沧藏操糙槽曹草厕策侧册测层蹭插叉茬茶查碴搽察岔差诧拆柴豺搀掺蝉馋谗缠铲产阐颤昌猖"],["b340","矦矨矪矯矰矱矲矴矵矷矹矺矻矼砃",5,"砊砋砎砏砐砓砕砙砛砞砠砡砢砤砨砪砫砮砯砱砲砳砵砶砽砿硁硂硃硄硆硈硉硊硋硍硏硑硓硔硘硙硚"],["b380","硛硜硞",11,"硯",7,"硸硹硺硻硽",6,"场尝常长偿肠厂敞畅唱倡超抄钞朝嘲潮巢吵炒车扯撤掣彻澈郴臣辰尘晨忱沉陈趁衬撑称城橙成呈乘程惩澄诚承逞骋秤吃痴持匙池迟弛驰耻齿侈尺赤翅斥炽充冲虫崇宠抽酬畴踌稠愁筹仇绸瞅丑臭初出橱厨躇锄雏滁除楚"],["b440","碄碅碆碈碊碋碏碐碒碔碕碖碙碝碞碠碢碤碦碨",7,"碵碶碷碸確碻碼碽碿磀磂磃磄磆磇磈磌磍磎磏磑磒磓磖磗磘磚",9],["b480","磤磥磦磧磩磪磫磭",4,"磳磵磶磸磹磻",5,"礂礃礄礆",6,"础储矗搐触处揣川穿椽传船喘串疮窗幢床闯创吹炊捶锤垂春椿醇唇淳纯蠢戳绰疵茨磁雌辞慈瓷词此刺赐次聪葱囱匆从丛凑粗醋簇促蹿篡窜摧崔催脆瘁粹淬翠村存寸磋撮搓措挫错搭达答瘩打大呆歹傣戴带殆代贷袋待逮"],["b540","礍",5,"礔",9,"礟",4,"礥",14,"礵",4,"礽礿祂祃祄祅祇祊",8,"祔祕祘祙祡祣"],["b580","祤祦祩祪祫祬祮祰",6,"祹祻",4,"禂禃禆禇禈禉禋禌禍禎禐禑禒怠耽担丹单郸掸胆旦氮但惮淡诞弹蛋当挡党荡档刀捣蹈倒岛祷导到稻悼道盗德得的蹬灯登等瞪凳邓堤低滴迪敌笛狄涤翟嫡抵底地蒂第帝弟递缔颠掂滇碘点典靛垫电佃甸店惦奠淀殿碉叼雕凋刁掉吊钓调跌爹碟蝶迭谍叠"],["b640","禓",6,"禛",11,"禨",10,"禴",4,"禼禿秂秄秅秇秈秊秌秎秏秐秓秔秖秗秙",5,"秠秡秢秥秨秪"],["b680","秬秮秱",6,"秹秺秼秾秿稁稄稅稇稈稉稊稌稏",4,"稕稖稘稙稛稜丁盯叮钉顶鼎锭定订丢东冬董懂动栋侗恫冻洞兜抖斗陡豆逗痘都督毒犊独读堵睹赌杜镀肚度渡妒端短锻段断缎堆兑队对墩吨蹲敦顿囤钝盾遁掇哆多夺垛躲朵跺舵剁惰堕蛾峨鹅俄额讹娥恶厄扼遏鄂饿恩而儿耳尔饵洱二"],["b740","稝稟稡稢稤",14,"稴稵稶稸稺稾穀",5,"穇",9,"穒",4,"穘",16],["b780","穩",6,"穱穲穳穵穻穼穽穾窂窅窇窉窊窋窌窎窏窐窓窔窙窚窛窞窡窢贰发罚筏伐乏阀法珐藩帆番翻樊矾钒繁凡烦反返范贩犯饭泛坊芳方肪房防妨仿访纺放菲非啡飞肥匪诽吠肺废沸费芬酚吩氛分纷坟焚汾粉奋份忿愤粪丰封枫蜂峰锋风疯烽逢冯缝讽奉凤佛否夫敷肤孵扶拂辐幅氟符伏俘服"],["b840","窣窤窧窩窪窫窮",4,"窴",10,"竀",10,"竌",9,"竗竘竚竛竜竝竡竢竤竧",5,"竮竰竱竲竳"],["b880","竴",4,"竻竼竾笀笁笂笅笇笉笌笍笎笐笒笓笖笗笘笚笜笝笟笡笢笣笧笩笭浮涪福袱弗甫抚辅俯釜斧脯腑府腐赴副覆赋复傅付阜父腹负富讣附妇缚咐噶嘎该改概钙盖溉干甘杆柑竿肝赶感秆敢赣冈刚钢缸肛纲岗港杠篙皋高膏羔糕搞镐稿告哥歌搁戈鸽胳疙割革葛格蛤阁隔铬个各给根跟耕更庚羹"],["b940","笯笰笲笴笵笶笷笹笻笽笿",5,"筆筈筊筍筎筓筕筗筙筜筞筟筡筣",10,"筯筰筳筴筶筸筺筼筽筿箁箂箃箄箆",6,"箎箏"],["b980","箑箒箓箖箘箙箚箛箞箟箠箣箤箥箮箯箰箲箳箵箶箷箹",7,"篂篃範埂耿梗工攻功恭龚供躬公宫弓巩汞拱贡共钩勾沟苟狗垢构购够辜菇咕箍估沽孤姑鼓古蛊骨谷股故顾固雇刮瓜剐寡挂褂乖拐怪棺关官冠观管馆罐惯灌贯光广逛瑰规圭硅归龟闺轨鬼诡癸桂柜跪贵刽辊滚棍锅郭国果裹过哈"],["ba40","篅篈築篊篋篍篎篏篐篒篔",4,"篛篜篞篟篠篢篣篤篧篨篩篫篬篭篯篰篲",4,"篸篹篺篻篽篿",7,"簈簉簊簍簎簐",5,"簗簘簙"],["ba80","簚",4,"簠",5,"簨簩簫",12,"簹",5,"籂骸孩海氦亥害骇酣憨邯韩含涵寒函喊罕翰撼捍旱憾悍焊汗汉夯杭航壕嚎豪毫郝好耗号浩呵喝荷菏核禾和何合盒貉阂河涸赫褐鹤贺嘿黑痕很狠恨哼亨横衡恒轰哄烘虹鸿洪宏弘红喉侯猴吼厚候后呼乎忽瑚壶葫胡蝴狐糊湖"],["bb40","籃",9,"籎",36,"籵",5,"籾",9],["bb80","粈粊",6,"粓粔粖粙粚粛粠粡粣粦粧粨粩粫粬粭粯粰粴",4,"粺粻弧虎唬护互沪户花哗华猾滑画划化话槐徊怀淮坏欢环桓还缓换患唤痪豢焕涣宦幻荒慌黄磺蝗簧皇凰惶煌晃幌恍谎灰挥辉徽恢蛔回毁悔慧卉惠晦贿秽会烩汇讳诲绘荤昏婚魂浑混豁活伙火获或惑霍货祸击圾基机畸稽积箕"],["bc40","粿糀糂糃糄糆糉糋糎",6,"糘糚糛糝糞糡",6,"糩",5,"糰",7,"糹糺糼",13,"紋",5],["bc80","紑",14,"紡紣紤紥紦紨紩紪紬紭紮細",6,"肌饥迹激讥鸡姬绩缉吉极棘辑籍集及急疾汲即嫉级挤几脊己蓟技冀季伎祭剂悸济寄寂计记既忌际妓继纪嘉枷夹佳家加荚颊贾甲钾假稼价架驾嫁歼监坚尖笺间煎兼肩艰奸缄茧检柬碱硷拣捡简俭剪减荐槛鉴践贱见键箭件"],["bd40","紷",54,"絯",7],["bd80","絸",32,"健舰剑饯渐溅涧建僵姜将浆江疆蒋桨奖讲匠酱降蕉椒礁焦胶交郊浇骄娇嚼搅铰矫侥脚狡角饺缴绞剿教酵轿较叫窖揭接皆秸街阶截劫节桔杰捷睫竭洁结解姐戒藉芥界借介疥诫届巾筋斤金今津襟紧锦仅谨进靳晋禁近烬浸"],["be40","継",12,"綧",6,"綯",42],["be80","線",32,"尽劲荆兢茎睛晶鲸京惊精粳经井警景颈静境敬镜径痉靖竟竞净炯窘揪究纠玖韭久灸九酒厩救旧臼舅咎就疚鞠拘狙疽居驹菊局咀矩举沮聚拒据巨具距踞锯俱句惧炬剧捐鹃娟倦眷卷绢撅攫抉掘倔爵觉决诀绝均菌钧军君峻"],["bf40","緻",62],["bf80","縺縼",4,"繂",4,"繈",21,"俊竣浚郡骏喀咖卡咯开揩楷凯慨刊堪勘坎砍看康慷糠扛抗亢炕考拷烤靠坷苛柯棵磕颗科壳咳可渴克刻客课肯啃垦恳坑吭空恐孔控抠口扣寇枯哭窟苦酷库裤夸垮挎跨胯块筷侩快宽款匡筐狂框矿眶旷况亏盔岿窥葵奎魁傀"],["c040","繞",35,"纃",23,"纜纝纞"],["c080","纮纴纻纼绖绤绬绹缊缐缞缷缹缻",6,"罃罆",9,"罒罓馈愧溃坤昆捆困括扩廓阔垃拉喇蜡腊辣啦莱来赖蓝婪栏拦篮阑兰澜谰揽览懒缆烂滥琅榔狼廊郎朗浪捞劳牢老佬姥酪烙涝勒乐雷镭蕾磊累儡垒擂肋类泪棱楞冷厘梨犁黎篱狸离漓理李里鲤礼莉荔吏栗丽厉励砾历利傈例俐"],["c140","罖罙罛罜罝罞罠罣",4,"罫罬罭罯罰罳罵罶罷罸罺罻罼罽罿羀羂",7,"羋羍羏",4,"羕",4,"羛羜羠羢羣羥羦羨",6,"羱"],["c180","羳",4,"羺羻羾翀翂翃翄翆翇翈翉翋翍翏",4,"翖翗翙",5,"翢翣痢立粒沥隶力璃哩俩联莲连镰廉怜涟帘敛脸链恋炼练粮凉梁粱良两辆量晾亮谅撩聊僚疗燎寥辽潦了撂镣廖料列裂烈劣猎琳林磷霖临邻鳞淋凛赁吝拎玲菱零龄铃伶羚凌灵陵岭领另令溜琉榴硫馏留刘瘤流柳六龙聋咙笼窿"],["c240","翤翧翨翪翫翬翭翯翲翴",6,"翽翾翿耂耇耈耉耊耎耏耑耓耚耛耝耞耟耡耣耤耫",5,"耲耴耹耺耼耾聀聁聄聅聇聈聉聎聏聐聑聓聕聖聗"],["c280","聙聛",13,"聫",5,"聲",11,"隆垄拢陇楼娄搂篓漏陋芦卢颅庐炉掳卤虏鲁麓碌露路赂鹿潞禄录陆戮驴吕铝侣旅履屡缕虑氯律率滤绿峦挛孪滦卵乱掠略抡轮伦仑沦纶论萝螺罗逻锣箩骡裸落洛骆络妈麻玛码蚂马骂嘛吗埋买麦卖迈脉瞒馒蛮满蔓曼慢漫"],["c340","聾肁肂肅肈肊肍",5,"肔肕肗肙肞肣肦肧肨肬肰肳肵肶肸肹肻胅胇",4,"胏",6,"胘胟胠胢胣胦胮胵胷胹胻胾胿脀脁脃脄脅脇脈脋"],["c380","脌脕脗脙脛脜脝脟",12,"脭脮脰脳脴脵脷脹",4,"脿谩芒茫盲氓忙莽猫茅锚毛矛铆卯茂冒帽貌贸么玫枚梅酶霉煤没眉媒镁每美昧寐妹媚门闷们萌蒙檬盟锰猛梦孟眯醚靡糜迷谜弥米秘觅泌蜜密幂棉眠绵冕免勉娩缅面苗描瞄藐秒渺庙妙蔑灭民抿皿敏悯闽明螟鸣铭名命谬摸"],["c440","腀",5,"腇腉腍腎腏腒腖腗腘腛",4,"腡腢腣腤腦腨腪腫腬腯腲腳腵腶腷腸膁膃",4,"膉膋膌膍膎膐膒",5,"膙膚膞",4,"膤膥"],["c480","膧膩膫",7,"膴",5,"膼膽膾膿臄臅臇臈臉臋臍",6,"摹蘑模膜磨摩魔抹末莫墨默沫漠寞陌谋牟某拇牡亩姆母墓暮幕募慕木目睦牧穆拿哪呐钠那娜纳氖乃奶耐奈南男难囊挠脑恼闹淖呢馁内嫩能妮霓倪泥尼拟你匿腻逆溺蔫拈年碾撵捻念娘酿鸟尿捏聂孽啮镊镍涅您柠狞凝宁"],["c540","臔",14,"臤臥臦臨臩臫臮",4,"臵",5,"臽臿舃與",4,"舎舏舑舓舕",5,"舝舠舤舥舦舧舩舮舲舺舼舽舿"],["c580","艀艁艂艃艅艆艈艊艌艍艎艐",7,"艙艛艜艝艞艠",7,"艩拧泞牛扭钮纽脓浓农弄奴努怒女暖虐疟挪懦糯诺哦欧鸥殴藕呕偶沤啪趴爬帕怕琶拍排牌徘湃派攀潘盘磐盼畔判叛乓庞旁耪胖抛咆刨炮袍跑泡呸胚培裴赔陪配佩沛喷盆砰抨烹澎彭蓬棚硼篷膨朋鹏捧碰坯砒霹批披劈琵毗"],["c640","艪艫艬艭艱艵艶艷艸艻艼芀芁芃芅芆芇芉芌芐芓芔芕芖芚芛芞芠芢芣芧芲芵芶芺芻芼芿苀苂苃苅苆苉苐苖苙苚苝苢苧苨苩苪苬苭苮苰苲苳苵苶苸"],["c680","苺苼",4,"茊茋茍茐茒茓茖茘茙茝",9,"茩茪茮茰茲茷茻茽啤脾疲皮匹痞僻屁譬篇偏片骗飘漂瓢票撇瞥拼频贫品聘乒坪苹萍平凭瓶评屏坡泼颇婆破魄迫粕剖扑铺仆莆葡菩蒲埔朴圃普浦谱曝瀑期欺栖戚妻七凄漆柒沏其棋奇歧畦崎脐齐旗祈祁骑起岂乞企启契砌器气迄弃汽泣讫掐"],["c740","茾茿荁荂荄荅荈荊",4,"荓荕",4,"荝荢荰",6,"荹荺荾",6,"莇莈莊莋莌莍莏莐莑莔莕莖莗莙莚莝莟莡",6,"莬莭莮"],["c780","莯莵莻莾莿菂菃菄菆菈菉菋菍菎菐菑菒菓菕菗菙菚菛菞菢菣菤菦菧菨菫菬菭恰洽牵扦钎铅千迁签仟谦乾黔钱钳前潜遣浅谴堑嵌欠歉枪呛腔羌墙蔷强抢橇锹敲悄桥瞧乔侨巧鞘撬翘峭俏窍切茄且怯窃钦侵亲秦琴勤芹擒禽寝沁青轻氢倾卿清擎晴氰情顷请庆琼穷秋丘邱球求囚酋泅趋区蛆曲躯屈驱渠"],["c840","菮華菳",4,"菺菻菼菾菿萀萂萅萇萈萉萊萐萒",5,"萙萚萛萞",5,"萩",7,"萲",5,"萹萺萻萾",7,"葇葈葉"],["c880","葊",6,"葒",4,"葘葝葞葟葠葢葤",4,"葪葮葯葰葲葴葷葹葻葼取娶龋趣去圈颧权醛泉全痊拳犬券劝缺炔瘸却鹊榷确雀裙群然燃冉染瓤壤攘嚷让饶扰绕惹热壬仁人忍韧任认刃妊纫扔仍日戎茸蓉荣融熔溶容绒冗揉柔肉茹蠕儒孺如辱乳汝入褥软阮蕊瑞锐闰润若弱撒洒萨腮鳃塞赛三叁"],["c940","葽",4,"蒃蒄蒅蒆蒊蒍蒏",7,"蒘蒚蒛蒝蒞蒟蒠蒢",12,"蒰蒱蒳蒵蒶蒷蒻蒼蒾蓀蓂蓃蓅蓆蓇蓈蓋蓌蓎蓏蓒蓔蓕蓗"],["c980","蓘",4,"蓞蓡蓢蓤蓧",4,"蓭蓮蓯蓱",10,"蓽蓾蔀蔁蔂伞散桑嗓丧搔骚扫嫂瑟色涩森僧莎砂杀刹沙纱傻啥煞筛晒珊苫杉山删煽衫闪陕擅赡膳善汕扇缮墒伤商赏晌上尚裳梢捎稍烧芍勺韶少哨邵绍奢赊蛇舌舍赦摄射慑涉社设砷申呻伸身深娠绅神沈审婶甚肾慎渗声生甥牲升绳"],["ca40","蔃",8,"蔍蔎蔏蔐蔒蔔蔕蔖蔘蔙蔛蔜蔝蔞蔠蔢",8,"蔭",9,"蔾",4,"蕄蕅蕆蕇蕋",10],["ca80","蕗蕘蕚蕛蕜蕝蕟",4,"蕥蕦蕧蕩",8,"蕳蕵蕶蕷蕸蕼蕽蕿薀薁省盛剩胜圣师失狮施湿诗尸虱十石拾时什食蚀实识史矢使屎驶始式示士世柿事拭誓逝势是嗜噬适仕侍释饰氏市恃室视试收手首守寿授售受瘦兽蔬枢梳殊抒输叔舒淑疏书赎孰熟薯暑曙署蜀黍鼠属术述树束戍竖墅庶数漱"],["cb40","薂薃薆薈",6,"薐",10,"薝",6,"薥薦薧薩薫薬薭薱",5,"薸薺",6,"藂",6,"藊",4,"藑藒"],["cb80","藔藖",5,"藝",6,"藥藦藧藨藪",14,"恕刷耍摔衰甩帅栓拴霜双爽谁水睡税吮瞬顺舜说硕朔烁斯撕嘶思私司丝死肆寺嗣四伺似饲巳松耸怂颂送宋讼诵搜艘擞嗽苏酥俗素速粟僳塑溯宿诉肃酸蒜算虽隋随绥髓碎岁穗遂隧祟孙损笋蓑梭唆缩琐索锁所塌他它她塔"],["cc40","藹藺藼藽藾蘀",4,"蘆",10,"蘒蘓蘔蘕蘗",15,"蘨蘪",13,"蘹蘺蘻蘽蘾蘿虀"],["cc80","虁",11,"虒虓處",4,"虛虜虝號虠虡虣",7,"獭挞蹋踏胎苔抬台泰酞太态汰坍摊贪瘫滩坛檀痰潭谭谈坦毯袒碳探叹炭汤塘搪堂棠膛唐糖倘躺淌趟烫掏涛滔绦萄桃逃淘陶讨套特藤腾疼誊梯剔踢锑提题蹄啼体替嚏惕涕剃屉天添填田甜恬舔腆挑条迢眺跳贴铁帖厅听烃"],["cd40","虭虯虰虲",6,"蚃",6,"蚎",4,"蚔蚖",5,"蚞",4,"蚥蚦蚫蚭蚮蚲蚳蚷蚸蚹蚻",4,"蛁蛂蛃蛅蛈蛌蛍蛒蛓蛕蛖蛗蛚蛜"],["cd80","蛝蛠蛡蛢蛣蛥蛦蛧蛨蛪蛫蛬蛯蛵蛶蛷蛺蛻蛼蛽蛿蜁蜄蜅蜆蜋蜌蜎蜏蜐蜑蜔蜖汀廷停亭庭挺艇通桐酮瞳同铜彤童桶捅筒统痛偷投头透凸秃突图徒途涂屠土吐兔湍团推颓腿蜕褪退吞屯臀拖托脱鸵陀驮驼椭妥拓唾挖哇蛙洼娃瓦袜歪外豌弯湾玩顽丸烷完碗挽晚皖惋宛婉万腕汪王亡枉网往旺望忘妄威"],["ce40","蜙蜛蜝蜟蜠蜤蜦蜧蜨蜪蜫蜬蜭蜯蜰蜲蜳蜵蜶蜸蜹蜺蜼蜽蝀",6,"蝊蝋蝍蝏蝐蝑蝒蝔蝕蝖蝘蝚",5,"蝡蝢蝦",7,"蝯蝱蝲蝳蝵"],["ce80","蝷蝸蝹蝺蝿螀螁螄螆螇螉螊螌螎",4,"螔螕螖螘",6,"螠",4,"巍微危韦违桅围唯惟为潍维苇萎委伟伪尾纬未蔚味畏胃喂魏位渭谓尉慰卫瘟温蚊文闻纹吻稳紊问嗡翁瓮挝蜗涡窝我斡卧握沃巫呜钨乌污诬屋无芜梧吾吴毋武五捂午舞伍侮坞戊雾晤物勿务悟误昔熙析西硒矽晰嘻吸锡牺"],["cf40","螥螦螧螩螪螮螰螱螲螴螶螷螸螹螻螼螾螿蟁",4,"蟇蟈蟉蟌",4,"蟔",6,"蟜蟝蟞蟟蟡蟢蟣蟤蟦蟧蟨蟩蟫蟬蟭蟯",9],["cf80","蟺蟻蟼蟽蟿蠀蠁蠂蠄",5,"蠋",7,"蠔蠗蠘蠙蠚蠜",4,"蠣稀息希悉膝夕惜熄烯溪汐犀檄袭席习媳喜铣洗系隙戏细瞎虾匣霞辖暇峡侠狭下厦夏吓掀锨先仙鲜纤咸贤衔舷闲涎弦嫌显险现献县腺馅羡宪陷限线相厢镶香箱襄湘乡翔祥详想响享项巷橡像向象萧硝霄削哮嚣销消宵淆晓"],["d040","蠤",13,"蠳",5,"蠺蠻蠽蠾蠿衁衂衃衆",5,"衎",5,"衕衖衘衚",6,"衦衧衪衭衯衱衳衴衵衶衸衹衺"],["d080","衻衼袀袃袆袇袉袊袌袎袏袐袑袓袔袕袗",4,"袝",4,"袣袥",5,"小孝校肖啸笑效楔些歇蝎鞋协挟携邪斜胁谐写械卸蟹懈泄泻谢屑薪芯锌欣辛新忻心信衅星腥猩惺兴刑型形邢行醒幸杏性姓兄凶胸匈汹雄熊休修羞朽嗅锈秀袖绣墟戌需虚嘘须徐许蓄酗叙旭序畜恤絮婿绪续轩喧宣悬旋玄"],["d140","袬袮袯袰袲",4,"袸袹袺袻袽袾袿裀裃裄裇裈裊裋裌裍裏裐裑裓裖裗裚",4,"裠裡裦裧裩",6,"裲裵裶裷裺裻製裿褀褁褃",5],["d180","褉褋",4,"褑褔",4,"褜",4,"褢褣褤褦褧褨褩褬褭褮褯褱褲褳褵褷选癣眩绚靴薛学穴雪血勋熏循旬询寻驯巡殉汛训讯逊迅压押鸦鸭呀丫芽牙蚜崖衙涯雅哑亚讶焉咽阉烟淹盐严研蜒岩延言颜阎炎沿奄掩眼衍演艳堰燕厌砚雁唁彦焰宴谚验殃央鸯秧杨扬佯疡羊洋阳氧仰痒养样漾邀腰妖瑶"],["d240","褸",8,"襂襃襅",24,"襠",5,"襧",19,"襼"],["d280","襽襾覀覂覄覅覇",26,"摇尧遥窑谣姚咬舀药要耀椰噎耶爷野冶也页掖业叶曳腋夜液一壹医揖铱依伊衣颐夷遗移仪胰疑沂宜姨彝椅蚁倚已乙矣以艺抑易邑屹亿役臆逸肄疫亦裔意毅忆义益溢诣议谊译异翼翌绎茵荫因殷音阴姻吟银淫寅饮尹引隐"],["d340","覢",30,"觃觍觓觔觕觗觘觙觛觝觟觠觡觢觤觧觨觩觪觬觭觮觰觱觲觴",6],["d380","觻",4,"訁",5,"計",21,"印英樱婴鹰应缨莹萤营荧蝇迎赢盈影颖硬映哟拥佣臃痈庸雍踊蛹咏泳涌永恿勇用幽优悠忧尤由邮铀犹油游酉有友右佑釉诱又幼迂淤于盂榆虞愚舆余俞逾鱼愉渝渔隅予娱雨与屿禹宇语羽玉域芋郁吁遇喻峪御愈欲狱育誉"],["d440","訞",31,"訿",8,"詉",21],["d480","詟",25,"詺",6,"浴寓裕预豫驭鸳渊冤元垣袁原援辕园员圆猿源缘远苑愿怨院曰约越跃钥岳粤月悦阅耘云郧匀陨允运蕴酝晕韵孕匝砸杂栽哉灾宰载再在咱攒暂赞赃脏葬遭糟凿藻枣早澡蚤躁噪造皂灶燥责择则泽贼怎增憎曾赠扎喳渣札轧"],["d540","誁",7,"誋",7,"誔",46],["d580","諃",32,"铡闸眨栅榨咋乍炸诈摘斋宅窄债寨瞻毡詹粘沾盏斩辗崭展蘸栈占战站湛绽樟章彰漳张掌涨杖丈帐账仗胀瘴障招昭找沼赵照罩兆肇召遮折哲蛰辙者锗蔗这浙珍斟真甄砧臻贞针侦枕疹诊震振镇阵蒸挣睁征狰争怔整拯正政"],["d640","諤",34,"謈",27],["d680","謤謥謧",30,"帧症郑证芝枝支吱蜘知肢脂汁之织职直植殖执值侄址指止趾只旨纸志挚掷至致置帜峙制智秩稚质炙痔滞治窒中盅忠钟衷终种肿重仲众舟周州洲诌粥轴肘帚咒皱宙昼骤珠株蛛朱猪诸诛逐竹烛煮拄瞩嘱主著柱助蛀贮铸筑"],["d740","譆",31,"譧",4,"譭",25],["d780","讇",24,"讬讱讻诇诐诪谉谞住注祝驻抓爪拽专砖转撰赚篆桩庄装妆撞壮状椎锥追赘坠缀谆准捉拙卓桌琢茁酌啄着灼浊兹咨资姿滋淄孜紫仔籽滓子自渍字鬃棕踪宗综总纵邹走奏揍租足卒族祖诅阻组钻纂嘴醉最罪尊遵昨左佐柞做作坐座"],["d840","谸",8,"豂豃豄豅豈豊豋豍",7,"豖豗豘豙豛",5,"豣",6,"豬",6,"豴豵豶豷豻",6,"貃貄貆貇"],["d880","貈貋貍",6,"貕貖貗貙",20,"亍丌兀丐廿卅丕亘丞鬲孬噩丨禺丿匕乇夭爻卮氐囟胤馗毓睾鼗丶亟鼐乜乩亓芈孛啬嘏仄厍厝厣厥厮靥赝匚叵匦匮匾赜卦卣刂刈刎刭刳刿剀剌剞剡剜蒯剽劂劁劐劓冂罔亻仃仉仂仨仡仫仞伛仳伢佤仵伥伧伉伫佞佧攸佚佝"],["d940","貮",62],["d980","賭",32,"佟佗伲伽佶佴侑侉侃侏佾佻侪佼侬侔俦俨俪俅俚俣俜俑俟俸倩偌俳倬倏倮倭俾倜倌倥倨偾偃偕偈偎偬偻傥傧傩傺僖儆僭僬僦僮儇儋仝氽佘佥俎龠汆籴兮巽黉馘冁夔勹匍訇匐凫夙兕亠兖亳衮袤亵脔裒禀嬴蠃羸冫冱冽冼"],["da40","贎",14,"贠赑赒赗赟赥赨赩赪赬赮赯赱赲赸",8,"趂趃趆趇趈趉趌",4,"趒趓趕",9,"趠趡"],["da80","趢趤",12,"趲趶趷趹趻趽跀跁跂跅跇跈跉跊跍跐跒跓跔凇冖冢冥讠讦讧讪讴讵讷诂诃诋诏诎诒诓诔诖诘诙诜诟诠诤诨诩诮诰诳诶诹诼诿谀谂谄谇谌谏谑谒谔谕谖谙谛谘谝谟谠谡谥谧谪谫谮谯谲谳谵谶卩卺阝阢阡阱阪阽阼陂陉陔陟陧陬陲陴隈隍隗隰邗邛邝邙邬邡邴邳邶邺"],["db40","跕跘跙跜跠跡跢跥跦跧跩跭跮跰跱跲跴跶跼跾",6,"踆踇踈踋踍踎踐踑踒踓踕",7,"踠踡踤",4,"踫踭踰踲踳踴踶踷踸踻踼踾"],["db80","踿蹃蹅蹆蹌",4,"蹓",5,"蹚",11,"蹧蹨蹪蹫蹮蹱邸邰郏郅邾郐郄郇郓郦郢郜郗郛郫郯郾鄄鄢鄞鄣鄱鄯鄹酃酆刍奂劢劬劭劾哿勐勖勰叟燮矍廴凵凼鬯厶弁畚巯坌垩垡塾墼壅壑圩圬圪圳圹圮圯坜圻坂坩垅坫垆坼坻坨坭坶坳垭垤垌垲埏垧垴垓垠埕埘埚埙埒垸埴埯埸埤埝"],["dc40","蹳蹵蹷",4,"蹽蹾躀躂躃躄躆躈",6,"躑躒躓躕",6,"躝躟",11,"躭躮躰躱躳",6,"躻",7],["dc80","軃",10,"軏",21,"堋堍埽埭堀堞堙塄堠塥塬墁墉墚墀馨鼙懿艹艽艿芏芊芨芄芎芑芗芙芫芸芾芰苈苊苣芘芷芮苋苌苁芩芴芡芪芟苄苎芤苡茉苷苤茏茇苜苴苒苘茌苻苓茑茚茆茔茕苠苕茜荑荛荜茈莒茼茴茱莛荞茯荏荇荃荟荀茗荠茭茺茳荦荥"],["dd40","軥",62],["dd80","輤",32,"荨茛荩荬荪荭荮莰荸莳莴莠莪莓莜莅荼莶莩荽莸荻莘莞莨莺莼菁萁菥菘堇萘萋菝菽菖萜萸萑萆菔菟萏萃菸菹菪菅菀萦菰菡葜葑葚葙葳蒇蒈葺蒉葸萼葆葩葶蒌蒎萱葭蓁蓍蓐蓦蒽蓓蓊蒿蒺蓠蒡蒹蒴蒗蓥蓣蔌甍蔸蓰蔹蔟蔺"],["de40","轅",32,"轪辀辌辒辝辠辡辢辤辥辦辧辪辬辭辮辯農辳辴辵辷辸辺辻込辿迀迃迆"],["de80","迉",4,"迏迒迖迗迚迠迡迣迧迬迯迱迲迴迵迶迺迻迼迾迿逇逈逌逎逓逕逘蕖蔻蓿蓼蕙蕈蕨蕤蕞蕺瞢蕃蕲蕻薤薨薇薏蕹薮薜薅薹薷薰藓藁藜藿蘧蘅蘩蘖蘼廾弈夼奁耷奕奚奘匏尢尥尬尴扌扪抟抻拊拚拗拮挢拶挹捋捃掭揶捱捺掎掴捭掬掊捩掮掼揲揸揠揿揄揞揎摒揆掾摅摁搋搛搠搌搦搡摞撄摭撖"],["df40","這逜連逤逥逧",5,"逰",4,"逷逹逺逽逿遀遃遅遆遈",4,"過達違遖遙遚遜",5,"遤遦遧適遪遫遬遯",4,"遶",6,"遾邁"],["df80","還邅邆邇邉邊邌",4,"邒邔邖邘邚邜邞邟邠邤邥邧邨邩邫邭邲邷邼邽邿郀摺撷撸撙撺擀擐擗擤擢攉攥攮弋忒甙弑卟叱叽叩叨叻吒吖吆呋呒呓呔呖呃吡呗呙吣吲咂咔呷呱呤咚咛咄呶呦咝哐咭哂咴哒咧咦哓哔呲咣哕咻咿哌哙哚哜咩咪咤哝哏哞唛哧唠哽唔哳唢唣唏唑唧唪啧喏喵啉啭啁啕唿啐唼"],["e040","郂郃郆郈郉郋郌郍郒郔郕郖郘郙郚郞郟郠郣郤郥郩郪郬郮郰郱郲郳郵郶郷郹郺郻郼郿鄀鄁鄃鄅",19,"鄚鄛鄜"],["e080","鄝鄟鄠鄡鄤",10,"鄰鄲",6,"鄺",8,"酄唷啖啵啶啷唳唰啜喋嗒喃喱喹喈喁喟啾嗖喑啻嗟喽喾喔喙嗪嗷嗉嘟嗑嗫嗬嗔嗦嗝嗄嗯嗥嗲嗳嗌嗍嗨嗵嗤辔嘞嘈嘌嘁嘤嘣嗾嘀嘧嘭噘嘹噗嘬噍噢噙噜噌噔嚆噤噱噫噻噼嚅嚓嚯囔囗囝囡囵囫囹囿圄圊圉圜帏帙帔帑帱帻帼"],["e140","酅酇酈酑酓酔酕酖酘酙酛酜酟酠酦酧酨酫酭酳酺酻酼醀",4,"醆醈醊醎醏醓",6,"醜",5,"醤",5,"醫醬醰醱醲醳醶醷醸醹醻"],["e180","醼",10,"釈釋釐釒",9,"針",8,"帷幄幔幛幞幡岌屺岍岐岖岈岘岙岑岚岜岵岢岽岬岫岱岣峁岷峄峒峤峋峥崂崃崧崦崮崤崞崆崛嵘崾崴崽嵬嵛嵯嵝嵫嵋嵊嵩嵴嶂嶙嶝豳嶷巅彳彷徂徇徉後徕徙徜徨徭徵徼衢彡犭犰犴犷犸狃狁狎狍狒狨狯狩狲狴狷猁狳猃狺"],["e240","釦",62],["e280","鈥",32,"狻猗猓猡猊猞猝猕猢猹猥猬猸猱獐獍獗獠獬獯獾舛夥飧夤夂饣饧",5,"饴饷饽馀馄馇馊馍馐馑馓馔馕庀庑庋庖庥庠庹庵庾庳赓廒廑廛廨廪膺忄忉忖忏怃忮怄忡忤忾怅怆忪忭忸怙怵怦怛怏怍怩怫怊怿怡恸恹恻恺恂"],["e340","鉆",45,"鉵",16],["e380","銆",7,"銏",24,"恪恽悖悚悭悝悃悒悌悛惬悻悱惝惘惆惚悴愠愦愕愣惴愀愎愫慊慵憬憔憧憷懔懵忝隳闩闫闱闳闵闶闼闾阃阄阆阈阊阋阌阍阏阒阕阖阗阙阚丬爿戕氵汔汜汊沣沅沐沔沌汨汩汴汶沆沩泐泔沭泷泸泱泗沲泠泖泺泫泮沱泓泯泾"],["e440","銨",5,"銯",24,"鋉",31],["e480","鋩",32,"洹洧洌浃浈洇洄洙洎洫浍洮洵洚浏浒浔洳涑浯涞涠浞涓涔浜浠浼浣渚淇淅淞渎涿淠渑淦淝淙渖涫渌涮渫湮湎湫溲湟溆湓湔渲渥湄滟溱溘滠漭滢溥溧溽溻溷滗溴滏溏滂溟潢潆潇漤漕滹漯漶潋潴漪漉漩澉澍澌潸潲潼潺濑"],["e540","錊",51,"錿",10],["e580","鍊",31,"鍫濉澧澹澶濂濡濮濞濠濯瀚瀣瀛瀹瀵灏灞宀宄宕宓宥宸甯骞搴寤寮褰寰蹇謇辶迓迕迥迮迤迩迦迳迨逅逄逋逦逑逍逖逡逵逶逭逯遄遑遒遐遨遘遢遛暹遴遽邂邈邃邋彐彗彖彘尻咫屐屙孱屣屦羼弪弩弭艴弼鬻屮妁妃妍妩妪妣"],["e640","鍬",34,"鎐",27],["e680","鎬",29,"鏋鏌鏍妗姊妫妞妤姒妲妯姗妾娅娆姝娈姣姘姹娌娉娲娴娑娣娓婀婧婊婕娼婢婵胬媪媛婷婺媾嫫媲嫒嫔媸嫠嫣嫱嫖嫦嫘嫜嬉嬗嬖嬲嬷孀尕尜孚孥孳孑孓孢驵驷驸驺驿驽骀骁骅骈骊骐骒骓骖骘骛骜骝骟骠骢骣骥骧纟纡纣纥纨纩"],["e740","鏎",7,"鏗",54],["e780","鐎",32,"纭纰纾绀绁绂绉绋绌绐绔绗绛绠绡绨绫绮绯绱绲缍绶绺绻绾缁缂缃缇缈缋缌缏缑缒缗缙缜缛缟缡",6,"缪缫缬缭缯",4,"缵幺畿巛甾邕玎玑玮玢玟珏珂珑玷玳珀珉珈珥珙顼琊珩珧珞玺珲琏琪瑛琦琥琨琰琮琬"],["e840","鐯",14,"鐿",43,"鑬鑭鑮鑯"],["e880","鑰",20,"钑钖钘铇铏铓铔铚铦铻锜锠琛琚瑁瑜瑗瑕瑙瑷瑭瑾璜璎璀璁璇璋璞璨璩璐璧瓒璺韪韫韬杌杓杞杈杩枥枇杪杳枘枧杵枨枞枭枋杷杼柰栉柘栊柩枰栌柙枵柚枳柝栀柃枸柢栎柁柽栲栳桠桡桎桢桄桤梃栝桕桦桁桧桀栾桊桉栩梵梏桴桷梓桫棂楮棼椟椠棹"],["e940","锧锳锽镃镈镋镕镚镠镮镴镵長",7,"門",42],["e980","閫",32,"椤棰椋椁楗棣椐楱椹楠楂楝榄楫榀榘楸椴槌榇榈槎榉楦楣楹榛榧榻榫榭槔榱槁槊槟榕槠榍槿樯槭樗樘橥槲橄樾檠橐橛樵檎橹樽樨橘橼檑檐檩檗檫猷獒殁殂殇殄殒殓殍殚殛殡殪轫轭轱轲轳轵轶轸轷轹轺轼轾辁辂辄辇辋"],["ea40","闌",27,"闬闿阇阓阘阛阞阠阣",6,"阫阬阭阯阰阷阸阹阺阾陁陃陊陎陏陑陒陓陖陗"],["ea80","陘陙陚陜陝陞陠陣陥陦陫陭",4,"陳陸",12,"隇隉隊辍辎辏辘辚軎戋戗戛戟戢戡戥戤戬臧瓯瓴瓿甏甑甓攴旮旯旰昊昙杲昃昕昀炅曷昝昴昱昶昵耆晟晔晁晏晖晡晗晷暄暌暧暝暾曛曜曦曩贲贳贶贻贽赀赅赆赈赉赇赍赕赙觇觊觋觌觎觏觐觑牮犟牝牦牯牾牿犄犋犍犏犒挈挲掰"],["eb40","隌階隑隒隓隕隖隚際隝",9,"隨",7,"隱隲隴隵隷隸隺隻隿雂雃雈雊雋雐雑雓雔雖",9,"雡",6,"雫"],["eb80","雬雭雮雰雱雲雴雵雸雺電雼雽雿霂霃霅霊霋霌霐霑霒霔霕霗",4,"霝霟霠搿擘耄毪毳毽毵毹氅氇氆氍氕氘氙氚氡氩氤氪氲攵敕敫牍牒牖爰虢刖肟肜肓肼朊肽肱肫肭肴肷胧胨胩胪胛胂胄胙胍胗朐胝胫胱胴胭脍脎胲胼朕脒豚脶脞脬脘脲腈腌腓腴腙腚腱腠腩腼腽腭腧塍媵膈膂膑滕膣膪臌朦臊膻"],["ec40","霡",8,"霫霬霮霯霱霳",4,"霺霻霼霽霿",18,"靔靕靗靘靚靜靝靟靣靤靦靧靨靪",7],["ec80","靲靵靷",4,"靽",7,"鞆",4,"鞌鞎鞏鞐鞓鞕鞖鞗鞙",4,"臁膦欤欷欹歃歆歙飑飒飓飕飙飚殳彀毂觳斐齑斓於旆旄旃旌旎旒旖炀炜炖炝炻烀炷炫炱烨烊焐焓焖焯焱煳煜煨煅煲煊煸煺熘熳熵熨熠燠燔燧燹爝爨灬焘煦熹戾戽扃扈扉礻祀祆祉祛祜祓祚祢祗祠祯祧祺禅禊禚禧禳忑忐"],["ed40","鞞鞟鞡鞢鞤",6,"鞬鞮鞰鞱鞳鞵",46],["ed80","韤韥韨韮",4,"韴韷",23,"怼恝恚恧恁恙恣悫愆愍慝憩憝懋懑戆肀聿沓泶淼矶矸砀砉砗砘砑斫砭砜砝砹砺砻砟砼砥砬砣砩硎硭硖硗砦硐硇硌硪碛碓碚碇碜碡碣碲碹碥磔磙磉磬磲礅磴礓礤礞礴龛黹黻黼盱眄眍盹眇眈眚眢眙眭眦眵眸睐睑睇睃睚睨"],["ee40","頏",62],["ee80","顎",32,"睢睥睿瞍睽瞀瞌瞑瞟瞠瞰瞵瞽町畀畎畋畈畛畲畹疃罘罡罟詈罨罴罱罹羁罾盍盥蠲钅钆钇钋钊钌钍钏钐钔钗钕钚钛钜钣钤钫钪钭钬钯钰钲钴钶",4,"钼钽钿铄铈",6,"铐铑铒铕铖铗铙铘铛铞铟铠铢铤铥铧铨铪"],["ef40","顯",5,"颋颎颒颕颙颣風",37,"飏飐飔飖飗飛飜飝飠",4],["ef80","飥飦飩",30,"铩铫铮铯铳铴铵铷铹铼铽铿锃锂锆锇锉锊锍锎锏锒",4,"锘锛锝锞锟锢锪锫锩锬锱锲锴锶锷锸锼锾锿镂锵镄镅镆镉镌镎镏镒镓镔镖镗镘镙镛镞镟镝镡镢镤",8,"镯镱镲镳锺矧矬雉秕秭秣秫稆嵇稃稂稞稔"],["f040","餈",4,"餎餏餑",28,"餯",26],["f080","饊",9,"饖",12,"饤饦饳饸饹饻饾馂馃馉稹稷穑黏馥穰皈皎皓皙皤瓞瓠甬鸠鸢鸨",4,"鸲鸱鸶鸸鸷鸹鸺鸾鹁鹂鹄鹆鹇鹈鹉鹋鹌鹎鹑鹕鹗鹚鹛鹜鹞鹣鹦",6,"鹱鹭鹳疒疔疖疠疝疬疣疳疴疸痄疱疰痃痂痖痍痣痨痦痤痫痧瘃痱痼痿瘐瘀瘅瘌瘗瘊瘥瘘瘕瘙"],["f140","馌馎馚",10,"馦馧馩",47],["f180","駙",32,"瘛瘼瘢瘠癀瘭瘰瘿瘵癃瘾瘳癍癞癔癜癖癫癯翊竦穸穹窀窆窈窕窦窠窬窨窭窳衤衩衲衽衿袂袢裆袷袼裉裢裎裣裥裱褚裼裨裾裰褡褙褓褛褊褴褫褶襁襦襻疋胥皲皴矜耒耔耖耜耠耢耥耦耧耩耨耱耋耵聃聆聍聒聩聱覃顸颀颃"],["f240","駺",62],["f280","騹",32,"颉颌颍颏颔颚颛颞颟颡颢颥颦虍虔虬虮虿虺虼虻蚨蚍蚋蚬蚝蚧蚣蚪蚓蚩蚶蛄蚵蛎蚰蚺蚱蚯蛉蛏蚴蛩蛱蛲蛭蛳蛐蜓蛞蛴蛟蛘蛑蜃蜇蛸蜈蜊蜍蜉蜣蜻蜞蜥蜮蜚蜾蝈蜴蜱蜩蜷蜿螂蜢蝽蝾蝻蝠蝰蝌蝮螋蝓蝣蝼蝤蝙蝥螓螯螨蟒"],["f340","驚",17,"驲骃骉骍骎骔骕骙骦骩",6,"骲骳骴骵骹骻骽骾骿髃髄髆",4,"髍髎髏髐髒體髕髖髗髙髚髛髜"],["f380","髝髞髠髢髣髤髥髧髨髩髪髬髮髰",8,"髺髼",6,"鬄鬅鬆蟆螈螅螭螗螃螫蟥螬螵螳蟋蟓螽蟑蟀蟊蟛蟪蟠蟮蠖蠓蟾蠊蠛蠡蠹蠼缶罂罄罅舐竺竽笈笃笄笕笊笫笏筇笸笪笙笮笱笠笥笤笳笾笞筘筚筅筵筌筝筠筮筻筢筲筱箐箦箧箸箬箝箨箅箪箜箢箫箴篑篁篌篝篚篥篦篪簌篾篼簏簖簋"],["f440","鬇鬉",5,"鬐鬑鬒鬔",10,"鬠鬡鬢鬤",10,"鬰鬱鬳",7,"鬽鬾鬿魀魆魊魋魌魎魐魒魓魕",5],["f480","魛",32,"簟簪簦簸籁籀臾舁舂舄臬衄舡舢舣舭舯舨舫舸舻舳舴舾艄艉艋艏艚艟艨衾袅袈裘裟襞羝羟羧羯羰羲籼敉粑粝粜粞粢粲粼粽糁糇糌糍糈糅糗糨艮暨羿翎翕翥翡翦翩翮翳糸絷綦綮繇纛麸麴赳趄趔趑趱赧赭豇豉酊酐酎酏酤"],["f540","魼",62],["f580","鮻",32,"酢酡酰酩酯酽酾酲酴酹醌醅醐醍醑醢醣醪醭醮醯醵醴醺豕鹾趸跫踅蹙蹩趵趿趼趺跄跖跗跚跞跎跏跛跆跬跷跸跣跹跻跤踉跽踔踝踟踬踮踣踯踺蹀踹踵踽踱蹉蹁蹂蹑蹒蹊蹰蹶蹼蹯蹴躅躏躔躐躜躞豸貂貊貅貘貔斛觖觞觚觜"],["f640","鯜",62],["f680","鰛",32,"觥觫觯訾謦靓雩雳雯霆霁霈霏霎霪霭霰霾龀龃龅",5,"龌黾鼋鼍隹隼隽雎雒瞿雠銎銮鋈錾鍪鏊鎏鐾鑫鱿鲂鲅鲆鲇鲈稣鲋鲎鲐鲑鲒鲔鲕鲚鲛鲞",5,"鲥",4,"鲫鲭鲮鲰",7,"鲺鲻鲼鲽鳄鳅鳆鳇鳊鳋"],["f740","鰼",62],["f780","鱻鱽鱾鲀鲃鲄鲉鲊鲌鲏鲓鲖鲗鲘鲙鲝鲪鲬鲯鲹鲾",4,"鳈鳉鳑鳒鳚鳛鳠鳡鳌",4,"鳓鳔鳕鳗鳘鳙鳜鳝鳟鳢靼鞅鞑鞒鞔鞯鞫鞣鞲鞴骱骰骷鹘骶骺骼髁髀髅髂髋髌髑魅魃魇魉魈魍魑飨餍餮饕饔髟髡髦髯髫髻髭髹鬈鬏鬓鬟鬣麽麾縻麂麇麈麋麒鏖麝麟黛黜黝黠黟黢黩黧黥黪黯鼢鼬鼯鼹鼷鼽鼾齄"],["f840","鳣",62],["f880","鴢",32],["f940","鵃",62],["f980","鶂",32],["fa40","鶣",62],["fa80","鷢",32],["fb40","鸃",27,"鸤鸧鸮鸰鸴鸻鸼鹀鹍鹐鹒鹓鹔鹖鹙鹝鹟鹠鹡鹢鹥鹮鹯鹲鹴",9,"麀"],["fb80","麁麃麄麅麆麉麊麌",5,"麔",8,"麞麠",5,"麧麨麩麪"],["fc40","麫",8,"麵麶麷麹麺麼麿",4,"黅黆黇黈黊黋黌黐黒黓黕黖黗黙黚點黡黣黤黦黨黫黬黭黮黰",8,"黺黽黿",6],["fc80","鼆",4,"鼌鼏鼑鼒鼔鼕鼖鼘鼚",5,"鼡鼣",8,"鼭鼮鼰鼱"],["fd40","鼲",4,"鼸鼺鼼鼿",4,"齅",10,"齒",38],["fd80","齹",5,"龁龂龍",11,"龜龝龞龡",4,"郎凉秊裏隣"],["fe40","兀嗀﨎﨏﨑﨓﨔礼﨟蘒﨡﨣﨤﨧﨨﨩"]]');
const require$$3$1 = [
  [
    "a140",
    "",
    62
  ],
  [
    "a180",
    "",
    32
  ],
  [
    "a240",
    "",
    62
  ],
  [
    "a280",
    "",
    32
  ],
  [
    "a2ab",
    "",
    5
  ],
  [
    "a2e3",
    "€"
  ],
  [
    "a2ef",
    ""
  ],
  [
    "a2fd",
    ""
  ],
  [
    "a340",
    "",
    62
  ],
  [
    "a380",
    "",
    31,
    "　"
  ],
  [
    "a440",
    "",
    62
  ],
  [
    "a480",
    "",
    32
  ],
  [
    "a4f4",
    "",
    10
  ],
  [
    "a540",
    "",
    62
  ],
  [
    "a580",
    "",
    32
  ],
  [
    "a5f7",
    "",
    7
  ],
  [
    "a640",
    "",
    62
  ],
  [
    "a680",
    "",
    32
  ],
  [
    "a6b9",
    "",
    7
  ],
  [
    "a6d9",
    "",
    6
  ],
  [
    "a6ec",
    ""
  ],
  [
    "a6f3",
    ""
  ],
  [
    "a6f6",
    "",
    8
  ],
  [
    "a740",
    "",
    62
  ],
  [
    "a780",
    "",
    32
  ],
  [
    "a7c2",
    "",
    14
  ],
  [
    "a7f2",
    "",
    12
  ],
  [
    "a896",
    "",
    10
  ],
  [
    "a8bc",
    ""
  ],
  [
    "a8bf",
    "ǹ"
  ],
  [
    "a8c1",
    ""
  ],
  [
    "a8ea",
    "",
    20
  ],
  [
    "a958",
    ""
  ],
  [
    "a95b",
    ""
  ],
  [
    "a95d",
    ""
  ],
  [
    "a989",
    "〾⿰",
    11
  ],
  [
    "a997",
    "",
    12
  ],
  [
    "a9f0",
    "",
    14
  ],
  [
    "aaa1",
    "",
    93
  ],
  [
    "aba1",
    "",
    93
  ],
  [
    "aca1",
    "",
    93
  ],
  [
    "ada1",
    "",
    93
  ],
  [
    "aea1",
    "",
    93
  ],
  [
    "afa1",
    "",
    93
  ],
  [
    "d7fa",
    "",
    4
  ],
  [
    "f8a1",
    "",
    93
  ],
  [
    "f9a1",
    "",
    93
  ],
  [
    "faa1",
    "",
    93
  ],
  [
    "fba1",
    "",
    93
  ],
  [
    "fca1",
    "",
    93
  ],
  [
    "fda1",
    "",
    93
  ],
  [
    "fe50",
    "⺁⺄㑳㑇⺈⺋㖞㘚㘎⺌⺗㥮㤘㧏㧟㩳㧐㭎㱮㳠⺧⺪䁖䅟⺮䌷⺳⺶⺷䎱䎬⺻䏝䓖䙡䙌"
  ],
  [
    "fe80",
    "䜣䜩䝼䞍⻊䥇䥺䥽䦂䦃䦅䦆䦟䦛䦷䦶䲣䲟䲠䲡䱷䲢䴓",
    6,
    "䶮",
    93
  ]
];
const uChars = [128, 165, 169, 178, 184, 216, 226, 235, 238, 244, 248, 251, 253, 258, 276, 284, 300, 325, 329, 334, 364, 463, 465, 467, 469, 471, 473, 475, 477, 506, 594, 610, 712, 716, 730, 930, 938, 962, 970, 1026, 1104, 1106, 8209, 8215, 8218, 8222, 8231, 8241, 8244, 8246, 8252, 8365, 8452, 8454, 8458, 8471, 8482, 8556, 8570, 8596, 8602, 8713, 8720, 8722, 8726, 8731, 8737, 8740, 8742, 8748, 8751, 8760, 8766, 8777, 8781, 8787, 8802, 8808, 8816, 8854, 8858, 8870, 8896, 8979, 9322, 9372, 9548, 9588, 9616, 9622, 9634, 9652, 9662, 9672, 9676, 9680, 9702, 9735, 9738, 9793, 9795, 11906, 11909, 11913, 11917, 11928, 11944, 11947, 11951, 11956, 11960, 11964, 11979, 12284, 12292, 12312, 12319, 12330, 12351, 12436, 12447, 12535, 12543, 12586, 12842, 12850, 12964, 13200, 13215, 13218, 13253, 13263, 13267, 13270, 13384, 13428, 13727, 13839, 13851, 14617, 14703, 14801, 14816, 14964, 15183, 15471, 15585, 16471, 16736, 17208, 17325, 17330, 17374, 17623, 17997, 18018, 18212, 18218, 18301, 18318, 18760, 18811, 18814, 18820, 18823, 18844, 18848, 18872, 19576, 19620, 19738, 19887, 40870, 59244, 59336, 59367, 59413, 59417, 59423, 59431, 59437, 59443, 59452, 59460, 59478, 59493, 63789, 63866, 63894, 63976, 63986, 64016, 64018, 64021, 64025, 64034, 64037, 64042, 65074, 65093, 65107, 65112, 65127, 65132, 65375, 65510, 65536];
const gbChars = [0, 36, 38, 45, 50, 81, 89, 95, 96, 100, 103, 104, 105, 109, 126, 133, 148, 172, 175, 179, 208, 306, 307, 308, 309, 310, 311, 312, 313, 341, 428, 443, 544, 545, 558, 741, 742, 749, 750, 805, 819, 820, 7922, 7924, 7925, 7927, 7934, 7943, 7944, 7945, 7950, 8062, 8148, 8149, 8152, 8164, 8174, 8236, 8240, 8262, 8264, 8374, 8380, 8381, 8384, 8388, 8390, 8392, 8393, 8394, 8396, 8401, 8406, 8416, 8419, 8424, 8437, 8439, 8445, 8482, 8485, 8496, 8521, 8603, 8936, 8946, 9046, 9050, 9063, 9066, 9076, 9092, 9100, 9108, 9111, 9113, 9131, 9162, 9164, 9218, 9219, 11329, 11331, 11334, 11336, 11346, 11361, 11363, 11366, 11370, 11372, 11375, 11389, 11682, 11686, 11687, 11692, 11694, 11714, 11716, 11723, 11725, 11730, 11736, 11982, 11989, 12102, 12336, 12348, 12350, 12384, 12393, 12395, 12397, 12510, 12553, 12851, 12962, 12973, 13738, 13823, 13919, 13933, 14080, 14298, 14585, 14698, 15583, 15847, 16318, 16434, 16438, 16481, 16729, 17102, 17122, 17315, 17320, 17402, 17418, 17859, 17909, 17911, 17915, 17916, 17936, 17939, 17961, 18664, 18703, 18814, 18962, 19043, 33469, 33470, 33471, 33484, 33485, 33490, 33497, 33501, 33505, 33513, 33520, 33536, 33550, 37845, 37921, 37948, 38029, 38038, 38064, 38065, 38066, 38069, 38075, 38076, 38078, 39108, 39109, 39113, 39114, 39115, 39116, 39265, 39394, 189e3];
const require$$4 = {
  uChars,
  gbChars
};
const require$$5 = /* @__PURE__ */ JSON.parse('[["0","\\u0000",127],["8141","갂갃갅갆갋",4,"갘갞갟갡갢갣갥",6,"갮갲갳갴"],["8161","갵갶갷갺갻갽갾갿걁",9,"걌걎",5,"걕"],["8181","걖걗걙걚걛걝",18,"걲걳걵걶걹걻",4,"겂겇겈겍겎겏겑겒겓겕",6,"겞겢",5,"겫겭겮겱",6,"겺겾겿곀곂곃곅곆곇곉곊곋곍",7,"곖곘",7,"곢곣곥곦곩곫곭곮곲곴곷",4,"곾곿괁괂괃괅괇",4,"괎괐괒괓"],["8241","괔괕괖괗괙괚괛괝괞괟괡",7,"괪괫괮",5],["8261","괶괷괹괺괻괽",6,"굆굈굊",5,"굑굒굓굕굖굗"],["8281","굙",7,"굢굤",7,"굮굯굱굲굷굸굹굺굾궀궃",4,"궊궋궍궎궏궑",10,"궞",5,"궥",17,"궸",7,"귂귃귅귆귇귉",6,"귒귔",7,"귝귞귟귡귢귣귥",18],["8341","귺귻귽귾긂",5,"긊긌긎",5,"긕",7],["8361","긝",18,"긲긳긵긶긹긻긼"],["8381","긽긾긿깂깄깇깈깉깋깏깑깒깓깕깗",4,"깞깢깣깤깦깧깪깫깭깮깯깱",6,"깺깾",5,"꺆",5,"꺍",46,"꺿껁껂껃껅",6,"껎껒",5,"껚껛껝",8],["8441","껦껧껩껪껬껮",5,"껵껶껷껹껺껻껽",8],["8461","꼆꼉꼊꼋꼌꼎꼏꼑",18],["8481","꼤",7,"꼮꼯꼱꼳꼵",6,"꼾꽀꽄꽅꽆꽇꽊",5,"꽑",10,"꽞",5,"꽦",18,"꽺",5,"꾁꾂꾃꾅꾆꾇꾉",6,"꾒꾓꾔꾖",5,"꾝",26,"꾺꾻꾽꾾"],["8541","꾿꿁",5,"꿊꿌꿏",4,"꿕",6,"꿝",4],["8561","꿢",5,"꿪",5,"꿲꿳꿵꿶꿷꿹",6,"뀂뀃"],["8581","뀅",6,"뀍뀎뀏뀑뀒뀓뀕",6,"뀞",9,"뀩",26,"끆끇끉끋끍끏끐끑끒끖끘끚끛끜끞",29,"끾끿낁낂낃낅",6,"낎낐낒",5,"낛낝낞낣낤"],["8641","낥낦낧낪낰낲낶낷낹낺낻낽",6,"냆냊",5,"냒"],["8661","냓냕냖냗냙",6,"냡냢냣냤냦",10],["8681","냱",22,"넊넍넎넏넑넔넕넖넗넚넞",4,"넦넧넩넪넫넭",6,"넶넺",5,"녂녃녅녆녇녉",6,"녒녓녖녗녙녚녛녝녞녟녡",22,"녺녻녽녾녿놁놃",4,"놊놌놎놏놐놑놕놖놗놙놚놛놝"],["8741","놞",9,"놩",15],["8761","놹",18,"뇍뇎뇏뇑뇒뇓뇕"],["8781","뇖",5,"뇞뇠",7,"뇪뇫뇭뇮뇯뇱",7,"뇺뇼뇾",5,"눆눇눉눊눍",6,"눖눘눚",5,"눡",18,"눵",6,"눽",26,"뉙뉚뉛뉝뉞뉟뉡",6,"뉪",4],["8841","뉯",4,"뉶",5,"뉽",6,"늆늇늈늊",4],["8861","늏늒늓늕늖늗늛",4,"늢늤늧늨늩늫늭늮늯늱늲늳늵늶늷"],["8881","늸",15,"닊닋닍닎닏닑닓",4,"닚닜닞닟닠닡닣닧닩닪닰닱닲닶닼닽닾댂댃댅댆댇댉",6,"댒댖",5,"댝",54,"덗덙덚덝덠덡덢덣"],["8941","덦덨덪덬덭덯덲덳덵덶덷덹",6,"뎂뎆",5,"뎍"],["8961","뎎뎏뎑뎒뎓뎕",10,"뎢",5,"뎩뎪뎫뎭"],["8981","뎮",21,"돆돇돉돊돍돏돑돒돓돖돘돚돜돞돟돡돢돣돥돦돧돩",18,"돽",18,"됑",6,"됙됚됛됝됞됟됡",6,"됪됬",7,"됵",15],["8a41","둅",10,"둒둓둕둖둗둙",6,"둢둤둦"],["8a61","둧",4,"둭",18,"뒁뒂"],["8a81","뒃",4,"뒉",19,"뒞",5,"뒥뒦뒧뒩뒪뒫뒭",7,"뒶뒸뒺",5,"듁듂듃듅듆듇듉",6,"듑듒듓듔듖",5,"듞듟듡듢듥듧",4,"듮듰듲",5,"듹",26,"딖딗딙딚딝"],["8b41","딞",5,"딦딫",4,"딲딳딵딶딷딹",6,"땂땆"],["8b61","땇땈땉땊땎땏땑땒땓땕",6,"땞땢",8],["8b81","땫",52,"떢떣떥떦떧떩떬떭떮떯떲떶",4,"떾떿뗁뗂뗃뗅",6,"뗎뗒",5,"뗙",18,"뗭",18],["8c41","똀",15,"똒똓똕똖똗똙",4],["8c61","똞",6,"똦",5,"똭",6,"똵",5],["8c81","똻",12,"뙉",26,"뙥뙦뙧뙩",50,"뚞뚟뚡뚢뚣뚥",5,"뚭뚮뚯뚰뚲",16],["8d41","뛃",16,"뛕",8],["8d61","뛞",17,"뛱뛲뛳뛵뛶뛷뛹뛺"],["8d81","뛻",4,"뜂뜃뜄뜆",33,"뜪뜫뜭뜮뜱",6,"뜺뜼",7,"띅띆띇띉띊띋띍",6,"띖",9,"띡띢띣띥띦띧띩",6,"띲띴띶",5,"띾띿랁랂랃랅",6,"랎랓랔랕랚랛랝랞"],["8e41","랟랡",6,"랪랮",5,"랶랷랹",8],["8e61","럂",4,"럈럊",19],["8e81","럞",13,"럮럯럱럲럳럵",6,"럾렂",4,"렊렋렍렎렏렑",6,"렚렜렞",5,"렦렧렩렪렫렭",6,"렶렺",5,"롁롂롃롅",11,"롒롔",7,"롞롟롡롢롣롥",6,"롮롰롲",5,"롹롺롻롽",7],["8f41","뢅",7,"뢎",17],["8f61","뢠",7,"뢩",6,"뢱뢲뢳뢵뢶뢷뢹",4],["8f81","뢾뢿룂룄룆",5,"룍룎룏룑룒룓룕",7,"룞룠룢",5,"룪룫룭룮룯룱",6,"룺룼룾",5,"뤅",18,"뤙",6,"뤡",26,"뤾뤿륁륂륃륅",6,"륍륎륐륒",5],["9041","륚륛륝륞륟륡",6,"륪륬륮",5,"륶륷륹륺륻륽"],["9061","륾",5,"릆릈릋릌릏",15],["9081","릟",12,"릮릯릱릲릳릵",6,"릾맀맂",5,"맊맋맍맓",4,"맚맜맟맠맢맦맧맩맪맫맭",6,"맶맻",4,"먂",5,"먉",11,"먖",33,"먺먻먽먾먿멁멃멄멅멆"],["9141","멇멊멌멏멐멑멒멖멗멙멚멛멝",6,"멦멪",5],["9161","멲멳멵멶멷멹",9,"몆몈몉몊몋몍",5],["9181","몓",20,"몪몭몮몯몱몳",4,"몺몼몾",5,"뫅뫆뫇뫉",14,"뫚",33,"뫽뫾뫿묁묂묃묅",7,"묎묐묒",5,"묙묚묛묝묞묟묡",6],["9241","묨묪묬",7,"묷묹묺묿",4,"뭆뭈뭊뭋뭌뭎뭑뭒"],["9261","뭓뭕뭖뭗뭙",7,"뭢뭤",7,"뭭",4],["9281","뭲",21,"뮉뮊뮋뮍뮎뮏뮑",18,"뮥뮦뮧뮩뮪뮫뮭",6,"뮵뮶뮸",7,"믁믂믃믅믆믇믉",6,"믑믒믔",35,"믺믻믽믾밁"],["9341","밃",4,"밊밎밐밒밓밙밚밠밡밢밣밦밨밪밫밬밮밯밲밳밵"],["9361","밶밷밹",6,"뱂뱆뱇뱈뱊뱋뱎뱏뱑",8],["9381","뱚뱛뱜뱞",37,"벆벇벉벊벍벏",4,"벖벘벛",4,"벢벣벥벦벩",6,"벲벶",5,"벾벿볁볂볃볅",7,"볎볒볓볔볖볗볙볚볛볝",22,"볷볹볺볻볽"],["9441","볾",5,"봆봈봊",5,"봑봒봓봕",8],["9461","봞",5,"봥",6,"봭",12],["9481","봺",5,"뵁",6,"뵊뵋뵍뵎뵏뵑",6,"뵚",9,"뵥뵦뵧뵩",22,"붂붃붅붆붋",4,"붒붔붖붗붘붛붝",6,"붥",10,"붱",6,"붹",24],["9541","뷒뷓뷖뷗뷙뷚뷛뷝",11,"뷪",5,"뷱"],["9561","뷲뷳뷵뷶뷷뷹",6,"븁븂븄븆",5,"븎븏븑븒븓"],["9581","븕",6,"븞븠",35,"빆빇빉빊빋빍빏",4,"빖빘빜빝빞빟빢빣빥빦빧빩빫",4,"빲빶",4,"빾빿뺁뺂뺃뺅",6,"뺎뺒",5,"뺚",13,"뺩",14],["9641","뺸",23,"뻒뻓"],["9661","뻕뻖뻙",6,"뻡뻢뻦",5,"뻭",8],["9681","뻶",10,"뼂",5,"뼊",13,"뼚뼞",33,"뽂뽃뽅뽆뽇뽉",6,"뽒뽓뽔뽖",44],["9741","뾃",16,"뾕",8],["9761","뾞",17,"뾱",7],["9781","뾹",11,"뿆",5,"뿎뿏뿑뿒뿓뿕",6,"뿝뿞뿠뿢",89,"쀽쀾쀿"],["9841","쁀",16,"쁒",5,"쁙쁚쁛"],["9861","쁝쁞쁟쁡",6,"쁪",15],["9881","쁺",21,"삒삓삕삖삗삙",6,"삢삤삦",5,"삮삱삲삷",4,"삾샂샃샄샆샇샊샋샍샎샏샑",6,"샚샞",5,"샦샧샩샪샫샭",6,"샶샸샺",5,"섁섂섃섅섆섇섉",6,"섑섒섓섔섖",5,"섡섢섥섨섩섪섫섮"],["9941","섲섳섴섵섷섺섻섽섾섿셁",6,"셊셎",5,"셖셗"],["9961","셙셚셛셝",6,"셦셪",5,"셱셲셳셵셶셷셹셺셻"],["9981","셼",8,"솆",5,"솏솑솒솓솕솗",4,"솞솠솢솣솤솦솧솪솫솭솮솯솱",11,"솾",5,"쇅쇆쇇쇉쇊쇋쇍",6,"쇕쇖쇙",6,"쇡쇢쇣쇥쇦쇧쇩",6,"쇲쇴",7,"쇾쇿숁숂숃숅",6,"숎숐숒",5,"숚숛숝숞숡숢숣"],["9a41","숤숥숦숧숪숬숮숰숳숵",16],["9a61","쉆쉇쉉",6,"쉒쉓쉕쉖쉗쉙",6,"쉡쉢쉣쉤쉦"],["9a81","쉧",4,"쉮쉯쉱쉲쉳쉵",6,"쉾슀슂",5,"슊",5,"슑",6,"슙슚슜슞",5,"슦슧슩슪슫슮",5,"슶슸슺",33,"싞싟싡싢싥",5,"싮싰싲싳싴싵싷싺싽싾싿쌁",6,"쌊쌋쌎쌏"],["9b41","쌐쌑쌒쌖쌗쌙쌚쌛쌝",6,"쌦쌧쌪",8],["9b61","쌳",17,"썆",7],["9b81","썎",25,"썪썫썭썮썯썱썳",4,"썺썻썾",5,"쎅쎆쎇쎉쎊쎋쎍",50,"쏁",22,"쏚"],["9c41","쏛쏝쏞쏡쏣",4,"쏪쏫쏬쏮",5,"쏶쏷쏹",5],["9c61","쏿",8,"쐉",6,"쐑",9],["9c81","쐛",8,"쐥",6,"쐭쐮쐯쐱쐲쐳쐵",6,"쐾",9,"쑉",26,"쑦쑧쑩쑪쑫쑭",6,"쑶쑷쑸쑺",5,"쒁",18,"쒕",6,"쒝",12],["9d41","쒪",13,"쒹쒺쒻쒽",8],["9d61","쓆",25],["9d81","쓠",8,"쓪",5,"쓲쓳쓵쓶쓷쓹쓻쓼쓽쓾씂",9,"씍씎씏씑씒씓씕",6,"씝",10,"씪씫씭씮씯씱",6,"씺씼씾",5,"앆앇앋앏앐앑앒앖앚앛앜앟앢앣앥앦앧앩",6,"앲앶",5,"앾앿얁얂얃얅얆얈얉얊얋얎얐얒얓얔"],["9e41","얖얙얚얛얝얞얟얡",7,"얪",9,"얶"],["9e61","얷얺얿",4,"엋엍엏엒엓엕엖엗엙",6,"엢엤엦엧"],["9e81","엨엩엪엫엯엱엲엳엵엸엹엺엻옂옃옄옉옊옋옍옎옏옑",6,"옚옝",6,"옦옧옩옪옫옯옱옲옶옸옺옼옽옾옿왂왃왅왆왇왉",6,"왒왖",5,"왞왟왡",10,"왭왮왰왲",5,"왺왻왽왾왿욁",6,"욊욌욎",5,"욖욗욙욚욛욝",6,"욦"],["9f41","욨욪",5,"욲욳욵욶욷욻",4,"웂웄웆",5,"웎"],["9f61","웏웑웒웓웕",6,"웞웟웢",5,"웪웫웭웮웯웱웲"],["9f81","웳",4,"웺웻웼웾",5,"윆윇윉윊윋윍",6,"윖윘윚",5,"윢윣윥윦윧윩",6,"윲윴윶윸윹윺윻윾윿읁읂읃읅",4,"읋읎읐읙읚읛읝읞읟읡",6,"읩읪읬",7,"읶읷읹읺읻읿잀잁잂잆잋잌잍잏잒잓잕잙잛",4,"잢잧",4,"잮잯잱잲잳잵잶잷"],["a041","잸잹잺잻잾쟂",5,"쟊쟋쟍쟏쟑",6,"쟙쟚쟛쟜"],["a061","쟞",5,"쟥쟦쟧쟩쟪쟫쟭",13],["a081","쟻",4,"젂젃젅젆젇젉젋",4,"젒젔젗",4,"젞젟젡젢젣젥",6,"젮젰젲",5,"젹젺젻젽젾젿졁",6,"졊졋졎",5,"졕",26,"졲졳졵졶졷졹졻",4,"좂좄좈좉좊좎",5,"좕",7,"좞좠좢좣좤"],["a141","좥좦좧좩",18,"좾좿죀죁"],["a161","죂죃죅죆죇죉죊죋죍",6,"죖죘죚",5,"죢죣죥"],["a181","죦",14,"죶",5,"죾죿줁줂줃줇",4,"줎　、。·‥…¨〃­―∥＼∼‘’“”〔〕〈",9,"±×÷≠≤≥∞∴°′″℃Å￠￡￥♂♀∠⊥⌒∂∇≡≒§※☆★○●◎◇◆□■△▲▽▼→←↑↓↔〓≪≫√∽∝∵∫∬∈∋⊆⊇⊂⊃∪∩∧∨￢"],["a241","줐줒",5,"줙",18],["a261","줭",6,"줵",18],["a281","쥈",7,"쥒쥓쥕쥖쥗쥙",6,"쥢쥤",7,"쥭쥮쥯⇒⇔∀∃´～ˇ˘˝˚˙¸˛¡¿ː∮∑∏¤℉‰◁◀▷▶♤♠♡♥♧♣⊙◈▣◐◑▒▤▥▨▧▦▩♨☏☎☜☞¶†‡↕↗↙↖↘♭♩♪♬㉿㈜№㏇™㏂㏘℡€®"],["a341","쥱쥲쥳쥵",6,"쥽",10,"즊즋즍즎즏"],["a361","즑",6,"즚즜즞",16],["a381","즯",16,"짂짃짅짆짉짋",4,"짒짔짗짘짛！",58,"￦］",32,"￣"],["a441","짞짟짡짣짥짦짨짩짪짫짮짲",5,"짺짻짽짾짿쨁쨂쨃쨄"],["a461","쨅쨆쨇쨊쨎",5,"쨕쨖쨗쨙",12],["a481","쨦쨧쨨쨪",28,"ㄱ",93],["a541","쩇",4,"쩎쩏쩑쩒쩓쩕",6,"쩞쩢",5,"쩩쩪"],["a561","쩫",17,"쩾",5,"쪅쪆"],["a581","쪇",16,"쪙",14,"ⅰ",9],["a5b0","Ⅰ",9],["a5c1","Α",16,"Σ",6],["a5e1","α",16,"σ",6],["a641","쪨",19,"쪾쪿쫁쫂쫃쫅"],["a661","쫆",5,"쫎쫐쫒쫔쫕쫖쫗쫚",5,"쫡",6],["a681","쫨쫩쫪쫫쫭",6,"쫵",18,"쬉쬊─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂┒┑┚┙┖┕┎┍┞┟┡┢┦┧┩┪┭┮┱┲┵┶┹┺┽┾╀╁╃",7],["a741","쬋",4,"쬑쬒쬓쬕쬖쬗쬙",6,"쬢",7],["a761","쬪",22,"쭂쭃쭄"],["a781","쭅쭆쭇쭊쭋쭍쭎쭏쭑",6,"쭚쭛쭜쭞",5,"쭥",7,"㎕㎖㎗ℓ㎘㏄㎣㎤㎥㎦㎙",9,"㏊㎍㎎㎏㏏㎈㎉㏈㎧㎨㎰",9,"㎀",4,"㎺",5,"㎐",4,"Ω㏀㏁㎊㎋㎌㏖㏅㎭㎮㎯㏛㎩㎪㎫㎬㏝㏐㏓㏃㏉㏜㏆"],["a841","쭭",10,"쭺",14],["a861","쮉",18,"쮝",6],["a881","쮤",19,"쮹",11,"ÆÐªĦ"],["a8a6","Ĳ"],["a8a8","ĿŁØŒºÞŦŊ"],["a8b1","㉠",27,"ⓐ",25,"①",14,"½⅓⅔¼¾⅛⅜⅝⅞"],["a941","쯅",14,"쯕",10],["a961","쯠쯡쯢쯣쯥쯦쯨쯪",18],["a981","쯽",14,"찎찏찑찒찓찕",6,"찞찟찠찣찤æđðħıĳĸŀłøœßþŧŋŉ㈀",27,"⒜",25,"⑴",14,"¹²³⁴ⁿ₁₂₃₄"],["aa41","찥찦찪찫찭찯찱",6,"찺찿",4,"챆챇챉챊챋챍챎"],["aa61","챏",4,"챖챚",5,"챡챢챣챥챧챩",6,"챱챲"],["aa81","챳챴챶",29,"ぁ",82],["ab41","첔첕첖첗첚첛첝첞첟첡",6,"첪첮",5,"첶첷첹"],["ab61","첺첻첽",6,"쳆쳈쳊",5,"쳑쳒쳓쳕",5],["ab81","쳛",8,"쳥",6,"쳭쳮쳯쳱",12,"ァ",85],["ac41","쳾쳿촀촂",5,"촊촋촍촎촏촑",6,"촚촜촞촟촠"],["ac61","촡촢촣촥촦촧촩촪촫촭",11,"촺",4],["ac81","촿",28,"쵝쵞쵟А",5,"ЁЖ",25],["acd1","а",5,"ёж",25],["ad41","쵡쵢쵣쵥",6,"쵮쵰쵲",5,"쵹",7],["ad61","춁",6,"춉",10,"춖춗춙춚춛춝춞춟"],["ad81","춠춡춢춣춦춨춪",5,"춱",18,"췅"],["ae41","췆",5,"췍췎췏췑",16],["ae61","췢",5,"췩췪췫췭췮췯췱",6,"췺췼췾",4],["ae81","츃츅츆츇츉츊츋츍",6,"츕츖츗츘츚",5,"츢츣츥츦츧츩츪츫"],["af41","츬츭츮츯츲츴츶",19],["af61","칊",13,"칚칛칝칞칢",5,"칪칬"],["af81","칮",5,"칶칷칹칺칻칽",6,"캆캈캊",5,"캒캓캕캖캗캙"],["b041","캚",5,"캢캦",5,"캮",12],["b061","캻",5,"컂",19],["b081","컖",13,"컦컧컩컪컭",6,"컶컺",5,"가각간갇갈갉갊감",7,"같",4,"갠갤갬갭갯갰갱갸갹갼걀걋걍걔걘걜거걱건걷걸걺검겁것겄겅겆겉겊겋게겐겔겜겝겟겠겡겨격겪견겯결겸겹겻겼경곁계곈곌곕곗고곡곤곧골곪곬곯곰곱곳공곶과곽관괄괆"],["b141","켂켃켅켆켇켉",6,"켒켔켖",5,"켝켞켟켡켢켣"],["b161","켥",6,"켮켲",5,"켹",11],["b181","콅",14,"콖콗콙콚콛콝",6,"콦콨콪콫콬괌괍괏광괘괜괠괩괬괭괴괵괸괼굄굅굇굉교굔굘굡굣구국군굳굴굵굶굻굼굽굿궁궂궈궉권궐궜궝궤궷귀귁귄귈귐귑귓규균귤그극근귿글긁금급긋긍긔기긱긴긷길긺김깁깃깅깆깊까깍깎깐깔깖깜깝깟깠깡깥깨깩깬깰깸"],["b241","콭콮콯콲콳콵콶콷콹",6,"쾁쾂쾃쾄쾆",5,"쾍"],["b261","쾎",18,"쾢",5,"쾩"],["b281","쾪",5,"쾱",18,"쿅",6,"깹깻깼깽꺄꺅꺌꺼꺽꺾껀껄껌껍껏껐껑께껙껜껨껫껭껴껸껼꼇꼈꼍꼐꼬꼭꼰꼲꼴꼼꼽꼿꽁꽂꽃꽈꽉꽐꽜꽝꽤꽥꽹꾀꾄꾈꾐꾑꾕꾜꾸꾹꾼꿀꿇꿈꿉꿋꿍꿎꿔꿜꿨꿩꿰꿱꿴꿸뀀뀁뀄뀌뀐뀔뀜뀝뀨끄끅끈끊끌끎끓끔끕끗끙"],["b341","쿌",19,"쿢쿣쿥쿦쿧쿩"],["b361","쿪",5,"쿲쿴쿶",5,"쿽쿾쿿퀁퀂퀃퀅",5],["b381","퀋",5,"퀒",5,"퀙",19,"끝끼끽낀낄낌낍낏낑나낙낚난낟날낡낢남납낫",4,"낱낳내낵낸낼냄냅냇냈냉냐냑냔냘냠냥너넉넋넌널넒넓넘넙넛넜넝넣네넥넨넬넴넵넷넸넹녀녁년녈념녑녔녕녘녜녠노녹논놀놂놈놉놋농높놓놔놘놜놨뇌뇐뇔뇜뇝"],["b441","퀮",5,"퀶퀷퀹퀺퀻퀽",6,"큆큈큊",5],["b461","큑큒큓큕큖큗큙",6,"큡",10,"큮큯"],["b481","큱큲큳큵",6,"큾큿킀킂",18,"뇟뇨뇩뇬뇰뇹뇻뇽누눅눈눋눌눔눕눗눙눠눴눼뉘뉜뉠뉨뉩뉴뉵뉼늄늅늉느늑는늘늙늚늠늡늣능늦늪늬늰늴니닉닌닐닒님닙닛닝닢다닥닦단닫",4,"닳담답닷",4,"닿대댁댄댈댐댑댓댔댕댜더덕덖던덛덜덞덟덤덥"],["b541","킕",14,"킦킧킩킪킫킭",5],["b561","킳킶킸킺",5,"탂탃탅탆탇탊",5,"탒탖",4],["b581","탛탞탟탡탢탣탥",6,"탮탲",5,"탹",11,"덧덩덫덮데덱덴델뎀뎁뎃뎄뎅뎌뎐뎔뎠뎡뎨뎬도독돈돋돌돎돐돔돕돗동돛돝돠돤돨돼됐되된될됨됩됫됴두둑둔둘둠둡둣둥둬뒀뒈뒝뒤뒨뒬뒵뒷뒹듀듄듈듐듕드득든듣들듦듬듭듯등듸디딕딘딛딜딤딥딧딨딩딪따딱딴딸"],["b641","턅",7,"턎",17],["b661","턠",15,"턲턳턵턶턷턹턻턼턽턾"],["b681","턿텂텆",5,"텎텏텑텒텓텕",6,"텞텠텢",5,"텩텪텫텭땀땁땃땄땅땋때땍땐땔땜땝땟땠땡떠떡떤떨떪떫떰떱떳떴떵떻떼떽뗀뗄뗌뗍뗏뗐뗑뗘뗬또똑똔똘똥똬똴뙈뙤뙨뚜뚝뚠뚤뚫뚬뚱뛔뛰뛴뛸뜀뜁뜅뜨뜩뜬뜯뜰뜸뜹뜻띄띈띌띔띕띠띤띨띰띱띳띵라락란랄람랍랏랐랑랒랖랗"],["b741","텮",13,"텽",6,"톅톆톇톉톊"],["b761","톋",20,"톢톣톥톦톧"],["b781","톩",6,"톲톴톶톷톸톹톻톽톾톿퇁",14,"래랙랜랠램랩랫랬랭랴략랸럇량러럭런럴럼럽럿렀렁렇레렉렌렐렘렙렛렝려력련렬렴렵렷렸령례롄롑롓로록론롤롬롭롯롱롸롼뢍뢨뢰뢴뢸룀룁룃룅료룐룔룝룟룡루룩룬룰룸룹룻룽뤄뤘뤠뤼뤽륀륄륌륏륑류륙륜률륨륩"],["b841","퇐",7,"퇙",17],["b861","퇫",8,"퇵퇶퇷퇹",13],["b881","툈툊",5,"툑",24,"륫륭르륵른를름릅릇릉릊릍릎리릭린릴림립릿링마막만많",4,"맘맙맛망맞맡맣매맥맨맬맴맵맷맸맹맺먀먁먈먕머먹먼멀멂멈멉멋멍멎멓메멕멘멜멤멥멧멨멩며멱면멸몃몄명몇몌모목몫몬몰몲몸몹못몽뫄뫈뫘뫙뫼"],["b941","툪툫툮툯툱툲툳툵",6,"툾퉀퉂",5,"퉉퉊퉋퉌"],["b961","퉍",14,"퉝",6,"퉥퉦퉧퉨"],["b981","퉩",22,"튂튃튅튆튇튉튊튋튌묀묄묍묏묑묘묜묠묩묫무묵묶문묻물묽묾뭄뭅뭇뭉뭍뭏뭐뭔뭘뭡뭣뭬뮈뮌뮐뮤뮨뮬뮴뮷므믄믈믐믓미믹민믿밀밂밈밉밋밌밍및밑바",4,"받",4,"밤밥밧방밭배백밴밸뱀뱁뱃뱄뱅뱉뱌뱍뱐뱝버벅번벋벌벎범법벗"],["ba41","튍튎튏튒튓튔튖",5,"튝튞튟튡튢튣튥",6,"튭"],["ba61","튮튯튰튲",5,"튺튻튽튾틁틃",4,"틊틌",5],["ba81","틒틓틕틖틗틙틚틛틝",6,"틦",9,"틲틳틵틶틷틹틺벙벚베벡벤벧벨벰벱벳벴벵벼벽변별볍볏볐병볕볘볜보복볶본볼봄봅봇봉봐봔봤봬뵀뵈뵉뵌뵐뵘뵙뵤뵨부북분붇불붉붊붐붑붓붕붙붚붜붤붰붸뷔뷕뷘뷜뷩뷰뷴뷸븀븃븅브븍븐블븜븝븟비빅빈빌빎빔빕빗빙빚빛빠빡빤"],["bb41","틻",4,"팂팄팆",5,"팏팑팒팓팕팗",4,"팞팢팣"],["bb61","팤팦팧팪팫팭팮팯팱",6,"팺팾",5,"퍆퍇퍈퍉"],["bb81","퍊",31,"빨빪빰빱빳빴빵빻빼빽뺀뺄뺌뺍뺏뺐뺑뺘뺙뺨뻐뻑뻔뻗뻘뻠뻣뻤뻥뻬뼁뼈뼉뼘뼙뼛뼜뼝뽀뽁뽄뽈뽐뽑뽕뾔뾰뿅뿌뿍뿐뿔뿜뿟뿡쀼쁑쁘쁜쁠쁨쁩삐삑삔삘삠삡삣삥사삭삯산삳살삵삶삼삽삿샀상샅새색샌샐샘샙샛샜생샤"],["bc41","퍪",17,"퍾퍿펁펂펃펅펆펇"],["bc61","펈펉펊펋펎펒",5,"펚펛펝펞펟펡",6,"펪펬펮"],["bc81","펯",4,"펵펶펷펹펺펻펽",6,"폆폇폊",5,"폑",5,"샥샨샬샴샵샷샹섀섄섈섐섕서",4,"섣설섦섧섬섭섯섰성섶세섹센셀셈셉셋셌셍셔셕션셜셤셥셧셨셩셰셴셸솅소속솎손솔솖솜솝솟송솥솨솩솬솰솽쇄쇈쇌쇔쇗쇘쇠쇤쇨쇰쇱쇳쇼쇽숀숄숌숍숏숑수숙순숟술숨숩숫숭"],["bd41","폗폙",7,"폢폤",7,"폮폯폱폲폳폵폶폷"],["bd61","폸폹폺폻폾퐀퐂",5,"퐉",13],["bd81","퐗",5,"퐞",25,"숯숱숲숴쉈쉐쉑쉔쉘쉠쉥쉬쉭쉰쉴쉼쉽쉿슁슈슉슐슘슛슝스슥슨슬슭슴습슷승시식신싣실싫심십싯싱싶싸싹싻싼쌀쌈쌉쌌쌍쌓쌔쌕쌘쌜쌤쌥쌨쌩썅써썩썬썰썲썸썹썼썽쎄쎈쎌쏀쏘쏙쏜쏟쏠쏢쏨쏩쏭쏴쏵쏸쐈쐐쐤쐬쐰"],["be41","퐸",7,"푁푂푃푅",14],["be61","푔",7,"푝푞푟푡푢푣푥",7,"푮푰푱푲"],["be81","푳",4,"푺푻푽푾풁풃",4,"풊풌풎",5,"풕",8,"쐴쐼쐽쑈쑤쑥쑨쑬쑴쑵쑹쒀쒔쒜쒸쒼쓩쓰쓱쓴쓸쓺쓿씀씁씌씐씔씜씨씩씬씰씸씹씻씽아악안앉않알앍앎앓암압앗았앙앝앞애액앤앨앰앱앳앴앵야약얀얄얇얌얍얏양얕얗얘얜얠얩어억언얹얻얼얽얾엄",6,"엌엎"],["bf41","풞",10,"풪",14],["bf61","풹",18,"퓍퓎퓏퓑퓒퓓퓕"],["bf81","퓖",5,"퓝퓞퓠",7,"퓩퓪퓫퓭퓮퓯퓱",6,"퓹퓺퓼에엑엔엘엠엡엣엥여역엮연열엶엷염",5,"옅옆옇예옌옐옘옙옛옜오옥온올옭옮옰옳옴옵옷옹옻와왁완왈왐왑왓왔왕왜왝왠왬왯왱외왹왼욀욈욉욋욍요욕욘욜욤욥욧용우욱운울욹욺움웁웃웅워웍원월웜웝웠웡웨"],["c041","퓾",5,"픅픆픇픉픊픋픍",6,"픖픘",5],["c061","픞",25],["c081","픸픹픺픻픾픿핁핂핃핅",6,"핎핐핒",5,"핚핛핝핞핟핡핢핣웩웬웰웸웹웽위윅윈윌윔윕윗윙유육윤율윰윱윳융윷으윽은을읊음읍읏응",7,"읜읠읨읫이익인일읽읾잃임입잇있잉잊잎자작잔잖잗잘잚잠잡잣잤장잦재잭잰잴잼잽잿쟀쟁쟈쟉쟌쟎쟐쟘쟝쟤쟨쟬저적전절젊"],["c141","핤핦핧핪핬핮",5,"핶핷핹핺핻핽",6,"햆햊햋"],["c161","햌햍햎햏햑",19,"햦햧"],["c181","햨",31,"점접젓정젖제젝젠젤젬젭젯젱져젼졀졈졉졌졍졔조족존졸졺좀좁좃종좆좇좋좌좍좔좝좟좡좨좼좽죄죈죌죔죕죗죙죠죡죤죵주죽준줄줅줆줌줍줏중줘줬줴쥐쥑쥔쥘쥠쥡쥣쥬쥰쥴쥼즈즉즌즐즘즙즛증지직진짇질짊짐집짓"],["c241","헊헋헍헎헏헑헓",4,"헚헜헞",5,"헦헧헩헪헫헭헮"],["c261","헯",4,"헶헸헺",5,"혂혃혅혆혇혉",6,"혒"],["c281","혖",5,"혝혞혟혡혢혣혥",7,"혮",9,"혺혻징짖짙짚짜짝짠짢짤짧짬짭짯짰짱째짹짼쨀쨈쨉쨋쨌쨍쨔쨘쨩쩌쩍쩐쩔쩜쩝쩟쩠쩡쩨쩽쪄쪘쪼쪽쫀쫄쫌쫍쫏쫑쫓쫘쫙쫠쫬쫴쬈쬐쬔쬘쬠쬡쭁쭈쭉쭌쭐쭘쭙쭝쭤쭸쭹쮜쮸쯔쯤쯧쯩찌찍찐찔찜찝찡찢찧차착찬찮찰참찹찻"],["c341","혽혾혿홁홂홃홄홆홇홊홌홎홏홐홒홓홖홗홙홚홛홝",4],["c361","홢",4,"홨홪",5,"홲홳홵",11],["c381","횁횂횄횆",5,"횎횏횑횒횓횕",7,"횞횠횢",5,"횩횪찼창찾채책챈챌챔챕챗챘챙챠챤챦챨챰챵처척천철첨첩첫첬청체첵첸첼쳄쳅쳇쳉쳐쳔쳤쳬쳰촁초촉촌촐촘촙촛총촤촨촬촹최쵠쵤쵬쵭쵯쵱쵸춈추축춘출춤춥춧충춰췄췌췐취췬췰췸췹췻췽츄츈츌츔츙츠측츤츨츰츱츳층"],["c441","횫횭횮횯횱",7,"횺횼",7,"훆훇훉훊훋"],["c461","훍훎훏훐훒훓훕훖훘훚",5,"훡훢훣훥훦훧훩",4],["c481","훮훯훱훲훳훴훶",5,"훾훿휁휂휃휅",11,"휒휓휔치칙친칟칠칡침칩칫칭카칵칸칼캄캅캇캉캐캑캔캘캠캡캣캤캥캬캭컁커컥컨컫컬컴컵컷컸컹케켁켄켈켐켑켓켕켜켠켤켬켭켯켰켱켸코콕콘콜콤콥콧콩콰콱콴콸쾀쾅쾌쾡쾨쾰쿄쿠쿡쿤쿨쿰쿱쿳쿵쿼퀀퀄퀑퀘퀭퀴퀵퀸퀼"],["c541","휕휖휗휚휛휝휞휟휡",6,"휪휬휮",5,"휶휷휹"],["c561","휺휻휽",6,"흅흆흈흊",5,"흒흓흕흚",4],["c581","흟흢흤흦흧흨흪흫흭흮흯흱흲흳흵",6,"흾흿힀힂",5,"힊힋큄큅큇큉큐큔큘큠크큭큰클큼큽킁키킥킨킬킴킵킷킹타탁탄탈탉탐탑탓탔탕태택탠탤탬탭탯탰탱탸턍터턱턴털턺텀텁텃텄텅테텍텐텔템텝텟텡텨텬텼톄톈토톡톤톨톰톱톳통톺톼퇀퇘퇴퇸툇툉툐투툭툰툴툼툽툿퉁퉈퉜"],["c641","힍힎힏힑",6,"힚힜힞",5],["c6a1","퉤튀튁튄튈튐튑튕튜튠튤튬튱트특튼튿틀틂틈틉틋틔틘틜틤틥티틱틴틸팀팁팃팅파팍팎판팔팖팜팝팟팠팡팥패팩팬팰팸팹팻팼팽퍄퍅퍼퍽펀펄펌펍펏펐펑페펙펜펠펨펩펫펭펴편펼폄폅폈평폐폘폡폣포폭폰폴폼폽폿퐁"],["c7a1","퐈퐝푀푄표푠푤푭푯푸푹푼푿풀풂품풉풋풍풔풩퓌퓐퓔퓜퓟퓨퓬퓰퓸퓻퓽프픈플픔픕픗피픽핀필핌핍핏핑하학한할핥함합핫항해핵핸핼햄햅햇했행햐향허헉헌헐헒험헙헛헝헤헥헨헬헴헵헷헹혀혁현혈혐협혓혔형혜혠"],["c8a1","혤혭호혹혼홀홅홈홉홋홍홑화확환활홧황홰홱홴횃횅회획횐횔횝횟횡효횬횰횹횻후훅훈훌훑훔훗훙훠훤훨훰훵훼훽휀휄휑휘휙휜휠휨휩휫휭휴휵휸휼흄흇흉흐흑흔흖흗흘흙흠흡흣흥흩희흰흴흼흽힁히힉힌힐힘힙힛힝"],["caa1","伽佳假價加可呵哥嘉嫁家暇架枷柯歌珂痂稼苛茄街袈訶賈跏軻迦駕刻却各恪慤殼珏脚覺角閣侃刊墾奸姦干幹懇揀杆柬桿澗癎看磵稈竿簡肝艮艱諫間乫喝曷渴碣竭葛褐蝎鞨勘坎堪嵌感憾戡敢柑橄減甘疳監瞰紺邯鑑鑒龕"],["cba1","匣岬甲胛鉀閘剛堈姜岡崗康强彊慷江畺疆糠絳綱羌腔舡薑襁講鋼降鱇介价個凱塏愷愾慨改槪漑疥皆盖箇芥蓋豈鎧開喀客坑更粳羹醵倨去居巨拒据據擧渠炬祛距踞車遽鉅鋸乾件健巾建愆楗腱虔蹇鍵騫乞傑杰桀儉劍劒檢"],["cca1","瞼鈐黔劫怯迲偈憩揭擊格檄激膈覡隔堅牽犬甄絹繭肩見譴遣鵑抉決潔結缺訣兼慊箝謙鉗鎌京俓倞傾儆勁勍卿坰境庚徑慶憬擎敬景暻更梗涇炅烱璟璥瓊痙硬磬竟競絅經耕耿脛莖警輕逕鏡頃頸驚鯨係啓堺契季屆悸戒桂械"],["cda1","棨溪界癸磎稽系繫繼計誡谿階鷄古叩告呱固姑孤尻庫拷攷故敲暠枯槁沽痼皐睾稿羔考股膏苦苽菰藁蠱袴誥賈辜錮雇顧高鼓哭斛曲梏穀谷鵠困坤崑昆梱棍滾琨袞鯤汨滑骨供公共功孔工恐恭拱控攻珙空蚣貢鞏串寡戈果瓜"],["cea1","科菓誇課跨過鍋顆廓槨藿郭串冠官寬慣棺款灌琯瓘管罐菅觀貫關館刮恝括适侊光匡壙廣曠洸炚狂珖筐胱鑛卦掛罫乖傀塊壞怪愧拐槐魁宏紘肱轟交僑咬喬嬌嶠巧攪敎校橋狡皎矯絞翹膠蕎蛟較轎郊餃驕鮫丘久九仇俱具勾"],["cfa1","區口句咎嘔坵垢寇嶇廐懼拘救枸柩構歐毆毬求溝灸狗玖球瞿矩究絿耉臼舅舊苟衢謳購軀逑邱鉤銶駒驅鳩鷗龜國局菊鞠鞫麴君窘群裙軍郡堀屈掘窟宮弓穹窮芎躬倦券勸卷圈拳捲權淃眷厥獗蕨蹶闕机櫃潰詭軌饋句晷歸貴"],["d0a1","鬼龜叫圭奎揆槻珪硅窺竅糾葵規赳逵閨勻均畇筠菌鈞龜橘克剋劇戟棘極隙僅劤勤懃斤根槿瑾筋芹菫覲謹近饉契今妗擒昑檎琴禁禽芩衾衿襟金錦伋及急扱汲級給亘兢矜肯企伎其冀嗜器圻基埼夔奇妓寄岐崎己幾忌技旗旣"],["d1a1","朞期杞棋棄機欺氣汽沂淇玘琦琪璂璣畸畿碁磯祁祇祈祺箕紀綺羈耆耭肌記譏豈起錡錤飢饑騎騏驥麒緊佶吉拮桔金喫儺喇奈娜懦懶拏拿癩",5,"那樂",4,"諾酪駱亂卵暖欄煖爛蘭難鸞捏捺南嵐枏楠湳濫男藍襤拉"],["d2a1","納臘蠟衲囊娘廊",4,"乃來內奈柰耐冷女年撚秊念恬拈捻寧寗努勞奴弩怒擄櫓爐瑙盧",5,"駑魯",10,"濃籠聾膿農惱牢磊腦賂雷尿壘",7,"嫩訥杻紐勒",5,"能菱陵尼泥匿溺多茶"],["d3a1","丹亶但單團壇彖斷旦檀段湍短端簞緞蛋袒鄲鍛撻澾獺疸達啖坍憺擔曇淡湛潭澹痰聃膽蕁覃談譚錟沓畓答踏遝唐堂塘幢戇撞棠當糖螳黨代垈坮大對岱帶待戴擡玳臺袋貸隊黛宅德悳倒刀到圖堵塗導屠島嶋度徒悼挑掉搗桃"],["d4a1","棹櫂淘渡滔濤燾盜睹禱稻萄覩賭跳蹈逃途道都鍍陶韜毒瀆牘犢獨督禿篤纛讀墩惇敦旽暾沌焞燉豚頓乭突仝冬凍動同憧東桐棟洞潼疼瞳童胴董銅兜斗杜枓痘竇荳讀豆逗頭屯臀芚遁遯鈍得嶝橙燈登等藤謄鄧騰喇懶拏癩羅"],["d5a1","蘿螺裸邏樂洛烙珞絡落諾酪駱丹亂卵欄欒瀾爛蘭鸞剌辣嵐擥攬欖濫籃纜藍襤覽拉臘蠟廊朗浪狼琅瑯螂郞來崍徠萊冷掠略亮倆兩凉梁樑粮粱糧良諒輛量侶儷勵呂廬慮戾旅櫚濾礪藜蠣閭驢驪麗黎力曆歷瀝礫轢靂憐戀攣漣"],["d6a1","煉璉練聯蓮輦連鍊冽列劣洌烈裂廉斂殮濂簾獵令伶囹寧岺嶺怜玲笭羚翎聆逞鈴零靈領齡例澧禮醴隷勞怒撈擄櫓潞瀘爐盧老蘆虜路輅露魯鷺鹵碌祿綠菉錄鹿麓論壟弄朧瀧瓏籠聾儡瀨牢磊賂賚賴雷了僚寮廖料燎療瞭聊蓼"],["d7a1","遼鬧龍壘婁屢樓淚漏瘻累縷蔞褸鏤陋劉旒柳榴流溜瀏琉瑠留瘤硫謬類六戮陸侖倫崙淪綸輪律慄栗率隆勒肋凜凌楞稜綾菱陵俚利厘吏唎履悧李梨浬犁狸理璃異痢籬罹羸莉裏裡里釐離鯉吝潾燐璘藺躪隣鱗麟林淋琳臨霖砬"],["d8a1","立笠粒摩瑪痲碼磨馬魔麻寞幕漠膜莫邈万卍娩巒彎慢挽晩曼滿漫灣瞞萬蔓蠻輓饅鰻唜抹末沫茉襪靺亡妄忘忙望網罔芒茫莽輞邙埋妹媒寐昧枚梅每煤罵買賣邁魅脈貊陌驀麥孟氓猛盲盟萌冪覓免冕勉棉沔眄眠綿緬面麵滅"],["d9a1","蔑冥名命明暝椧溟皿瞑茗蓂螟酩銘鳴袂侮冒募姆帽慕摸摹暮某模母毛牟牡瑁眸矛耗芼茅謀謨貌木沐牧目睦穆鶩歿沒夢朦蒙卯墓妙廟描昴杳渺猫竗苗錨務巫憮懋戊拇撫无楙武毋無珷畝繆舞茂蕪誣貿霧鵡墨默們刎吻問文"],["daa1","汶紊紋聞蚊門雯勿沕物味媚尾嵋彌微未梶楣渼湄眉米美薇謎迷靡黴岷悶愍憫敏旻旼民泯玟珉緡閔密蜜謐剝博拍搏撲朴樸泊珀璞箔粕縛膊舶薄迫雹駁伴半反叛拌搬攀斑槃泮潘班畔瘢盤盼磐磻礬絆般蟠返頒飯勃拔撥渤潑"],["dba1","發跋醱鉢髮魃倣傍坊妨尨幇彷房放方旁昉枋榜滂磅紡肪膀舫芳蒡蚌訪謗邦防龐倍俳北培徘拜排杯湃焙盃背胚裴裵褙賠輩配陪伯佰帛柏栢白百魄幡樊煩燔番磻繁蕃藩飜伐筏罰閥凡帆梵氾汎泛犯範范法琺僻劈壁擘檗璧癖"],["dca1","碧蘗闢霹便卞弁變辨辯邊別瞥鱉鼈丙倂兵屛幷昞昺柄棅炳甁病秉竝輧餠騈保堡報寶普步洑湺潽珤甫菩補褓譜輔伏僕匐卜宓復服福腹茯蔔複覆輹輻馥鰒本乶俸奉封峯峰捧棒烽熢琫縫蓬蜂逢鋒鳳不付俯傅剖副否咐埠夫婦"],["dda1","孚孵富府復扶敷斧浮溥父符簿缶腐腑膚艀芙莩訃負賦賻赴趺部釜阜附駙鳧北分吩噴墳奔奮忿憤扮昐汾焚盆粉糞紛芬賁雰不佛弗彿拂崩朋棚硼繃鵬丕備匕匪卑妃婢庇悲憊扉批斐枇榧比毖毗毘沸泌琵痺砒碑秕秘粃緋翡肥"],["dea1","脾臂菲蜚裨誹譬費鄙非飛鼻嚬嬪彬斌檳殯浜濱瀕牝玭貧賓頻憑氷聘騁乍事些仕伺似使俟僿史司唆嗣四士奢娑寫寺射巳師徙思捨斜斯柶査梭死沙泗渣瀉獅砂社祀祠私篩紗絲肆舍莎蓑蛇裟詐詞謝賜赦辭邪飼駟麝削數朔索"],["dfa1","傘刪山散汕珊産疝算蒜酸霰乷撒殺煞薩三參杉森渗芟蔘衫揷澁鈒颯上傷像償商喪嘗孀尙峠常床庠廂想桑橡湘爽牀狀相祥箱翔裳觴詳象賞霜塞璽賽嗇塞穡索色牲生甥省笙墅壻嶼序庶徐恕抒捿敍暑曙書栖棲犀瑞筮絮緖署"],["e0a1","胥舒薯西誓逝鋤黍鼠夕奭席惜昔晳析汐淅潟石碩蓆釋錫仙僊先善嬋宣扇敾旋渲煽琁瑄璇璿癬禪線繕羨腺膳船蘚蟬詵跣選銑鐥饍鮮卨屑楔泄洩渫舌薛褻設說雪齧剡暹殲纖蟾贍閃陝攝涉燮葉城姓宬性惺成星晟猩珹盛省筬"],["e1a1","聖聲腥誠醒世勢歲洗稅笹細說貰召嘯塑宵小少巢所掃搔昭梳沼消溯瀟炤燒甦疏疎瘙笑篠簫素紹蔬蕭蘇訴逍遡邵銷韶騷俗屬束涑粟續謖贖速孫巽損蓀遜飡率宋悚松淞訟誦送頌刷殺灑碎鎖衰釗修受嗽囚垂壽嫂守岫峀帥愁"],["e2a1","戍手授搜收數樹殊水洙漱燧狩獸琇璲瘦睡秀穗竪粹綏綬繡羞脩茱蒐蓚藪袖誰讐輸遂邃酬銖銹隋隧隨雖需須首髓鬚叔塾夙孰宿淑潚熟琡璹肅菽巡徇循恂旬栒楯橓殉洵淳珣盾瞬筍純脣舜荀蓴蕣詢諄醇錞順馴戌術述鉥崇崧"],["e3a1","嵩瑟膝蝨濕拾習褶襲丞乘僧勝升承昇繩蠅陞侍匙嘶始媤尸屎屍市弑恃施是時枾柴猜矢示翅蒔蓍視試詩諡豕豺埴寔式息拭植殖湜熄篒蝕識軾食飾伸侁信呻娠宸愼新晨燼申神紳腎臣莘薪藎蜃訊身辛辰迅失室實悉審尋心沁"],["e4a1","沈深瀋甚芯諶什十拾雙氏亞俄兒啞娥峨我牙芽莪蛾衙訝阿雅餓鴉鵝堊岳嶽幄惡愕握樂渥鄂鍔顎鰐齷安岸按晏案眼雁鞍顔鮟斡謁軋閼唵岩巖庵暗癌菴闇壓押狎鴨仰央怏昻殃秧鴦厓哀埃崖愛曖涯碍艾隘靄厄扼掖液縊腋額"],["e5a1","櫻罌鶯鸚也倻冶夜惹揶椰爺耶若野弱掠略約若葯蒻藥躍亮佯兩凉壤孃恙揚攘敭暘梁楊樣洋瀁煬痒瘍禳穰糧羊良襄諒讓釀陽量養圄御於漁瘀禦語馭魚齬億憶抑檍臆偃堰彦焉言諺孼蘖俺儼嚴奄掩淹嶪業円予余勵呂女如廬"],["e6a1","旅歟汝濾璵礖礪與艅茹輿轝閭餘驪麗黎亦力域役易曆歷疫繹譯轢逆驛嚥堧姸娟宴年延憐戀捐挻撚椽沇沿涎涓淵演漣烟然煙煉燃燕璉硏硯秊筵緣練縯聯衍軟輦蓮連鉛鍊鳶列劣咽悅涅烈熱裂說閱厭廉念捻染殮炎焰琰艶苒"],["e7a1","簾閻髥鹽曄獵燁葉令囹塋寧嶺嶸影怜映暎楹榮永泳渶潁濚瀛瀯煐營獰玲瑛瑩瓔盈穎纓羚聆英詠迎鈴鍈零霙靈領乂倪例刈叡曳汭濊猊睿穢芮藝蘂禮裔詣譽豫醴銳隸霓預五伍俉傲午吾吳嗚塢墺奧娛寤悟惡懊敖旿晤梧汚澳"],["e8a1","烏熬獒筽蜈誤鰲鼇屋沃獄玉鈺溫瑥瘟穩縕蘊兀壅擁瓮甕癰翁邕雍饔渦瓦窩窪臥蛙蝸訛婉完宛梡椀浣玩琓琬碗緩翫脘腕莞豌阮頑曰往旺枉汪王倭娃歪矮外嵬巍猥畏了僚僥凹堯夭妖姚寥寮尿嶢拗搖撓擾料曜樂橈燎燿瑤療"],["e9a1","窈窯繇繞耀腰蓼蟯要謠遙遼邀饒慾欲浴縟褥辱俑傭冗勇埇墉容庸慂榕涌湧溶熔瑢用甬聳茸蓉踊鎔鏞龍于佑偶優又友右宇寓尤愚憂旴牛玗瑀盂祐禑禹紆羽芋藕虞迂遇郵釪隅雨雩勖彧旭昱栯煜稶郁頊云暈橒殞澐熉耘芸蕓"],["eaa1","運隕雲韻蔚鬱亐熊雄元原員圓園垣媛嫄寃怨愿援沅洹湲源爰猿瑗苑袁轅遠阮院願鴛月越鉞位偉僞危圍委威尉慰暐渭爲瑋緯胃萎葦蔿蝟衛褘謂違韋魏乳侑儒兪劉唯喩孺宥幼幽庾悠惟愈愉揄攸有杻柔柚柳楡楢油洧流游溜"],["eba1","濡猶猷琉瑜由留癒硫紐維臾萸裕誘諛諭踰蹂遊逾遺酉釉鍮類六堉戮毓肉育陸倫允奫尹崙淪潤玧胤贇輪鈗閏律慄栗率聿戎瀜絨融隆垠恩慇殷誾銀隱乙吟淫蔭陰音飮揖泣邑凝應膺鷹依倚儀宜意懿擬椅毅疑矣義艤薏蟻衣誼"],["eca1","議醫二以伊利吏夷姨履已弛彛怡易李梨泥爾珥理異痍痢移罹而耳肄苡荑裏裡貽貳邇里離飴餌匿溺瀷益翊翌翼謚人仁刃印吝咽因姻寅引忍湮燐璘絪茵藺蚓認隣靭靷鱗麟一佚佾壹日溢逸鎰馹任壬妊姙恁林淋稔臨荏賃入卄"],["eda1","立笠粒仍剩孕芿仔刺咨姉姿子字孜恣慈滋炙煮玆瓷疵磁紫者自茨蔗藉諮資雌作勺嚼斫昨灼炸爵綽芍酌雀鵲孱棧殘潺盞岑暫潛箴簪蠶雜丈仗匠場墻壯奬將帳庄張掌暲杖樟檣欌漿牆狀獐璋章粧腸臟臧莊葬蔣薔藏裝贓醬長"],["eea1","障再哉在宰才材栽梓渽滓災縡裁財載齋齎爭箏諍錚佇低儲咀姐底抵杵楮樗沮渚狙猪疽箸紵苧菹著藷詛貯躇這邸雎齟勣吊嫡寂摘敵滴狄炙的積笛籍績翟荻謫賊赤跡蹟迪迹適鏑佃佺傳全典前剪塡塼奠專展廛悛戰栓殿氈澱"],["efa1","煎琠田甸畑癲筌箋箭篆纏詮輾轉鈿銓錢鐫電顚顫餞切截折浙癤竊節絶占岾店漸点粘霑鮎點接摺蝶丁井亭停偵呈姃定幀庭廷征情挺政整旌晶晸柾楨檉正汀淀淨渟湞瀞炡玎珽町睛碇禎程穽精綎艇訂諪貞鄭酊釘鉦鋌錠霆靖"],["f0a1","靜頂鼎制劑啼堤帝弟悌提梯濟祭第臍薺製諸蹄醍除際霽題齊俎兆凋助嘲弔彫措操早晁曺曹朝條棗槽漕潮照燥爪璪眺祖祚租稠窕粗糟組繰肇藻蚤詔調趙躁造遭釣阻雕鳥族簇足鏃存尊卒拙猝倧宗從悰慫棕淙琮種終綜縱腫"],["f1a1","踪踵鍾鐘佐坐左座挫罪主住侏做姝胄呪周嗾奏宙州廚晝朱柱株注洲湊澍炷珠疇籌紂紬綢舟蛛註誅走躊輳週酎酒鑄駐竹粥俊儁准埈寯峻晙樽浚準濬焌畯竣蠢逡遵雋駿茁中仲衆重卽櫛楫汁葺增憎曾拯烝甑症繒蒸證贈之只"],["f2a1","咫地址志持指摯支旨智枝枳止池沚漬知砥祉祗紙肢脂至芝芷蜘誌識贄趾遲直稙稷織職唇嗔塵振搢晉晋桭榛殄津溱珍瑨璡畛疹盡眞瞋秦縉縝臻蔯袗診賑軫辰進鎭陣陳震侄叱姪嫉帙桎瓆疾秩窒膣蛭質跌迭斟朕什執潗緝輯"],["f3a1","鏶集徵懲澄且侘借叉嗟嵯差次此磋箚茶蹉車遮捉搾着窄錯鑿齪撰澯燦璨瓚竄簒纂粲纘讚贊鑽餐饌刹察擦札紮僭參塹慘慙懺斬站讒讖倉倡創唱娼廠彰愴敞昌昶暢槍滄漲猖瘡窓脹艙菖蒼債埰寀寨彩採砦綵菜蔡采釵冊柵策"],["f4a1","責凄妻悽處倜刺剔尺慽戚拓擲斥滌瘠脊蹠陟隻仟千喘天川擅泉淺玔穿舛薦賤踐遷釧闡阡韆凸哲喆徹撤澈綴輟轍鐵僉尖沾添甛瞻簽籤詹諂堞妾帖捷牒疊睫諜貼輒廳晴淸聽菁請靑鯖切剃替涕滯締諦逮遞體初剿哨憔抄招梢"],["f5a1","椒楚樵炒焦硝礁礎秒稍肖艸苕草蕉貂超酢醋醮促囑燭矗蜀觸寸忖村邨叢塚寵悤憁摠總聰蔥銃撮催崔最墜抽推椎楸樞湫皺秋芻萩諏趨追鄒酋醜錐錘鎚雛騶鰍丑畜祝竺筑築縮蓄蹙蹴軸逐春椿瑃出朮黜充忠沖蟲衝衷悴膵萃"],["f6a1","贅取吹嘴娶就炊翠聚脆臭趣醉驟鷲側仄厠惻測層侈値嗤峙幟恥梔治淄熾痔痴癡稚穉緇緻置致蚩輜雉馳齒則勅飭親七柒漆侵寢枕沈浸琛砧針鍼蟄秤稱快他咤唾墮妥惰打拖朶楕舵陀馱駝倬卓啄坼度托拓擢晫柝濁濯琢琸託"],["f7a1","鐸呑嘆坦彈憚歎灘炭綻誕奪脫探眈耽貪塔搭榻宕帑湯糖蕩兌台太怠態殆汰泰笞胎苔跆邰颱宅擇澤撑攄兎吐土討慟桶洞痛筒統通堆槌腿褪退頹偸套妬投透鬪慝特闖坡婆巴把播擺杷波派爬琶破罷芭跛頗判坂板版瓣販辦鈑"],["f8a1","阪八叭捌佩唄悖敗沛浿牌狽稗覇貝彭澎烹膨愎便偏扁片篇編翩遍鞭騙貶坪平枰萍評吠嬖幣廢弊斃肺蔽閉陛佈包匍匏咆哺圃布怖抛抱捕暴泡浦疱砲胞脯苞葡蒲袍褒逋鋪飽鮑幅暴曝瀑爆輻俵剽彪慓杓標漂瓢票表豹飇飄驃"],["f9a1","品稟楓諷豊風馮彼披疲皮被避陂匹弼必泌珌畢疋筆苾馝乏逼下何厦夏廈昰河瑕荷蝦賀遐霞鰕壑學虐謔鶴寒恨悍旱汗漢澣瀚罕翰閑閒限韓割轄函含咸啣喊檻涵緘艦銜陷鹹合哈盒蛤閤闔陜亢伉姮嫦巷恒抗杭桁沆港缸肛航"],["faa1","行降項亥偕咳垓奚孩害懈楷海瀣蟹解該諧邂駭骸劾核倖幸杏荇行享向嚮珦鄕響餉饗香噓墟虛許憲櫶獻軒歇險驗奕爀赫革俔峴弦懸晛泫炫玄玹現眩睍絃絢縣舷衒見賢鉉顯孑穴血頁嫌俠協夾峽挾浹狹脅脇莢鋏頰亨兄刑型"],["fba1","形泂滎瀅灐炯熒珩瑩荊螢衡逈邢鎣馨兮彗惠慧暳蕙蹊醯鞋乎互呼壕壺好岵弧戶扈昊晧毫浩淏湖滸澔濠濩灝狐琥瑚瓠皓祜糊縞胡芦葫蒿虎號蝴護豪鎬頀顥惑或酷婚昏混渾琿魂忽惚笏哄弘汞泓洪烘紅虹訌鴻化和嬅樺火畵"],["fca1","禍禾花華話譁貨靴廓擴攫確碻穫丸喚奐宦幻患換歡晥桓渙煥環紈還驩鰥活滑猾豁闊凰幌徨恍惶愰慌晃晄榥況湟滉潢煌璜皇篁簧荒蝗遑隍黃匯回廻徊恢悔懷晦會檜淮澮灰獪繪膾茴蛔誨賄劃獲宖橫鐄哮嚆孝效斅曉梟涍淆"],["fda1","爻肴酵驍侯候厚后吼喉嗅帿後朽煦珝逅勛勳塤壎焄熏燻薰訓暈薨喧暄煊萱卉喙毁彙徽揮暉煇諱輝麾休携烋畦虧恤譎鷸兇凶匈洶胸黑昕欣炘痕吃屹紇訖欠欽歆吸恰洽翕興僖凞喜噫囍姬嬉希憙憘戱晞曦熙熹熺犧禧稀羲詰"]]');
const require$$6 = /* @__PURE__ */ JSON.parse('[["0","\\u0000",127],["a140","　，、。．‧；：？！︰…‥﹐﹑﹒·﹔﹕﹖﹗｜–︱—︳╴︴﹏（）︵︶｛｝︷︸〔〕︹︺【】︻︼《》︽︾〈〉︿﹀「」﹁﹂『』﹃﹄﹙﹚"],["a1a1","﹛﹜﹝﹞‘’“”〝〞‵′＃＆＊※§〃○●△▲◎☆★◇◆□■▽▼㊣℅¯￣＿ˍ﹉﹊﹍﹎﹋﹌﹟﹠﹡＋－×÷±√＜＞＝≦≧≠∞≒≡﹢",4,"～∩∪⊥∠∟⊿㏒㏑∫∮∵∴♀♂⊕⊙↑↓←→↖↗↙↘∥∣／"],["a240","＼∕﹨＄￥〒￠￡％＠℃℉﹩﹪﹫㏕㎜㎝㎞㏎㎡㎎㎏㏄°兙兛兞兝兡兣嗧瓩糎▁",7,"▏▎▍▌▋▊▉┼┴┬┤├▔─│▕┌┐└┘╭"],["a2a1","╮╰╯═╞╪╡◢◣◥◤╱╲╳０",9,"Ⅰ",9,"〡",8,"十卄卅Ａ",25,"ａ",21],["a340","ｗｘｙｚΑ",16,"Σ",6,"α",16,"σ",6,"ㄅ",10],["a3a1","ㄐ",25,"˙ˉˊˇˋ"],["a3e1","€"],["a440","一乙丁七乃九了二人儿入八几刀刁力匕十卜又三下丈上丫丸凡久么也乞于亡兀刃勺千叉口土士夕大女子孑孓寸小尢尸山川工己已巳巾干廾弋弓才"],["a4a1","丑丐不中丰丹之尹予云井互五亢仁什仃仆仇仍今介仄元允內六兮公冗凶分切刈勻勾勿化匹午升卅卞厄友及反壬天夫太夭孔少尤尺屯巴幻廿弔引心戈戶手扎支文斗斤方日曰月木欠止歹毋比毛氏水火爪父爻片牙牛犬王丙"],["a540","世丕且丘主乍乏乎以付仔仕他仗代令仙仞充兄冉冊冬凹出凸刊加功包匆北匝仟半卉卡占卯卮去可古右召叮叩叨叼司叵叫另只史叱台句叭叻四囚外"],["a5a1","央失奴奶孕它尼巨巧左市布平幼弁弘弗必戊打扔扒扑斥旦朮本未末札正母民氐永汁汀氾犯玄玉瓜瓦甘生用甩田由甲申疋白皮皿目矛矢石示禾穴立丞丟乒乓乩亙交亦亥仿伉伙伊伕伍伐休伏仲件任仰仳份企伋光兇兆先全"],["a640","共再冰列刑划刎刖劣匈匡匠印危吉吏同吊吐吁吋各向名合吃后吆吒因回囝圳地在圭圬圯圩夙多夷夸妄奸妃好她如妁字存宇守宅安寺尖屹州帆并年"],["a6a1","式弛忙忖戎戌戍成扣扛托收早旨旬旭曲曳有朽朴朱朵次此死氖汝汗汙江池汐汕污汛汍汎灰牟牝百竹米糸缶羊羽老考而耒耳聿肉肋肌臣自至臼舌舛舟艮色艾虫血行衣西阡串亨位住佇佗佞伴佛何估佐佑伽伺伸佃佔似但佣"],["a740","作你伯低伶余佝佈佚兌克免兵冶冷別判利刪刨劫助努劬匣即卵吝吭吞吾否呎吧呆呃吳呈呂君吩告吹吻吸吮吵吶吠吼呀吱含吟听囪困囤囫坊坑址坍"],["a7a1","均坎圾坐坏圻壯夾妝妒妨妞妣妙妖妍妤妓妊妥孝孜孚孛完宋宏尬局屁尿尾岐岑岔岌巫希序庇床廷弄弟彤形彷役忘忌志忍忱快忸忪戒我抄抗抖技扶抉扭把扼找批扳抒扯折扮投抓抑抆改攻攸旱更束李杏材村杜杖杞杉杆杠"],["a840","杓杗步每求汞沙沁沈沉沅沛汪決沐汰沌汨沖沒汽沃汲汾汴沆汶沍沔沘沂灶灼災灸牢牡牠狄狂玖甬甫男甸皂盯矣私秀禿究系罕肖肓肝肘肛肚育良芒"],["a8a1","芋芍見角言谷豆豕貝赤走足身車辛辰迂迆迅迄巡邑邢邪邦那酉釆里防阮阱阪阬並乖乳事些亞享京佯依侍佳使佬供例來侃佰併侈佩佻侖佾侏侑佺兔兒兕兩具其典冽函刻券刷刺到刮制剁劾劻卒協卓卑卦卷卸卹取叔受味呵"],["a940","咖呸咕咀呻呷咄咒咆呼咐呱呶和咚呢周咋命咎固垃坷坪坩坡坦坤坼夜奉奇奈奄奔妾妻委妹妮姑姆姐姍始姓姊妯妳姒姅孟孤季宗定官宜宙宛尚屈居"],["a9a1","屆岷岡岸岩岫岱岳帘帚帖帕帛帑幸庚店府底庖延弦弧弩往征彿彼忝忠忽念忿怏怔怯怵怖怪怕怡性怩怫怛或戕房戾所承拉拌拄抿拂抹拒招披拓拔拋拈抨抽押拐拙拇拍抵拚抱拘拖拗拆抬拎放斧於旺昔易昌昆昂明昀昏昕昊"],["aa40","昇服朋杭枋枕東果杳杷枇枝林杯杰板枉松析杵枚枓杼杪杲欣武歧歿氓氛泣注泳沱泌泥河沽沾沼波沫法泓沸泄油況沮泗泅泱沿治泡泛泊沬泯泜泖泠"],["aaa1","炕炎炒炊炙爬爭爸版牧物狀狎狙狗狐玩玨玟玫玥甽疝疙疚的盂盲直知矽社祀祁秉秈空穹竺糾罔羌羋者肺肥肢肱股肫肩肴肪肯臥臾舍芳芝芙芭芽芟芹花芬芥芯芸芣芰芾芷虎虱初表軋迎返近邵邸邱邶采金長門阜陀阿阻附"],["ab40","陂隹雨青非亟亭亮信侵侯便俠俑俏保促侶俘俟俊俗侮俐俄係俚俎俞侷兗冒冑冠剎剃削前剌剋則勇勉勃勁匍南卻厚叛咬哀咨哎哉咸咦咳哇哂咽咪品"],["aba1","哄哈咯咫咱咻咩咧咿囿垂型垠垣垢城垮垓奕契奏奎奐姜姘姿姣姨娃姥姪姚姦威姻孩宣宦室客宥封屎屏屍屋峙峒巷帝帥帟幽庠度建弈弭彥很待徊律徇後徉怒思怠急怎怨恍恰恨恢恆恃恬恫恪恤扁拜挖按拼拭持拮拽指拱拷"],["ac40","拯括拾拴挑挂政故斫施既春昭映昧是星昨昱昤曷柿染柱柔某柬架枯柵柩柯柄柑枴柚查枸柏柞柳枰柙柢柝柒歪殃殆段毒毗氟泉洋洲洪流津洌洱洞洗"],["aca1","活洽派洶洛泵洹洧洸洩洮洵洎洫炫為炳炬炯炭炸炮炤爰牲牯牴狩狠狡玷珊玻玲珍珀玳甚甭畏界畎畋疫疤疥疢疣癸皆皇皈盈盆盃盅省盹相眉看盾盼眇矜砂研砌砍祆祉祈祇禹禺科秒秋穿突竿竽籽紂紅紀紉紇約紆缸美羿耄"],["ad40","耐耍耑耶胖胥胚胃胄背胡胛胎胞胤胝致舢苧范茅苣苛苦茄若茂茉苒苗英茁苜苔苑苞苓苟苯茆虐虹虻虺衍衫要觔計訂訃貞負赴赳趴軍軌述迦迢迪迥"],["ada1","迭迫迤迨郊郎郁郃酋酊重閂限陋陌降面革韋韭音頁風飛食首香乘亳倌倍倣俯倦倥俸倩倖倆值借倚倒們俺倀倔倨俱倡個候倘俳修倭倪俾倫倉兼冤冥冢凍凌准凋剖剜剔剛剝匪卿原厝叟哨唐唁唷哼哥哲唆哺唔哩哭員唉哮哪"],["ae40","哦唧唇哽唏圃圄埂埔埋埃堉夏套奘奚娑娘娜娟娛娓姬娠娣娩娥娌娉孫屘宰害家宴宮宵容宸射屑展屐峭峽峻峪峨峰島崁峴差席師庫庭座弱徒徑徐恙"],["aea1","恣恥恐恕恭恩息悄悟悚悍悔悌悅悖扇拳挈拿捎挾振捕捂捆捏捉挺捐挽挪挫挨捍捌效敉料旁旅時晉晏晃晒晌晅晁書朔朕朗校核案框桓根桂桔栩梳栗桌桑栽柴桐桀格桃株桅栓栘桁殊殉殷氣氧氨氦氤泰浪涕消涇浦浸海浙涓"],["af40","浬涉浮浚浴浩涌涊浹涅浥涔烊烘烤烙烈烏爹特狼狹狽狸狷玆班琉珮珠珪珞畔畝畜畚留疾病症疲疳疽疼疹痂疸皋皰益盍盎眩真眠眨矩砰砧砸砝破砷"],["afa1","砥砭砠砟砲祕祐祠祟祖神祝祗祚秤秣秧租秦秩秘窄窈站笆笑粉紡紗紋紊素索純紐紕級紜納紙紛缺罟羔翅翁耆耘耕耙耗耽耿胱脂胰脅胭胴脆胸胳脈能脊胼胯臭臬舀舐航舫舨般芻茫荒荔荊茸荐草茵茴荏茲茹茶茗荀茱茨荃"],["b040","虔蚊蚪蚓蚤蚩蚌蚣蚜衰衷袁袂衽衹記訐討訌訕訊託訓訖訏訑豈豺豹財貢起躬軒軔軏辱送逆迷退迺迴逃追逅迸邕郡郝郢酒配酌釘針釗釜釙閃院陣陡"],["b0a1","陛陝除陘陞隻飢馬骨高鬥鬲鬼乾偺偽停假偃偌做偉健偶偎偕偵側偷偏倏偯偭兜冕凰剪副勒務勘動匐匏匙匿區匾參曼商啪啦啄啞啡啃啊唱啖問啕唯啤唸售啜唬啣唳啁啗圈國圉域堅堊堆埠埤基堂堵執培夠奢娶婁婉婦婪婀"],["b140","娼婢婚婆婊孰寇寅寄寂宿密尉專將屠屜屝崇崆崎崛崖崢崑崩崔崙崤崧崗巢常帶帳帷康庸庶庵庾張強彗彬彩彫得徙從徘御徠徜恿患悉悠您惋悴惦悽"],["b1a1","情悻悵惜悼惘惕惆惟悸惚惇戚戛扈掠控捲掖探接捷捧掘措捱掩掉掃掛捫推掄授掙採掬排掏掀捻捩捨捺敝敖救教敗啟敏敘敕敔斜斛斬族旋旌旎晝晚晤晨晦晞曹勗望梁梯梢梓梵桿桶梱梧梗械梃棄梭梆梅梔條梨梟梡梂欲殺"],["b240","毫毬氫涎涼淳淙液淡淌淤添淺清淇淋涯淑涮淞淹涸混淵淅淒渚涵淚淫淘淪深淮淨淆淄涪淬涿淦烹焉焊烽烯爽牽犁猜猛猖猓猙率琅琊球理現琍瓠瓶"],["b2a1","瓷甜產略畦畢異疏痔痕疵痊痍皎盔盒盛眷眾眼眶眸眺硫硃硎祥票祭移窒窕笠笨笛第符笙笞笮粒粗粕絆絃統紮紹紼絀細紳組累終紲紱缽羞羚翌翎習耜聊聆脯脖脣脫脩脰脤舂舵舷舶船莎莞莘荸莢莖莽莫莒莊莓莉莠荷荻荼"],["b340","莆莧處彪蛇蛀蚶蛄蚵蛆蛋蚱蚯蛉術袞袈被袒袖袍袋覓規訪訝訣訥許設訟訛訢豉豚販責貫貨貪貧赧赦趾趺軛軟這逍通逗連速逝逐逕逞造透逢逖逛途"],["b3a1","部郭都酗野釵釦釣釧釭釩閉陪陵陳陸陰陴陶陷陬雀雪雩章竟頂頃魚鳥鹵鹿麥麻傢傍傅備傑傀傖傘傚最凱割剴創剩勞勝勛博厥啻喀喧啼喊喝喘喂喜喪喔喇喋喃喳單喟唾喲喚喻喬喱啾喉喫喙圍堯堪場堤堰報堡堝堠壹壺奠"],["b440","婷媚婿媒媛媧孳孱寒富寓寐尊尋就嵌嵐崴嵇巽幅帽幀幃幾廊廁廂廄弼彭復循徨惑惡悲悶惠愜愣惺愕惰惻惴慨惱愎惶愉愀愒戟扉掣掌描揀揩揉揆揍"],["b4a1","插揣提握揖揭揮捶援揪換摒揚揹敞敦敢散斑斐斯普晰晴晶景暑智晾晷曾替期朝棺棕棠棘棗椅棟棵森棧棹棒棲棣棋棍植椒椎棉棚楮棻款欺欽殘殖殼毯氮氯氬港游湔渡渲湧湊渠渥渣減湛湘渤湖湮渭渦湯渴湍渺測湃渝渾滋"],["b540","溉渙湎湣湄湲湩湟焙焚焦焰無然煮焜牌犄犀猶猥猴猩琺琪琳琢琥琵琶琴琯琛琦琨甥甦畫番痢痛痣痙痘痞痠登發皖皓皴盜睏短硝硬硯稍稈程稅稀窘"],["b5a1","窗窖童竣等策筆筐筒答筍筋筏筑粟粥絞結絨絕紫絮絲絡給絢絰絳善翔翕耋聒肅腕腔腋腑腎脹腆脾腌腓腴舒舜菩萃菸萍菠菅萋菁華菱菴著萊菰萌菌菽菲菊萸萎萄菜萇菔菟虛蛟蛙蛭蛔蛛蛤蛐蛞街裁裂袱覃視註詠評詞証詁"],["b640","詔詛詐詆訴診訶詖象貂貯貼貳貽賁費賀貴買貶貿貸越超趁跎距跋跚跑跌跛跆軻軸軼辜逮逵週逸進逶鄂郵鄉郾酣酥量鈔鈕鈣鈉鈞鈍鈐鈇鈑閔閏開閑"],["b6a1","間閒閎隊階隋陽隅隆隍陲隄雁雅雄集雇雯雲韌項順須飧飪飯飩飲飭馮馭黃黍黑亂傭債傲傳僅傾催傷傻傯僇剿剷剽募勦勤勢勣匯嗟嗨嗓嗦嗎嗜嗇嗑嗣嗤嗯嗚嗡嗅嗆嗥嗉園圓塞塑塘塗塚塔填塌塭塊塢塒塋奧嫁嫉嫌媾媽媼"],["b740","媳嫂媲嵩嵯幌幹廉廈弒彙徬微愚意慈感想愛惹愁愈慎慌慄慍愾愴愧愍愆愷戡戢搓搾搞搪搭搽搬搏搜搔損搶搖搗搆敬斟新暗暉暇暈暖暄暘暍會榔業"],["b7a1","楚楷楠楔極椰概楊楨楫楞楓楹榆楝楣楛歇歲毀殿毓毽溢溯滓溶滂源溝滇滅溥溘溼溺溫滑準溜滄滔溪溧溴煎煙煩煤煉照煜煬煦煌煥煞煆煨煖爺牒猷獅猿猾瑯瑚瑕瑟瑞瑁琿瑙瑛瑜當畸瘀痰瘁痲痱痺痿痴痳盞盟睛睫睦睞督"],["b840","睹睪睬睜睥睨睢矮碎碰碗碘碌碉硼碑碓硿祺祿禁萬禽稜稚稠稔稟稞窟窠筷節筠筮筧粱粳粵經絹綑綁綏絛置罩罪署義羨群聖聘肆肄腱腰腸腥腮腳腫"],["b8a1","腹腺腦舅艇蒂葷落萱葵葦葫葉葬葛萼萵葡董葩葭葆虞虜號蛹蜓蜈蜇蜀蛾蛻蜂蜃蜆蜊衙裟裔裙補裘裝裡裊裕裒覜解詫該詳試詩詰誇詼詣誠話誅詭詢詮詬詹詻訾詨豢貊貉賊資賈賄貲賃賂賅跡跟跨路跳跺跪跤跦躲較載軾輊"],["b940","辟農運遊道遂達逼違遐遇遏過遍遑逾遁鄒鄗酬酪酩釉鈷鉗鈸鈽鉀鈾鉛鉋鉤鉑鈴鉉鉍鉅鈹鈿鉚閘隘隔隕雍雋雉雊雷電雹零靖靴靶預頑頓頊頒頌飼飴"],["b9a1","飽飾馳馱馴髡鳩麂鼎鼓鼠僧僮僥僖僭僚僕像僑僱僎僩兢凳劃劂匱厭嗾嘀嘛嘗嗽嘔嘆嘉嘍嘎嗷嘖嘟嘈嘐嗶團圖塵塾境墓墊塹墅塽壽夥夢夤奪奩嫡嫦嫩嫗嫖嫘嫣孵寞寧寡寥實寨寢寤察對屢嶄嶇幛幣幕幗幔廓廖弊彆彰徹慇"],["ba40","愿態慷慢慣慟慚慘慵截撇摘摔撤摸摟摺摑摧搴摭摻敲斡旗旖暢暨暝榜榨榕槁榮槓構榛榷榻榫榴槐槍榭槌榦槃榣歉歌氳漳演滾漓滴漩漾漠漬漏漂漢"],["baa1","滿滯漆漱漸漲漣漕漫漯澈漪滬漁滲滌滷熔熙煽熊熄熒爾犒犖獄獐瑤瑣瑪瑰瑭甄疑瘧瘍瘋瘉瘓盡監瞄睽睿睡磁碟碧碳碩碣禎福禍種稱窪窩竭端管箕箋筵算箝箔箏箸箇箄粹粽精綻綰綜綽綾綠緊綴網綱綺綢綿綵綸維緒緇綬"],["bb40","罰翠翡翟聞聚肇腐膀膏膈膊腿膂臧臺與舔舞艋蓉蒿蓆蓄蒙蒞蒲蒜蓋蒸蓀蓓蒐蒼蓑蓊蜿蜜蜻蜢蜥蜴蜘蝕蜷蜩裳褂裴裹裸製裨褚裯誦誌語誣認誡誓誤"],["bba1","說誥誨誘誑誚誧豪貍貌賓賑賒赫趙趕跼輔輒輕輓辣遠遘遜遣遙遞遢遝遛鄙鄘鄞酵酸酷酴鉸銀銅銘銖鉻銓銜銨鉼銑閡閨閩閣閥閤隙障際雌雒需靼鞅韶頗領颯颱餃餅餌餉駁骯骰髦魁魂鳴鳶鳳麼鼻齊億儀僻僵價儂儈儉儅凜"],["bc40","劇劈劉劍劊勰厲嘮嘻嘹嘲嘿嘴嘩噓噎噗噴嘶嘯嘰墀墟增墳墜墮墩墦奭嬉嫻嬋嫵嬌嬈寮寬審寫層履嶝嶔幢幟幡廢廚廟廝廣廠彈影德徵慶慧慮慝慕憂"],["bca1","慼慰慫慾憧憐憫憎憬憚憤憔憮戮摩摯摹撞撲撈撐撰撥撓撕撩撒撮播撫撚撬撙撢撳敵敷數暮暫暴暱樣樟槨樁樞標槽模樓樊槳樂樅槭樑歐歎殤毅毆漿潼澄潑潦潔澆潭潛潸潮澎潺潰潤澗潘滕潯潠潟熟熬熱熨牖犛獎獗瑩璋璃"],["bd40","瑾璀畿瘠瘩瘟瘤瘦瘡瘢皚皺盤瞎瞇瞌瞑瞋磋磅確磊碾磕碼磐稿稼穀稽稷稻窯窮箭箱範箴篆篇篁箠篌糊締練緯緻緘緬緝編緣線緞緩綞緙緲緹罵罷羯"],["bda1","翩耦膛膜膝膠膚膘蔗蔽蔚蓮蔬蔭蔓蔑蔣蔡蔔蓬蔥蓿蔆螂蝴蝶蝠蝦蝸蝨蝙蝗蝌蝓衛衝褐複褒褓褕褊誼諒談諄誕請諸課諉諂調誰論諍誶誹諛豌豎豬賠賞賦賤賬賭賢賣賜質賡赭趟趣踫踐踝踢踏踩踟踡踞躺輝輛輟輩輦輪輜輞"],["be40","輥適遮遨遭遷鄰鄭鄧鄱醇醉醋醃鋅銻銷鋪銬鋤鋁銳銼鋒鋇鋰銲閭閱霄霆震霉靠鞍鞋鞏頡頫頜颳養餓餒餘駝駐駟駛駑駕駒駙骷髮髯鬧魅魄魷魯鴆鴉"],["bea1","鴃麩麾黎墨齒儒儘儔儐儕冀冪凝劑劓勳噙噫噹噩噤噸噪器噥噱噯噬噢噶壁墾壇壅奮嬝嬴學寰導彊憲憑憩憊懍憶憾懊懈戰擅擁擋撻撼據擄擇擂操撿擒擔撾整曆曉暹曄曇暸樽樸樺橙橫橘樹橄橢橡橋橇樵機橈歙歷氅濂澱澡"],["bf40","濃澤濁澧澳激澹澶澦澠澴熾燉燐燒燈燕熹燎燙燜燃燄獨璜璣璘璟璞瓢甌甍瘴瘸瘺盧盥瞠瞞瞟瞥磨磚磬磧禦積穎穆穌穋窺篙簑築篤篛篡篩篦糕糖縊"],["bfa1","縑縈縛縣縞縝縉縐罹羲翰翱翮耨膳膩膨臻興艘艙蕊蕙蕈蕨蕩蕃蕉蕭蕪蕞螃螟螞螢融衡褪褲褥褫褡親覦諦諺諫諱謀諜諧諮諾謁謂諷諭諳諶諼豫豭貓賴蹄踱踴蹂踹踵輻輯輸輳辨辦遵遴選遲遼遺鄴醒錠錶鋸錳錯錢鋼錫錄錚"],["c040","錐錦錡錕錮錙閻隧隨險雕霎霑霖霍霓霏靛靜靦鞘頰頸頻頷頭頹頤餐館餞餛餡餚駭駢駱骸骼髻髭鬨鮑鴕鴣鴦鴨鴒鴛默黔龍龜優償儡儲勵嚎嚀嚐嚅嚇"],["c0a1","嚏壕壓壑壎嬰嬪嬤孺尷屨嶼嶺嶽嶸幫彌徽應懂懇懦懋戲戴擎擊擘擠擰擦擬擱擢擭斂斃曙曖檀檔檄檢檜櫛檣橾檗檐檠歜殮毚氈濘濱濟濠濛濤濫濯澀濬濡濩濕濮濰燧營燮燦燥燭燬燴燠爵牆獰獲璩環璦璨癆療癌盪瞳瞪瞰瞬"],["c140","瞧瞭矯磷磺磴磯礁禧禪穗窿簇簍篾篷簌篠糠糜糞糢糟糙糝縮績繆縷縲繃縫總縱繅繁縴縹繈縵縿縯罄翳翼聱聲聰聯聳臆臃膺臂臀膿膽臉膾臨舉艱薪"],["c1a1","薄蕾薜薑薔薯薛薇薨薊虧蟀蟑螳蟒蟆螫螻螺蟈蟋褻褶襄褸褽覬謎謗謙講謊謠謝謄謐豁谿豳賺賽購賸賻趨蹉蹋蹈蹊轄輾轂轅輿避遽還邁邂邀鄹醣醞醜鍍鎂錨鍵鍊鍥鍋錘鍾鍬鍛鍰鍚鍔闊闋闌闈闆隱隸雖霜霞鞠韓顆颶餵騁"],["c240","駿鮮鮫鮪鮭鴻鴿麋黏點黜黝黛鼾齋叢嚕嚮壙壘嬸彝懣戳擴擲擾攆擺擻擷斷曜朦檳檬櫃檻檸櫂檮檯歟歸殯瀉瀋濾瀆濺瀑瀏燻燼燾燸獷獵璧璿甕癖癘"],["c2a1","癒瞽瞿瞻瞼礎禮穡穢穠竄竅簫簧簪簞簣簡糧織繕繞繚繡繒繙罈翹翻職聶臍臏舊藏薩藍藐藉薰薺薹薦蟯蟬蟲蟠覆覲觴謨謹謬謫豐贅蹙蹣蹦蹤蹟蹕軀轉轍邇邃邈醫醬釐鎔鎊鎖鎢鎳鎮鎬鎰鎘鎚鎗闔闖闐闕離雜雙雛雞霤鞣鞦"],["c340","鞭韹額顏題顎顓颺餾餿餽餮馥騎髁鬃鬆魏魎魍鯊鯉鯽鯈鯀鵑鵝鵠黠鼕鼬儳嚥壞壟壢寵龐廬懲懷懶懵攀攏曠曝櫥櫝櫚櫓瀛瀟瀨瀚瀝瀕瀘爆爍牘犢獸"],["c3a1","獺璽瓊瓣疇疆癟癡矇礙禱穫穩簾簿簸簽簷籀繫繭繹繩繪羅繳羶羹羸臘藩藝藪藕藤藥藷蟻蠅蠍蟹蟾襠襟襖襞譁譜識證譚譎譏譆譙贈贊蹼蹲躇蹶蹬蹺蹴轔轎辭邊邋醱醮鏡鏑鏟鏃鏈鏜鏝鏖鏢鏍鏘鏤鏗鏨關隴難霪霧靡韜韻類"],["c440","願顛颼饅饉騖騙鬍鯨鯧鯖鯛鶉鵡鵲鵪鵬麒麗麓麴勸嚨嚷嚶嚴嚼壤孀孃孽寶巉懸懺攘攔攙曦朧櫬瀾瀰瀲爐獻瓏癢癥礦礪礬礫竇競籌籃籍糯糰辮繽繼"],["c4a1","纂罌耀臚艦藻藹蘑藺蘆蘋蘇蘊蠔蠕襤覺觸議譬警譯譟譫贏贍躉躁躅躂醴釋鐘鐃鏽闡霰飄饒饑馨騫騰騷騵鰓鰍鹹麵黨鼯齟齣齡儷儸囁囀囂夔屬巍懼懾攝攜斕曩櫻欄櫺殲灌爛犧瓖瓔癩矓籐纏續羼蘗蘭蘚蠣蠢蠡蠟襪襬覽譴"],["c540","護譽贓躊躍躋轟辯醺鐮鐳鐵鐺鐸鐲鐫闢霸霹露響顧顥饗驅驃驀騾髏魔魑鰭鰥鶯鶴鷂鶸麝黯鼙齜齦齧儼儻囈囊囉孿巔巒彎懿攤權歡灑灘玀瓤疊癮癬"],["c5a1","禳籠籟聾聽臟襲襯觼讀贖贗躑躓轡酈鑄鑑鑒霽霾韃韁顫饕驕驍髒鬚鱉鰱鰾鰻鷓鷗鼴齬齪龔囌巖戀攣攫攪曬欐瓚竊籤籣籥纓纖纔臢蘸蘿蠱變邐邏鑣鑠鑤靨顯饜驚驛驗髓體髑鱔鱗鱖鷥麟黴囑壩攬灞癱癲矗罐羈蠶蠹衢讓讒"],["c640","讖艷贛釀鑪靂靈靄韆顰驟鬢魘鱟鷹鷺鹼鹽鼇齷齲廳欖灣籬籮蠻觀躡釁鑲鑰顱饞髖鬣黌灤矚讚鑷韉驢驥纜讜躪釅鑽鑾鑼鱷鱸黷豔鑿鸚爨驪鬱鸛鸞籲"],["c940","乂乜凵匚厂万丌乇亍囗兀屮彳丏冇与丮亓仂仉仈冘勼卬厹圠夃夬尐巿旡殳毌气爿丱丼仨仜仩仡仝仚刌匜卌圢圣夗夯宁宄尒尻屴屳帄庀庂忉戉扐氕"],["c9a1","氶汃氿氻犮犰玊禸肊阞伎优伬仵伔仱伀价伈伝伂伅伢伓伄仴伒冱刓刉刐劦匢匟卍厊吇囡囟圮圪圴夼妀奼妅奻奾奷奿孖尕尥屼屺屻屾巟幵庄异弚彴忕忔忏扜扞扤扡扦扢扙扠扚扥旯旮朾朹朸朻机朿朼朳氘汆汒汜汏汊汔汋"],["ca40","汌灱牞犴犵玎甪癿穵网艸艼芀艽艿虍襾邙邗邘邛邔阢阤阠阣佖伻佢佉体佤伾佧佒佟佁佘伭伳伿佡冏冹刜刞刡劭劮匉卣卲厎厏吰吷吪呔呅吙吜吥吘"],["caa1","吽呏呁吨吤呇囮囧囥坁坅坌坉坋坒夆奀妦妘妠妗妎妢妐妏妧妡宎宒尨尪岍岏岈岋岉岒岊岆岓岕巠帊帎庋庉庌庈庍弅弝彸彶忒忑忐忭忨忮忳忡忤忣忺忯忷忻怀忴戺抃抌抎抏抔抇扱扻扺扰抁抈扷扽扲扴攷旰旴旳旲旵杅杇"],["cb40","杙杕杌杈杝杍杚杋毐氙氚汸汧汫沄沋沏汱汯汩沚汭沇沕沜汦汳汥汻沎灴灺牣犿犽狃狆狁犺狅玕玗玓玔玒町甹疔疕皁礽耴肕肙肐肒肜芐芏芅芎芑芓"],["cba1","芊芃芄豸迉辿邟邡邥邞邧邠阰阨阯阭丳侘佼侅佽侀侇佶佴侉侄佷佌侗佪侚佹侁佸侐侜侔侞侒侂侕佫佮冞冼冾刵刲刳剆刱劼匊匋匼厒厔咇呿咁咑咂咈呫呺呾呥呬呴呦咍呯呡呠咘呣呧呤囷囹坯坲坭坫坱坰坶垀坵坻坳坴坢"],["cc40","坨坽夌奅妵妺姏姎妲姌姁妶妼姃姖妱妽姀姈妴姇孢孥宓宕屄屇岮岤岠岵岯岨岬岟岣岭岢岪岧岝岥岶岰岦帗帔帙弨弢弣弤彔徂彾彽忞忥怭怦怙怲怋"],["cca1","怴怊怗怳怚怞怬怢怍怐怮怓怑怌怉怜戔戽抭抴拑抾抪抶拊抮抳抯抻抩抰抸攽斨斻昉旼昄昒昈旻昃昋昍昅旽昑昐曶朊枅杬枎枒杶杻枘枆构杴枍枌杺枟枑枙枃杽极杸杹枔欥殀歾毞氝沓泬泫泮泙沶泔沭泧沷泐泂沺泃泆泭泲"],["cd40","泒泝沴沊沝沀泞泀洰泍泇沰泹泏泩泑炔炘炅炓炆炄炑炖炂炚炃牪狖狋狘狉狜狒狔狚狌狑玤玡玭玦玢玠玬玝瓝瓨甿畀甾疌疘皯盳盱盰盵矸矼矹矻矺"],["cda1","矷祂礿秅穸穻竻籵糽耵肏肮肣肸肵肭舠芠苀芫芚芘芛芵芧芮芼芞芺芴芨芡芩苂芤苃芶芢虰虯虭虮豖迒迋迓迍迖迕迗邲邴邯邳邰阹阽阼阺陃俍俅俓侲俉俋俁俔俜俙侻侳俛俇俖侺俀侹俬剄剉勀勂匽卼厗厖厙厘咺咡咭咥哏"],["ce40","哃茍咷咮哖咶哅哆咠呰咼咢咾呲哞咰垵垞垟垤垌垗垝垛垔垘垏垙垥垚垕壴复奓姡姞姮娀姱姝姺姽姼姶姤姲姷姛姩姳姵姠姾姴姭宨屌峐峘峌峗峋峛"],["cea1","峞峚峉峇峊峖峓峔峏峈峆峎峟峸巹帡帢帣帠帤庰庤庢庛庣庥弇弮彖徆怷怹恔恲恞恅恓恇恉恛恌恀恂恟怤恄恘恦恮扂扃拏挍挋拵挎挃拫拹挏挌拸拶挀挓挔拺挕拻拰敁敃斪斿昶昡昲昵昜昦昢昳昫昺昝昴昹昮朏朐柁柲柈枺"],["cf40","柜枻柸柘柀枷柅柫柤柟枵柍枳柷柶柮柣柂枹柎柧柰枲柼柆柭柌枮柦柛柺柉柊柃柪柋欨殂殄殶毖毘毠氠氡洨洴洭洟洼洿洒洊泚洳洄洙洺洚洑洀洝浂"],["cfa1","洁洘洷洃洏浀洇洠洬洈洢洉洐炷炟炾炱炰炡炴炵炩牁牉牊牬牰牳牮狊狤狨狫狟狪狦狣玅珌珂珈珅玹玶玵玴珫玿珇玾珃珆玸珋瓬瓮甮畇畈疧疪癹盄眈眃眄眅眊盷盻盺矧矨砆砑砒砅砐砏砎砉砃砓祊祌祋祅祄秕种秏秖秎窀"],["d040","穾竑笀笁籺籸籹籿粀粁紃紈紁罘羑羍羾耇耎耏耔耷胘胇胠胑胈胂胐胅胣胙胜胊胕胉胏胗胦胍臿舡芔苙苾苹茇苨茀苕茺苫苖苴苬苡苲苵茌苻苶苰苪"],["d0a1","苤苠苺苳苭虷虴虼虳衁衎衧衪衩觓訄訇赲迣迡迮迠郱邽邿郕郅邾郇郋郈釔釓陔陏陑陓陊陎倞倅倇倓倢倰倛俵俴倳倷倬俶俷倗倜倠倧倵倯倱倎党冔冓凊凄凅凈凎剡剚剒剞剟剕剢勍匎厞唦哢唗唒哧哳哤唚哿唄唈哫唑唅哱"],["d140","唊哻哷哸哠唎唃唋圁圂埌堲埕埒垺埆垽垼垸垶垿埇埐垹埁夎奊娙娖娭娮娕娏娗娊娞娳孬宧宭宬尃屖屔峬峿峮峱峷崀峹帩帨庨庮庪庬弳弰彧恝恚恧"],["d1a1","恁悢悈悀悒悁悝悃悕悛悗悇悜悎戙扆拲挐捖挬捄捅挶捃揤挹捋捊挼挩捁挴捘捔捙挭捇挳捚捑挸捗捀捈敊敆旆旃旄旂晊晟晇晑朒朓栟栚桉栲栳栻桋桏栖栱栜栵栫栭栯桎桄栴栝栒栔栦栨栮桍栺栥栠欬欯欭欱欴歭肂殈毦毤"],["d240","毨毣毢毧氥浺浣浤浶洍浡涒浘浢浭浯涑涍淯浿涆浞浧浠涗浰浼浟涂涘洯浨涋浾涀涄洖涃浻浽浵涐烜烓烑烝烋缹烢烗烒烞烠烔烍烅烆烇烚烎烡牂牸"],["d2a1","牷牶猀狺狴狾狶狳狻猁珓珙珥珖玼珧珣珩珜珒珛珔珝珚珗珘珨瓞瓟瓴瓵甡畛畟疰痁疻痄痀疿疶疺皊盉眝眛眐眓眒眣眑眕眙眚眢眧砣砬砢砵砯砨砮砫砡砩砳砪砱祔祛祏祜祓祒祑秫秬秠秮秭秪秜秞秝窆窉窅窋窌窊窇竘笐"],["d340","笄笓笅笏笈笊笎笉笒粄粑粊粌粈粍粅紞紝紑紎紘紖紓紟紒紏紌罜罡罞罠罝罛羖羒翃翂翀耖耾耹胺胲胹胵脁胻脀舁舯舥茳茭荄茙荑茥荖茿荁茦茜茢"],["d3a1","荂荎茛茪茈茼荍茖茤茠茷茯茩荇荅荌荓茞茬荋茧荈虓虒蚢蚨蚖蚍蚑蚞蚇蚗蚆蚋蚚蚅蚥蚙蚡蚧蚕蚘蚎蚝蚐蚔衃衄衭衵衶衲袀衱衿衯袃衾衴衼訒豇豗豻貤貣赶赸趵趷趶軑軓迾迵适迿迻逄迼迶郖郠郙郚郣郟郥郘郛郗郜郤酐"],["d440","酎酏釕釢釚陜陟隼飣髟鬯乿偰偪偡偞偠偓偋偝偲偈偍偁偛偊偢倕偅偟偩偫偣偤偆偀偮偳偗偑凐剫剭剬剮勖勓匭厜啵啶唼啍啐唴唪啑啢唶唵唰啒啅"],["d4a1","唌唲啥啎唹啈唭唻啀啋圊圇埻堔埢埶埜埴堀埭埽堈埸堋埳埏堇埮埣埲埥埬埡堎埼堐埧堁堌埱埩埰堍堄奜婠婘婕婧婞娸娵婭婐婟婥婬婓婤婗婃婝婒婄婛婈媎娾婍娹婌婰婩婇婑婖婂婜孲孮寁寀屙崞崋崝崚崠崌崨崍崦崥崏"],["d540","崰崒崣崟崮帾帴庱庴庹庲庳弶弸徛徖徟悊悐悆悾悰悺惓惔惏惤惙惝惈悱惛悷惊悿惃惍惀挲捥掊掂捽掽掞掭掝掗掫掎捯掇掐据掯捵掜捭掮捼掤挻掟"],["d5a1","捸掅掁掑掍捰敓旍晥晡晛晙晜晢朘桹梇梐梜桭桮梮梫楖桯梣梬梩桵桴梲梏桷梒桼桫桲梪梀桱桾梛梖梋梠梉梤桸桻梑梌梊桽欶欳欷欸殑殏殍殎殌氪淀涫涴涳湴涬淩淢涷淶淔渀淈淠淟淖涾淥淜淝淛淴淊涽淭淰涺淕淂淏淉"],["d640","淐淲淓淽淗淍淣涻烺焍烷焗烴焌烰焄烳焐烼烿焆焓焀烸烶焋焂焎牾牻牼牿猝猗猇猑猘猊猈狿猏猞玈珶珸珵琄琁珽琇琀珺珼珿琌琋珴琈畤畣痎痒痏"],["d6a1","痋痌痑痐皏皉盓眹眯眭眱眲眴眳眽眥眻眵硈硒硉硍硊硌砦硅硐祤祧祩祪祣祫祡离秺秸秶秷窏窔窐笵筇笴笥笰笢笤笳笘笪笝笱笫笭笯笲笸笚笣粔粘粖粣紵紽紸紶紺絅紬紩絁絇紾紿絊紻紨罣羕羜羝羛翊翋翍翐翑翇翏翉耟"],["d740","耞耛聇聃聈脘脥脙脛脭脟脬脞脡脕脧脝脢舑舸舳舺舴舲艴莐莣莨莍荺荳莤荴莏莁莕莙荵莔莩荽莃莌莝莛莪莋荾莥莯莈莗莰荿莦莇莮荶莚虙虖蚿蚷"],["d7a1","蛂蛁蛅蚺蚰蛈蚹蚳蚸蛌蚴蚻蚼蛃蚽蚾衒袉袕袨袢袪袚袑袡袟袘袧袙袛袗袤袬袌袓袎覂觖觙觕訰訧訬訞谹谻豜豝豽貥赽赻赹趼跂趹趿跁軘軞軝軜軗軠軡逤逋逑逜逌逡郯郪郰郴郲郳郔郫郬郩酖酘酚酓酕釬釴釱釳釸釤釹釪"],["d840","釫釷釨釮镺閆閈陼陭陫陱陯隿靪頄飥馗傛傕傔傞傋傣傃傌傎傝偨傜傒傂傇兟凔匒匑厤厧喑喨喥喭啷噅喢喓喈喏喵喁喣喒喤啽喌喦啿喕喡喎圌堩堷"],["d8a1","堙堞堧堣堨埵塈堥堜堛堳堿堶堮堹堸堭堬堻奡媯媔媟婺媢媞婸媦婼媥媬媕媮娷媄媊媗媃媋媩婻婽媌媜媏媓媝寪寍寋寔寑寊寎尌尰崷嵃嵫嵁嵋崿崵嵑嵎嵕崳崺嵒崽崱嵙嵂崹嵉崸崼崲崶嵀嵅幄幁彘徦徥徫惉悹惌惢惎惄愔"],["d940","惲愊愖愅惵愓惸惼惾惁愃愘愝愐惿愄愋扊掔掱掰揎揥揨揯揃撝揳揊揠揶揕揲揵摡揟掾揝揜揄揘揓揂揇揌揋揈揰揗揙攲敧敪敤敜敨敥斌斝斞斮旐旒"],["d9a1","晼晬晻暀晱晹晪晲朁椌棓椄棜椪棬棪棱椏棖棷棫棤棶椓椐棳棡椇棌椈楰梴椑棯棆椔棸棐棽棼棨椋椊椗棎棈棝棞棦棴棑椆棔棩椕椥棇欹欻欿欼殔殗殙殕殽毰毲毳氰淼湆湇渟湉溈渼渽湅湢渫渿湁湝湳渜渳湋湀湑渻渃渮湞"],["da40","湨湜湡渱渨湠湱湫渹渢渰湓湥渧湸湤湷湕湹湒湦渵渶湚焠焞焯烻焮焱焣焥焢焲焟焨焺焛牋牚犈犉犆犅犋猒猋猰猢猱猳猧猲猭猦猣猵猌琮琬琰琫琖"],["daa1","琚琡琭琱琤琣琝琩琠琲瓻甯畯畬痧痚痡痦痝痟痤痗皕皒盚睆睇睄睍睅睊睎睋睌矞矬硠硤硥硜硭硱硪确硰硩硨硞硢祴祳祲祰稂稊稃稌稄窙竦竤筊笻筄筈筌筎筀筘筅粢粞粨粡絘絯絣絓絖絧絪絏絭絜絫絒絔絩絑絟絎缾缿罥"],["db40","罦羢羠羡翗聑聏聐胾胔腃腊腒腏腇脽腍脺臦臮臷臸臹舄舼舽舿艵茻菏菹萣菀菨萒菧菤菼菶萐菆菈菫菣莿萁菝菥菘菿菡菋菎菖菵菉萉萏菞萑萆菂菳"],["dba1","菕菺菇菑菪萓菃菬菮菄菻菗菢萛菛菾蛘蛢蛦蛓蛣蛚蛪蛝蛫蛜蛬蛩蛗蛨蛑衈衖衕袺裗袹袸裀袾袶袼袷袽袲褁裉覕覘覗觝觚觛詎詍訹詙詀詗詘詄詅詒詈詑詊詌詏豟貁貀貺貾貰貹貵趄趀趉跘跓跍跇跖跜跏跕跙跈跗跅軯軷軺"],["dc40","軹軦軮軥軵軧軨軶軫軱軬軴軩逭逴逯鄆鄬鄄郿郼鄈郹郻鄁鄀鄇鄅鄃酡酤酟酢酠鈁鈊鈥鈃鈚鈦鈏鈌鈀鈒釿釽鈆鈄鈧鈂鈜鈤鈙鈗鈅鈖镻閍閌閐隇陾隈"],["dca1","隉隃隀雂雈雃雱雰靬靰靮頇颩飫鳦黹亃亄亶傽傿僆傮僄僊傴僈僂傰僁傺傱僋僉傶傸凗剺剸剻剼嗃嗛嗌嗐嗋嗊嗝嗀嗔嗄嗩喿嗒喍嗏嗕嗢嗖嗈嗲嗍嗙嗂圔塓塨塤塏塍塉塯塕塎塝塙塥塛堽塣塱壼嫇嫄嫋媺媸媱媵媰媿嫈媻嫆"],["dd40","媷嫀嫊媴媶嫍媹媐寖寘寙尟尳嵱嵣嵊嵥嵲嵬嵞嵨嵧嵢巰幏幎幊幍幋廅廌廆廋廇彀徯徭惷慉慊愫慅愶愲愮慆愯慏愩慀戠酨戣戥戤揅揱揫搐搒搉搠搤"],["dda1","搳摃搟搕搘搹搷搢搣搌搦搰搨摁搵搯搊搚摀搥搧搋揧搛搮搡搎敯斒旓暆暌暕暐暋暊暙暔晸朠楦楟椸楎楢楱椿楅楪椹楂楗楙楺楈楉椵楬椳椽楥棰楸椴楩楀楯楄楶楘楁楴楌椻楋椷楜楏楑椲楒椯楻椼歆歅歃歂歈歁殛嗀毻毼"],["de40","毹毷毸溛滖滈溏滀溟溓溔溠溱溹滆滒溽滁溞滉溷溰滍溦滏溲溾滃滜滘溙溒溎溍溤溡溿溳滐滊溗溮溣煇煔煒煣煠煁煝煢煲煸煪煡煂煘煃煋煰煟煐煓"],["dea1","煄煍煚牏犍犌犑犐犎猼獂猻猺獀獊獉瑄瑊瑋瑒瑑瑗瑀瑏瑐瑎瑂瑆瑍瑔瓡瓿瓾瓽甝畹畷榃痯瘏瘃痷痾痼痹痸瘐痻痶痭痵痽皙皵盝睕睟睠睒睖睚睩睧睔睙睭矠碇碚碔碏碄碕碅碆碡碃硹碙碀碖硻祼禂祽祹稑稘稙稒稗稕稢稓"],["df40","稛稐窣窢窞竫筦筤筭筴筩筲筥筳筱筰筡筸筶筣粲粴粯綈綆綀綍絿綅絺綎絻綃絼綌綔綄絽綒罭罫罧罨罬羦羥羧翛翜耡腤腠腷腜腩腛腢腲朡腞腶腧腯"],["dfa1","腄腡舝艉艄艀艂艅蓱萿葖葶葹蒏蒍葥葑葀蒆葧萰葍葽葚葙葴葳葝蔇葞萷萺萴葺葃葸萲葅萩菙葋萯葂萭葟葰萹葎葌葒葯蓅蒎萻葇萶萳葨葾葄萫葠葔葮葐蜋蜄蛷蜌蛺蛖蛵蝍蛸蜎蜉蜁蛶蜍蜅裖裋裍裎裞裛裚裌裐覅覛觟觥觤"],["e040","觡觠觢觜触詶誆詿詡訿詷誂誄詵誃誁詴詺谼豋豊豥豤豦貆貄貅賌赨赩趑趌趎趏趍趓趔趐趒跰跠跬跱跮跐跩跣跢跧跲跫跴輆軿輁輀輅輇輈輂輋遒逿"],["e0a1","遄遉逽鄐鄍鄏鄑鄖鄔鄋鄎酮酯鉈鉒鈰鈺鉦鈳鉥鉞銃鈮鉊鉆鉭鉬鉏鉠鉧鉯鈶鉡鉰鈱鉔鉣鉐鉲鉎鉓鉌鉖鈲閟閜閞閛隒隓隑隗雎雺雽雸雵靳靷靸靲頏頍頎颬飶飹馯馲馰馵骭骫魛鳪鳭鳧麀黽僦僔僗僨僳僛僪僝僤僓僬僰僯僣僠"],["e140","凘劀劁勩勫匰厬嘧嘕嘌嘒嗼嘏嘜嘁嘓嘂嗺嘝嘄嗿嗹墉塼墐墘墆墁塿塴墋塺墇墑墎塶墂墈塻墔墏壾奫嫜嫮嫥嫕嫪嫚嫭嫫嫳嫢嫠嫛嫬嫞嫝嫙嫨嫟孷寠"],["e1a1","寣屣嶂嶀嵽嶆嵺嶁嵷嶊嶉嶈嵾嵼嶍嵹嵿幘幙幓廘廑廗廎廜廕廙廒廔彄彃彯徶愬愨慁慞慱慳慒慓慲慬憀慴慔慺慛慥愻慪慡慖戩戧戫搫摍摛摝摴摶摲摳摽摵摦撦摎撂摞摜摋摓摠摐摿搿摬摫摙摥摷敳斠暡暠暟朅朄朢榱榶槉"],["e240","榠槎榖榰榬榼榑榙榎榧榍榩榾榯榿槄榽榤槔榹槊榚槏榳榓榪榡榞槙榗榐槂榵榥槆歊歍歋殞殟殠毃毄毾滎滵滱漃漥滸漷滻漮漉潎漙漚漧漘漻漒滭漊"],["e2a1","漶潳滹滮漭潀漰漼漵滫漇漎潃漅滽滶漹漜滼漺漟漍漞漈漡熇熐熉熀熅熂熏煻熆熁熗牄牓犗犕犓獃獍獑獌瑢瑳瑱瑵瑲瑧瑮甀甂甃畽疐瘖瘈瘌瘕瘑瘊瘔皸瞁睼瞅瞂睮瞀睯睾瞃碲碪碴碭碨硾碫碞碥碠碬碢碤禘禊禋禖禕禔禓"],["e340","禗禈禒禐稫穊稰稯稨稦窨窫窬竮箈箜箊箑箐箖箍箌箛箎箅箘劄箙箤箂粻粿粼粺綧綷緂綣綪緁緀緅綝緎緄緆緋緌綯綹綖綼綟綦綮綩綡緉罳翢翣翥翞"],["e3a1","耤聝聜膉膆膃膇膍膌膋舕蒗蒤蒡蒟蒺蓎蓂蒬蒮蒫蒹蒴蓁蓍蒪蒚蒱蓐蒝蒧蒻蒢蒔蓇蓌蒛蒩蒯蒨蓖蒘蒶蓏蒠蓗蓔蓒蓛蒰蒑虡蜳蜣蜨蝫蝀蜮蜞蜡蜙蜛蝃蜬蝁蜾蝆蜠蜲蜪蜭蜼蜒蜺蜱蜵蝂蜦蜧蜸蜤蜚蜰蜑裷裧裱裲裺裾裮裼裶裻"],["e440","裰裬裫覝覡覟覞觩觫觨誫誙誋誒誏誖谽豨豩賕賏賗趖踉踂跿踍跽踊踃踇踆踅跾踀踄輐輑輎輍鄣鄜鄠鄢鄟鄝鄚鄤鄡鄛酺酲酹酳銥銤鉶銛鉺銠銔銪銍"],["e4a1","銦銚銫鉹銗鉿銣鋮銎銂銕銢鉽銈銡銊銆銌銙銧鉾銇銩銝銋鈭隞隡雿靘靽靺靾鞃鞀鞂靻鞄鞁靿韎韍頖颭颮餂餀餇馝馜駃馹馻馺駂馽駇骱髣髧鬾鬿魠魡魟鳱鳲鳵麧僿儃儰僸儆儇僶僾儋儌僽儊劋劌勱勯噈噂噌嘵噁噊噉噆噘"],["e540","噚噀嘳嘽嘬嘾嘸嘪嘺圚墫墝墱墠墣墯墬墥墡壿嫿嫴嫽嫷嫶嬃嫸嬂嫹嬁嬇嬅嬏屧嶙嶗嶟嶒嶢嶓嶕嶠嶜嶡嶚嶞幩幝幠幜緳廛廞廡彉徲憋憃慹憱憰憢憉"],["e5a1","憛憓憯憭憟憒憪憡憍慦憳戭摮摰撖撠撅撗撜撏撋撊撌撣撟摨撱撘敶敺敹敻斲斳暵暰暩暲暷暪暯樀樆樗槥槸樕槱槤樠槿槬槢樛樝槾樧槲槮樔槷槧橀樈槦槻樍槼槫樉樄樘樥樏槶樦樇槴樖歑殥殣殢殦氁氀毿氂潁漦潾澇濆澒"],["e640","澍澉澌潢潏澅潚澖潶潬澂潕潲潒潐潗澔澓潝漀潡潫潽潧澐潓澋潩潿澕潣潷潪潻熲熯熛熰熠熚熩熵熝熥熞熤熡熪熜熧熳犘犚獘獒獞獟獠獝獛獡獚獙"],["e6a1","獢璇璉璊璆璁瑽璅璈瑼瑹甈甇畾瘥瘞瘙瘝瘜瘣瘚瘨瘛皜皝皞皛瞍瞏瞉瞈磍碻磏磌磑磎磔磈磃磄磉禚禡禠禜禢禛歶稹窲窴窳箷篋箾箬篎箯箹篊箵糅糈糌糋緷緛緪緧緗緡縃緺緦緶緱緰緮緟罶羬羰羭翭翫翪翬翦翨聤聧膣膟"],["e740","膞膕膢膙膗舖艏艓艒艐艎艑蔤蔻蔏蔀蔩蔎蔉蔍蔟蔊蔧蔜蓻蔫蓺蔈蔌蓴蔪蓲蔕蓷蓫蓳蓼蔒蓪蓩蔖蓾蔨蔝蔮蔂蓽蔞蓶蔱蔦蓧蓨蓰蓯蓹蔘蔠蔰蔋蔙蔯虢"],["e7a1","蝖蝣蝤蝷蟡蝳蝘蝔蝛蝒蝡蝚蝑蝞蝭蝪蝐蝎蝟蝝蝯蝬蝺蝮蝜蝥蝏蝻蝵蝢蝧蝩衚褅褌褔褋褗褘褙褆褖褑褎褉覢覤覣觭觰觬諏諆誸諓諑諔諕誻諗誾諀諅諘諃誺誽諙谾豍貏賥賟賙賨賚賝賧趠趜趡趛踠踣踥踤踮踕踛踖踑踙踦踧"],["e840","踔踒踘踓踜踗踚輬輤輘輚輠輣輖輗遳遰遯遧遫鄯鄫鄩鄪鄲鄦鄮醅醆醊醁醂醄醀鋐鋃鋄鋀鋙銶鋏鋱鋟鋘鋩鋗鋝鋌鋯鋂鋨鋊鋈鋎鋦鋍鋕鋉鋠鋞鋧鋑鋓"],["e8a1","銵鋡鋆銴镼閬閫閮閰隤隢雓霅霈霂靚鞊鞎鞈韐韏頞頝頦頩頨頠頛頧颲餈飺餑餔餖餗餕駜駍駏駓駔駎駉駖駘駋駗駌骳髬髫髳髲髱魆魃魧魴魱魦魶魵魰魨魤魬鳼鳺鳽鳿鳷鴇鴀鳹鳻鴈鴅鴄麃黓鼏鼐儜儓儗儚儑凞匴叡噰噠噮"],["e940","噳噦噣噭噲噞噷圜圛壈墽壉墿墺壂墼壆嬗嬙嬛嬡嬔嬓嬐嬖嬨嬚嬠嬞寯嶬嶱嶩嶧嶵嶰嶮嶪嶨嶲嶭嶯嶴幧幨幦幯廩廧廦廨廥彋徼憝憨憖懅憴懆懁懌憺"],["e9a1","憿憸憌擗擖擐擏擉撽撉擃擛擳擙攳敿敼斢曈暾曀曊曋曏暽暻暺曌朣樴橦橉橧樲橨樾橝橭橶橛橑樨橚樻樿橁橪橤橐橏橔橯橩橠樼橞橖橕橍橎橆歕歔歖殧殪殫毈毇氄氃氆澭濋澣濇澼濎濈潞濄澽澞濊澨瀄澥澮澺澬澪濏澿澸"],["ea40","澢濉澫濍澯澲澰燅燂熿熸燖燀燁燋燔燊燇燏熽燘熼燆燚燛犝犞獩獦獧獬獥獫獪瑿璚璠璔璒璕璡甋疀瘯瘭瘱瘽瘳瘼瘵瘲瘰皻盦瞚瞝瞡瞜瞛瞢瞣瞕瞙"],["eaa1","瞗磝磩磥磪磞磣磛磡磢磭磟磠禤穄穈穇窶窸窵窱窷篞篣篧篝篕篥篚篨篹篔篪篢篜篫篘篟糒糔糗糐糑縒縡縗縌縟縠縓縎縜縕縚縢縋縏縖縍縔縥縤罃罻罼罺羱翯耪耩聬膱膦膮膹膵膫膰膬膴膲膷膧臲艕艖艗蕖蕅蕫蕍蕓蕡蕘"],["eb40","蕀蕆蕤蕁蕢蕄蕑蕇蕣蔾蕛蕱蕎蕮蕵蕕蕧蕠薌蕦蕝蕔蕥蕬虣虥虤螛螏螗螓螒螈螁螖螘蝹螇螣螅螐螑螝螄螔螜螚螉褞褦褰褭褮褧褱褢褩褣褯褬褟觱諠"],["eba1","諢諲諴諵諝謔諤諟諰諈諞諡諨諿諯諻貑貒貐賵賮賱賰賳赬赮趥趧踳踾踸蹀蹅踶踼踽蹁踰踿躽輶輮輵輲輹輷輴遶遹遻邆郺鄳鄵鄶醓醐醑醍醏錧錞錈錟錆錏鍺錸錼錛錣錒錁鍆錭錎錍鋋錝鋺錥錓鋹鋷錴錂錤鋿錩錹錵錪錔錌"],["ec40","錋鋾錉錀鋻錖閼闍閾閹閺閶閿閵閽隩雔霋霒霐鞙鞗鞔韰韸頵頯頲餤餟餧餩馞駮駬駥駤駰駣駪駩駧骹骿骴骻髶髺髹髷鬳鮀鮅鮇魼魾魻鮂鮓鮒鮐魺鮕"],["eca1","魽鮈鴥鴗鴠鴞鴔鴩鴝鴘鴢鴐鴙鴟麈麆麇麮麭黕黖黺鼒鼽儦儥儢儤儠儩勴嚓嚌嚍嚆嚄嚃噾嚂噿嚁壖壔壏壒嬭嬥嬲嬣嬬嬧嬦嬯嬮孻寱寲嶷幬幪徾徻懃憵憼懧懠懥懤懨懞擯擩擣擫擤擨斁斀斶旚曒檍檖檁檥檉檟檛檡檞檇檓檎"],["ed40","檕檃檨檤檑橿檦檚檅檌檒歛殭氉濌澩濴濔濣濜濭濧濦濞濲濝濢濨燡燱燨燲燤燰燢獳獮獯璗璲璫璐璪璭璱璥璯甐甑甒甏疄癃癈癉癇皤盩瞵瞫瞲瞷瞶"],["eda1","瞴瞱瞨矰磳磽礂磻磼磲礅磹磾礄禫禨穜穛穖穘穔穚窾竀竁簅簏篲簀篿篻簎篴簋篳簂簉簃簁篸篽簆篰篱簐簊糨縭縼繂縳顈縸縪繉繀繇縩繌縰縻縶繄縺罅罿罾罽翴翲耬膻臄臌臊臅臇膼臩艛艚艜薃薀薏薧薕薠薋薣蕻薤薚薞"],["ee40","蕷蕼薉薡蕺蕸蕗薎薖薆薍薙薝薁薢薂薈薅蕹蕶薘薐薟虨螾螪螭蟅螰螬螹螵螼螮蟉蟃蟂蟌螷螯蟄蟊螴螶螿螸螽蟞螲褵褳褼褾襁襒褷襂覭覯覮觲觳謞"],["eea1","謘謖謑謅謋謢謏謒謕謇謍謈謆謜謓謚豏豰豲豱豯貕貔賹赯蹎蹍蹓蹐蹌蹇轃轀邅遾鄸醚醢醛醙醟醡醝醠鎡鎃鎯鍤鍖鍇鍼鍘鍜鍶鍉鍐鍑鍠鍭鎏鍌鍪鍹鍗鍕鍒鍏鍱鍷鍻鍡鍞鍣鍧鎀鍎鍙闇闀闉闃闅閷隮隰隬霠霟霘霝霙鞚鞡鞜"],["ef40","鞞鞝韕韔韱顁顄顊顉顅顃餥餫餬餪餳餲餯餭餱餰馘馣馡騂駺駴駷駹駸駶駻駽駾駼騃骾髾髽鬁髼魈鮚鮨鮞鮛鮦鮡鮥鮤鮆鮢鮠鮯鴳鵁鵧鴶鴮鴯鴱鴸鴰"],["efa1","鵅鵂鵃鴾鴷鵀鴽翵鴭麊麉麍麰黈黚黻黿鼤鼣鼢齔龠儱儭儮嚘嚜嚗嚚嚝嚙奰嬼屩屪巀幭幮懘懟懭懮懱懪懰懫懖懩擿攄擽擸攁攃擼斔旛曚曛曘櫅檹檽櫡櫆檺檶檷櫇檴檭歞毉氋瀇瀌瀍瀁瀅瀔瀎濿瀀濻瀦濼濷瀊爁燿燹爃燽獶"],["f040","璸瓀璵瓁璾璶璻瓂甔甓癜癤癙癐癓癗癚皦皽盬矂瞺磿礌礓礔礉礐礒礑禭禬穟簜簩簙簠簟簭簝簦簨簢簥簰繜繐繖繣繘繢繟繑繠繗繓羵羳翷翸聵臑臒"],["f0a1","臐艟艞薴藆藀藃藂薳薵薽藇藄薿藋藎藈藅薱薶藒蘤薸薷薾虩蟧蟦蟢蟛蟫蟪蟥蟟蟳蟤蟔蟜蟓蟭蟘蟣螤蟗蟙蠁蟴蟨蟝襓襋襏襌襆襐襑襉謪謧謣謳謰謵譇謯謼謾謱謥謷謦謶謮謤謻謽謺豂豵貙貘貗賾贄贂贀蹜蹢蹠蹗蹖蹞蹥蹧"],["f140","蹛蹚蹡蹝蹩蹔轆轇轈轋鄨鄺鄻鄾醨醥醧醯醪鎵鎌鎒鎷鎛鎝鎉鎧鎎鎪鎞鎦鎕鎈鎙鎟鎍鎱鎑鎲鎤鎨鎴鎣鎥闒闓闑隳雗雚巂雟雘雝霣霢霥鞬鞮鞨鞫鞤鞪"],["f1a1","鞢鞥韗韙韖韘韺顐顑顒颸饁餼餺騏騋騉騍騄騑騊騅騇騆髀髜鬈鬄鬅鬩鬵魊魌魋鯇鯆鯃鮿鯁鮵鮸鯓鮶鯄鮹鮽鵜鵓鵏鵊鵛鵋鵙鵖鵌鵗鵒鵔鵟鵘鵚麎麌黟鼁鼀鼖鼥鼫鼪鼩鼨齌齕儴儵劖勷厴嚫嚭嚦嚧嚪嚬壚壝壛夒嬽嬾嬿巃幰"],["f240","徿懻攇攐攍攉攌攎斄旞旝曞櫧櫠櫌櫑櫙櫋櫟櫜櫐櫫櫏櫍櫞歠殰氌瀙瀧瀠瀖瀫瀡瀢瀣瀩瀗瀤瀜瀪爌爊爇爂爅犥犦犤犣犡瓋瓅璷瓃甖癠矉矊矄矱礝礛"],["f2a1","礡礜礗礞禰穧穨簳簼簹簬簻糬糪繶繵繸繰繷繯繺繲繴繨罋罊羃羆羷翽翾聸臗臕艤艡艣藫藱藭藙藡藨藚藗藬藲藸藘藟藣藜藑藰藦藯藞藢蠀蟺蠃蟶蟷蠉蠌蠋蠆蟼蠈蟿蠊蠂襢襚襛襗襡襜襘襝襙覈覷覶觶譐譈譊譀譓譖譔譋譕"],["f340","譑譂譒譗豃豷豶貚贆贇贉趬趪趭趫蹭蹸蹳蹪蹯蹻軂轒轑轏轐轓辴酀鄿醰醭鏞鏇鏏鏂鏚鏐鏹鏬鏌鏙鎩鏦鏊鏔鏮鏣鏕鏄鏎鏀鏒鏧镽闚闛雡霩霫霬霨霦"],["f3a1","鞳鞷鞶韝韞韟顜顙顝顗颿颽颻颾饈饇饃馦馧騚騕騥騝騤騛騢騠騧騣騞騜騔髂鬋鬊鬎鬌鬷鯪鯫鯠鯞鯤鯦鯢鯰鯔鯗鯬鯜鯙鯥鯕鯡鯚鵷鶁鶊鶄鶈鵱鶀鵸鶆鶋鶌鵽鵫鵴鵵鵰鵩鶅鵳鵻鶂鵯鵹鵿鶇鵨麔麑黀黼鼭齀齁齍齖齗齘匷嚲"],["f440","嚵嚳壣孅巆巇廮廯忀忁懹攗攖攕攓旟曨曣曤櫳櫰櫪櫨櫹櫱櫮櫯瀼瀵瀯瀷瀴瀱灂瀸瀿瀺瀹灀瀻瀳灁爓爔犨獽獼璺皫皪皾盭矌矎矏矍矲礥礣礧礨礤礩"],["f4a1","禲穮穬穭竷籉籈籊籇籅糮繻繾纁纀羺翿聹臛臙舋艨艩蘢藿蘁藾蘛蘀藶蘄蘉蘅蘌藽蠙蠐蠑蠗蠓蠖襣襦覹觷譠譪譝譨譣譥譧譭趮躆躈躄轙轖轗轕轘轚邍酃酁醷醵醲醳鐋鐓鏻鐠鐏鐔鏾鐕鐐鐨鐙鐍鏵鐀鏷鐇鐎鐖鐒鏺鐉鏸鐊鏿"],["f540","鏼鐌鏶鐑鐆闞闠闟霮霯鞹鞻韽韾顠顢顣顟飁飂饐饎饙饌饋饓騲騴騱騬騪騶騩騮騸騭髇髊髆鬐鬒鬑鰋鰈鯷鰅鰒鯸鱀鰇鰎鰆鰗鰔鰉鶟鶙鶤鶝鶒鶘鶐鶛"],["f5a1","鶠鶔鶜鶪鶗鶡鶚鶢鶨鶞鶣鶿鶩鶖鶦鶧麙麛麚黥黤黧黦鼰鼮齛齠齞齝齙龑儺儹劘劗囃嚽嚾孈孇巋巏廱懽攛欂櫼欃櫸欀灃灄灊灈灉灅灆爝爚爙獾甗癪矐礭礱礯籔籓糲纊纇纈纋纆纍罍羻耰臝蘘蘪蘦蘟蘣蘜蘙蘧蘮蘡蘠蘩蘞蘥"],["f640","蠩蠝蠛蠠蠤蠜蠫衊襭襩襮襫觺譹譸譅譺譻贐贔趯躎躌轞轛轝酆酄酅醹鐿鐻鐶鐩鐽鐼鐰鐹鐪鐷鐬鑀鐱闥闤闣霵霺鞿韡顤飉飆飀饘饖騹騽驆驄驂驁騺"],["f6a1","騿髍鬕鬗鬘鬖鬺魒鰫鰝鰜鰬鰣鰨鰩鰤鰡鶷鶶鶼鷁鷇鷊鷏鶾鷅鷃鶻鶵鷎鶹鶺鶬鷈鶱鶭鷌鶳鷍鶲鹺麜黫黮黭鼛鼘鼚鼱齎齥齤龒亹囆囅囋奱孋孌巕巑廲攡攠攦攢欋欈欉氍灕灖灗灒爞爟犩獿瓘瓕瓙瓗癭皭礵禴穰穱籗籜籙籛籚"],["f740","糴糱纑罏羇臞艫蘴蘵蘳蘬蘲蘶蠬蠨蠦蠪蠥襱覿覾觻譾讄讂讆讅譿贕躕躔躚躒躐躖躗轠轢酇鑌鑐鑊鑋鑏鑇鑅鑈鑉鑆霿韣顪顩飋饔饛驎驓驔驌驏驈驊"],["f7a1","驉驒驐髐鬙鬫鬻魖魕鱆鱈鰿鱄鰹鰳鱁鰼鰷鰴鰲鰽鰶鷛鷒鷞鷚鷋鷐鷜鷑鷟鷩鷙鷘鷖鷵鷕鷝麶黰鼵鼳鼲齂齫龕龢儽劙壨壧奲孍巘蠯彏戁戃戄攩攥斖曫欑欒欏毊灛灚爢玂玁玃癰矔籧籦纕艬蘺虀蘹蘼蘱蘻蘾蠰蠲蠮蠳襶襴襳觾"],["f840","讌讎讋讈豅贙躘轤轣醼鑢鑕鑝鑗鑞韄韅頀驖驙鬞鬟鬠鱒鱘鱐鱊鱍鱋鱕鱙鱌鱎鷻鷷鷯鷣鷫鷸鷤鷶鷡鷮鷦鷲鷰鷢鷬鷴鷳鷨鷭黂黐黲黳鼆鼜鼸鼷鼶齃齏"],["f8a1","齱齰齮齯囓囍孎屭攭曭曮欓灟灡灝灠爣瓛瓥矕礸禷禶籪纗羉艭虃蠸蠷蠵衋讔讕躞躟躠躝醾醽釂鑫鑨鑩雥靆靃靇韇韥驞髕魙鱣鱧鱦鱢鱞鱠鸂鷾鸇鸃鸆鸅鸀鸁鸉鷿鷽鸄麠鼞齆齴齵齶囔攮斸欘欙欗欚灢爦犪矘矙礹籩籫糶纚"],["f940","纘纛纙臠臡虆虇虈襹襺襼襻觿讘讙躥躤躣鑮鑭鑯鑱鑳靉顲饟鱨鱮鱭鸋鸍鸐鸏鸒鸑麡黵鼉齇齸齻齺齹圞灦籯蠼趲躦釃鑴鑸鑶鑵驠鱴鱳鱱鱵鸔鸓黶鼊"],["f9a1","龤灨灥糷虪蠾蠽蠿讞貜躩軉靋顳顴飌饡馫驤驦驧鬤鸕鸗齈戇欞爧虌躨钂钀钁驩驨鬮鸙爩虋讟钃鱹麷癵驫鱺鸝灩灪麤齾齉龘碁銹裏墻恒粧嫺╔╦╗╠╬╣╚╩╝╒╤╕╞╪╡╘╧╛╓╥╖╟╫╢╙╨╜║═╭╮╰╯▓"]]');
const require$$7 = [
  [
    "8740",
    "䏰䰲䘃䖦䕸𧉧䵷䖳𧲱䳢𧳅㮕䜶䝄䱇䱀𤊿𣘗𧍒𦺋𧃒䱗𪍑䝏䗚䲅𧱬䴇䪤䚡𦬣爥𥩔𡩣𣸆𣽡晍囻"
  ],
  [
    "8767",
    "綕夝𨮹㷴霴𧯯寛𡵞媤㘥𩺰嫑宷峼杮薓𩥅瑡璝㡵𡵓𣚞𦀡㻬"
  ],
  [
    "87a1",
    "𥣞㫵竼龗𤅡𨤍𣇪𠪊𣉞䌊蒄龖鐯䤰蘓墖靊鈘秐稲晠権袝瑌篅枂稬剏遆㓦珄𥶹瓆鿇垳䤯呌䄱𣚎堘穲𧭥讏䚮𦺈䆁𥶙箮𢒼鿈𢓁𢓉𢓌鿉蔄𣖻䂴鿊䓡𪷿拁灮鿋"
  ],
  [
    "8840",
    "㇀",
    4,
    "𠄌㇅𠃑𠃍㇆㇇𠃋𡿨㇈𠃊㇉㇊㇋㇌𠄎㇍㇎ĀÁǍÀĒÉĚÈŌÓǑÒ࿿Ê̄Ế࿿Ê̌ỀÊāáǎàɑēéěèīíǐìōóǒòūúǔùǖǘǚ"
  ],
  [
    "88a1",
    "ǜü࿿ê̄ế࿿ê̌ềêɡ⏚⏛"
  ],
  [
    "8940",
    "𪎩𡅅"
  ],
  [
    "8943",
    "攊"
  ],
  [
    "8946",
    "丽滝鵎釟"
  ],
  [
    "894c",
    "𧜵撑会伨侨兖兴农凤务动医华发变团声处备夲头学实実岚庆总斉柾栄桥济炼电纤纬纺织经统缆缷艺苏药视设询车轧轮"
  ],
  [
    "89a1",
    "琑糼緍楆竉刧"
  ],
  [
    "89ab",
    "醌碸酞肼"
  ],
  [
    "89b0",
    "贋胶𠧧"
  ],
  [
    "89b5",
    "肟黇䳍鷉鸌䰾𩷶𧀎鸊𪄳㗁"
  ],
  [
    "89c1",
    "溚舾甙"
  ],
  [
    "89c5",
    "䤑马骏龙禇𨑬𡷊𠗐𢫦两亁亀亇亿仫伷㑌侽㹈倃傈㑽㒓㒥円夅凛凼刅争剹劐匧㗇厩㕑厰㕓参吣㕭㕲㚁咓咣咴咹哐哯唘唣唨㖘唿㖥㖿嗗㗅"
  ],
  [
    "8a40",
    "𧶄唥"
  ],
  [
    "8a43",
    "𠱂𠴕𥄫喐𢳆㧬𠍁蹆𤶸𩓥䁓𨂾睺𢰸㨴䟕𨅝𦧲𤷪擝𠵼𠾴𠳕𡃴撍蹾𠺖𠰋𠽤𢲩𨉖𤓓"
  ],
  [
    "8a64",
    "𠵆𩩍𨃩䟴𤺧𢳂骲㩧𩗴㿭㔆𥋇𩟔𧣈𢵄鵮頕"
  ],
  [
    "8a76",
    "䏙𦂥撴哣𢵌𢯊𡁷㧻𡁯"
  ],
  [
    "8aa1",
    "𦛚𦜖𧦠擪𥁒𠱃蹨𢆡𨭌𠜱"
  ],
  [
    "8aac",
    "䠋𠆩㿺塳𢶍"
  ],
  [
    "8ab2",
    "𤗈𠓼𦂗𠽌𠶖啹䂻䎺"
  ],
  [
    "8abb",
    "䪴𢩦𡂝膪飵𠶜捹㧾𢝵跀嚡摼㹃"
  ],
  [
    "8ac9",
    "𪘁𠸉𢫏𢳉"
  ],
  [
    "8ace",
    "𡃈𣧂㦒㨆𨊛㕸𥹉𢃇噒𠼱𢲲𩜠㒼氽𤸻"
  ],
  [
    "8adf",
    "𧕴𢺋𢈈𪙛𨳍𠹺𠰴𦠜羓𡃏𢠃𢤹㗻𥇣𠺌𠾍𠺪㾓𠼰𠵇𡅏𠹌"
  ],
  [
    "8af6",
    "𠺫𠮩𠵈𡃀𡄽㿹𢚖搲𠾭"
  ],
  [
    "8b40",
    "𣏴𧘹𢯎𠵾𠵿𢱑𢱕㨘𠺘𡃇𠼮𪘲𦭐𨳒𨶙𨳊閪哌苄喹"
  ],
  [
    "8b55",
    "𩻃鰦骶𧝞𢷮煀腭胬尜𦕲脴㞗卟𨂽醶𠻺𠸏𠹷𠻻㗝𤷫㘉𠳖嚯𢞵𡃉𠸐𠹸𡁸𡅈𨈇𡑕𠹹𤹐𢶤婔𡀝𡀞𡃵𡃶垜𠸑"
  ],
  [
    "8ba1",
    "𧚔𨋍𠾵𠹻𥅾㜃𠾶𡆀𥋘𪊽𤧚𡠺𤅷𨉼墙剨㘚𥜽箲孨䠀䬬鼧䧧鰟鮍𥭴𣄽嗻㗲嚉丨夂𡯁屮靑𠂆乛亻㔾尣彑忄㣺扌攵歺氵氺灬爫丬犭𤣩罒礻糹罓𦉪㓁"
  ],
  [
    "8bde",
    "𦍋耂肀𦘒𦥑卝衤见𧢲讠贝钅镸长门𨸏韦页风飞饣𩠐鱼鸟黄歯龜丷𠂇阝户钢"
  ],
  [
    "8c40",
    "倻淾𩱳龦㷉袏𤅎灷峵䬠𥇍㕙𥴰愢𨨲辧釶熑朙玺𣊁𪄇㲋𡦀䬐磤琂冮𨜏䀉橣𪊺䈣蘏𠩯稪𩥇𨫪靕灍匤𢁾鏴盙𨧣龧矝亣俰傼丯众龨吴綋墒壐𡶶庒庙忂𢜒斋"
  ],
  [
    "8ca1",
    "𣏹椙橃𣱣泿"
  ],
  [
    "8ca7",
    "爀𤔅玌㻛𤨓嬕璹讃𥲤𥚕窓篬糃繬苸薗龩袐龪躹龫迏蕟駠鈡龬𨶹𡐿䁱䊢娚"
  ],
  [
    "8cc9",
    "顨杫䉶圽"
  ],
  [
    "8cce",
    "藖𤥻芿𧄍䲁𦵴嵻𦬕𦾾龭龮宖龯曧繛湗秊㶈䓃𣉖𢞖䎚䔶"
  ],
  [
    "8ce6",
    "峕𣬚諹屸㴒𣕑嵸龲煗䕘𤃬𡸣䱷㥸㑊𠆤𦱁諌侴𠈹妿腬顖𩣺弻"
  ],
  [
    "8d40",
    "𠮟"
  ],
  [
    "8d42",
    "𢇁𨥭䄂䚻𩁹㼇龳𪆵䃸㟖䛷𦱆䅼𨚲𧏿䕭㣔𥒚䕡䔛䶉䱻䵶䗪㿈𤬏㙡䓞䒽䇭崾嵈嵖㷼㠏嶤嶹㠠㠸幂庽弥徃㤈㤔㤿㥍惗愽峥㦉憷憹懏㦸戬抐拥挘㧸嚱"
  ],
  [
    "8da1",
    "㨃揢揻搇摚㩋擀崕嘡龟㪗斆㪽旿晓㫲暒㬢朖㭂枤栀㭘桊梄㭲㭱㭻椉楃牜楤榟榅㮼槖㯝橥橴橱檂㯬檙㯲檫檵櫔櫶殁毁毪汵沪㳋洂洆洦涁㳯涤涱渕渘温溆𨧀溻滢滚齿滨滩漤漴㵆𣽁澁澾㵪㵵熷岙㶊瀬㶑灐灔灯灿炉𠌥䏁㗱𠻘"
  ],
  [
    "8e40",
    "𣻗垾𦻓焾𥟠㙎榢𨯩孴穉𥣡𩓙穥穽𥦬窻窰竂竃燑𦒍䇊竚竝竪䇯咲𥰁笋筕笩𥌎𥳾箢筯莜𥮴𦱿篐萡箒箸𥴠㶭𥱥蒒篺簆簵𥳁籄粃𤢂粦晽𤕸糉糇糦籴糳糵糎"
  ],
  [
    "8ea1",
    "繧䔝𦹄絝𦻖璍綉綫焵綳緒𤁗𦀩緤㴓緵𡟹緥𨍭縝𦄡𦅚繮纒䌫鑬縧罀罁罇礶𦋐駡羗𦍑羣𡙡𠁨䕜𣝦䔃𨌺翺𦒉者耈耝耨耯𪂇𦳃耻耼聡𢜔䦉𦘦𣷣𦛨朥肧𨩈脇脚墰𢛶汿𦒘𤾸擧𡒊舘𡡞橓𤩥𤪕䑺舩𠬍𦩒𣵾俹𡓽蓢荢𦬊𤦧𣔰𡝳𣷸芪椛芳䇛"
  ],
  [
    "8f40",
    "蕋苐茚𠸖𡞴㛁𣅽𣕚艻苢茘𣺋𦶣𦬅𦮗𣗎㶿茝嗬莅䔋𦶥莬菁菓㑾𦻔橗蕚㒖𦹂𢻯葘𥯤葱㷓䓤檧葊𣲵祘蒨𦮖𦹷𦹃蓞萏莑䒠蒓蓤𥲑䉀𥳀䕃蔴嫲𦺙䔧蕳䔖枿蘖"
  ],
  [
    "8fa1",
    "𨘥𨘻藁𧂈蘂𡖂𧃍䕫䕪蘨㙈𡢢号𧎚虾蝱𪃸蟮𢰧螱蟚蠏噡虬桖䘏衅衆𧗠𣶹𧗤衞袜䙛袴袵揁装睷𧜏覇覊覦覩覧覼𨨥觧𧤤𧪽誜瞓釾誐𧩙竩𧬺𣾏䜓𧬸煼謌謟𥐰𥕥謿譌譍誩𤩺讐讛誯𡛟䘕衏貛𧵔𧶏貫㜥𧵓賖𧶘𧶽贒贃𡤐賛灜贑𤳉㻐起"
  ],
  [
    "9040",
    "趩𨀂𡀔𤦊㭼𨆼𧄌竧躭躶軃鋔輙輭𨍥𨐒辥錃𪊟𠩐辳䤪𨧞𨔽𣶻廸𣉢迹𪀔𨚼𨔁𢌥㦀𦻗逷𨔼𧪾遡𨕬𨘋邨𨜓郄𨛦邮都酧㫰醩釄粬𨤳𡺉鈎沟鉁鉢𥖹銹𨫆𣲛𨬌𥗛"
  ],
  [
    "90a1",
    "𠴱錬鍫𨫡𨯫炏嫃𨫢𨫥䥥鉄𨯬𨰹𨯿鍳鑛躼閅閦鐦閠濶䊹𢙺𨛘𡉼𣸮䧟氜陻隖䅬隣𦻕懚隶磵𨫠隽双䦡𦲸𠉴𦐐𩂯𩃥𤫑𡤕𣌊霱虂霶䨏䔽䖅𤫩灵孁霛靜𩇕靗孊𩇫靟鐥僐𣂷𣂼鞉鞟鞱鞾韀韒韠𥑬韮琜𩐳響韵𩐝𧥺䫑頴頳顋顦㬎𧅵㵑𠘰𤅜"
  ],
  [
    "9140",
    "𥜆飊颷飈飇䫿𦴧𡛓喰飡飦飬鍸餹𤨩䭲𩡗𩤅駵騌騻騐驘𥜥㛄𩂱𩯕髠髢𩬅髴䰎鬔鬭𨘀倴鬴𦦨㣃𣁽魐魀𩴾婅𡡣鮎𤉋鰂鯿鰌𩹨鷔𩾷𪆒𪆫𪃡𪄣𪇟鵾鶃𪄴鸎梈"
  ],
  [
    "91a1",
    "鷄𢅛𪆓𪈠𡤻𪈳鴹𪂹𪊴麐麕麞麢䴴麪麯𤍤黁㭠㧥㴝伲㞾𨰫鼂鼈䮖鐤𦶢鼗鼖鼹嚟嚊齅馸𩂋韲葿齢齩竜龎爖䮾𤥵𤦻煷𤧸𤍈𤩑玞𨯚𡣺禟𨥾𨸶鍩鏳𨩄鋬鎁鏋𨥬𤒹爗㻫睲穃烐𤑳𤏸煾𡟯炣𡢾𣖙㻇𡢅𥐯𡟸㜢𡛻𡠹㛡𡝴𡣑𥽋㜣𡛀坛𤨥𡏾𡊨"
  ],
  [
    "9240",
    "𡏆𡒶蔃𣚦蔃葕𤦔𧅥𣸱𥕜𣻻𧁒䓴𣛮𩦝𦼦柹㜳㰕㷧塬𡤢栐䁗𣜿𤃡𤂋𤄏𦰡哋嚞𦚱嚒𠿟𠮨𠸍鏆𨬓鎜仸儫㠙𤐶亼𠑥𠍿佋侊𥙑婨𠆫𠏋㦙𠌊𠐔㐵伩𠋀𨺳𠉵諚𠈌亘"
  ],
  [
    "92a1",
    "働儍侢伃𤨎𣺊佂倮偬傁俌俥偘僼兙兛兝兞湶𣖕𣸹𣺿浲𡢄𣺉冨凃𠗠䓝𠒣𠒒𠒑赺𨪜𠜎剙劤𠡳勡鍮䙺熌𤎌𠰠𤦬𡃤槑𠸝瑹㻞璙琔瑖玘䮎𤪼𤂍叐㖄爏𤃉喴𠍅响𠯆圝鉝雴鍦埝垍坿㘾壋媙𨩆𡛺𡝯𡜐娬妸銏婾嫏娒𥥆𡧳𡡡𤊕㛵洅瑃娡𥺃"
  ],
  [
    "9340",
    "媁𨯗𠐓鏠璌𡌃焅䥲鐈𨧻鎽㞠尞岞幞幈𡦖𡥼𣫮廍孏𡤃𡤄㜁𡢠㛝𡛾㛓脪𨩇𡶺𣑲𨦨弌弎𡤧𡞫婫𡜻孄蘔𧗽衠恾𢡠𢘫忛㺸𢖯𢖾𩂈𦽳懀𠀾𠁆𢘛憙憘恵𢲛𢴇𤛔𩅍"
  ],
  [
    "93a1",
    "摱𤙥𢭪㨩𢬢𣑐𩣪𢹸挷𪑛撶挱揑𤧣𢵧护𢲡搻敫楲㯴𣂎𣊭𤦉𣊫唍𣋠𡣙𩐿曎𣊉𣆳㫠䆐𥖄𨬢𥖏𡛼𥕛𥐥磮𣄃𡠪𣈴㑤𣈏𣆂𤋉暎𦴤晫䮓昰𧡰𡷫晣𣋒𣋡昞𥡲㣑𣠺𣞼㮙𣞢𣏾瓐㮖枏𤘪梶栞㯄檾㡣𣟕𤒇樳橒櫉欅𡤒攑梘橌㯗橺歗𣿀𣲚鎠鋲𨯪𨫋"
  ],
  [
    "9440",
    "銉𨀞𨧜鑧涥漋𤧬浧𣽿㶏渄𤀼娽渊塇洤硂焻𤌚𤉶烱牐犇犔𤞏𤜥兹𤪤𠗫瑺𣻸𣙟𤩊𤤗𥿡㼆㺱𤫟𨰣𣼵悧㻳瓌琼鎇琷䒟𦷪䕑疃㽣𤳙𤴆㽘畕癳𪗆㬙瑨𨫌𤦫𤦎㫻"
  ],
  [
    "94a1",
    "㷍𤩎㻿𤧅𤣳釺圲鍂𨫣𡡤僟𥈡𥇧睸𣈲眎眏睻𤚗𣞁㩞𤣰琸璛㺿𤪺𤫇䃈𤪖𦆮錇𥖁砞碍碈磒珐祙𧝁𥛣䄎禛蒖禥樭𣻺稺秴䅮𡛦䄲鈵秱𠵌𤦌𠊙𣶺𡝮㖗啫㕰㚪𠇔𠰍竢婙𢛵𥪯𥪜娍𠉛磰娪𥯆竾䇹籝籭䈑𥮳𥺼𥺦糍𤧹𡞰粎籼粮檲緜縇緓罎𦉡"
  ],
  [
    "9540",
    "𦅜𧭈綗𥺂䉪𦭵𠤖柖𠁎𣗏埄𦐒𦏸𤥢翝笧𠠬𥫩𥵃笌𥸎駦虅驣樜𣐿㧢𤧷𦖭騟𦖠蒀𧄧𦳑䓪脷䐂胆脉腂𦞴飃𦩂艢艥𦩑葓𦶧蘐𧈛媆䅿𡡀嬫𡢡嫤𡣘蚠蜨𣶏蠭𧐢娂"
  ],
  [
    "95a1",
    "衮佅袇袿裦襥襍𥚃襔𧞅𧞄𨯵𨯙𨮜𨧹㺭蒣䛵䛏㟲訽訜𩑈彍鈫𤊄旔焩烄𡡅鵭貟賩𧷜妚矃姰䍮㛔踪躧𤰉輰轊䋴汘澻𢌡䢛潹溋𡟚鯩㚵𤤯邻邗啱䤆醻鐄𨩋䁢𨫼鐧𨰝𨰻蓥訫閙閧閗閖𨴴瑅㻂𤣿𤩂𤏪㻧𣈥随𨻧𨹦𨹥㻌𤧭𤩸𣿮琒瑫㻼靁𩂰"
  ],
  [
    "9640",
    "桇䨝𩂓𥟟靝鍨𨦉𨰦𨬯𦎾銺嬑譩䤼珹𤈛鞛靱餸𠼦巁𨯅𤪲頟𩓚鋶𩗗釥䓀𨭐𤩧𨭤飜𨩅㼀鈪䤥萔餻饍𧬆㷽馛䭯馪驜𨭥𥣈檏騡嫾騯𩣱䮐𩥈馼䮽䮗鍽塲𡌂堢𤦸"
  ],
  [
    "96a1",
    "𡓨硄𢜟𣶸棅㵽鑘㤧慐𢞁𢥫愇鱏鱓鱻鰵鰐魿鯏𩸭鮟𪇵𪃾鴡䲮𤄄鸘䲰鴌𪆴𪃭𪃳𩤯鶥蒽𦸒𦿟𦮂藼䔳𦶤𦺄𦷰萠藮𦸀𣟗𦁤秢𣖜𣙀䤭𤧞㵢鏛銾鍈𠊿碹鉷鑍俤㑀遤𥕝砽硔碶硋𡝗𣇉𤥁㚚佲濚濙瀞瀞吔𤆵垻壳垊鴖埗焴㒯𤆬燫𦱀𤾗嬨𡞵𨩉"
  ],
  [
    "9740",
    "愌嫎娋䊼𤒈㜬䭻𨧼鎻鎸𡣖𠼝葲𦳀𡐓𤋺𢰦𤏁妔𣶷𦝁綨𦅛𦂤𤦹𤦋𨧺鋥珢㻩璴𨭣𡢟㻡𤪳櫘珳珻㻖𤨾𤪔𡟙𤩦𠎧𡐤𤧥瑈𤤖炥𤥶銄珦鍟𠓾錱𨫎𨨖鎆𨯧𥗕䤵𨪂煫"
  ],
  [
    "97a1",
    "𤥃𠳿嚤𠘚𠯫𠲸唂秄𡟺緾𡛂𤩐𡡒䔮鐁㜊𨫀𤦭妰𡢿𡢃𧒄媡㛢𣵛㚰鉟婹𨪁𡡢鍴㳍𠪴䪖㦊僴㵩㵌𡎜煵䋻𨈘渏𩃤䓫浗𧹏灧沯㳖𣿭𣸭渂漌㵯𠏵畑㚼㓈䚀㻚䡱姄鉮䤾轁𨰜𦯀堒埈㛖𡑒烾𤍢𤩱𢿣𡊰𢎽梹楧𡎘𣓥𧯴𣛟𨪃𣟖𣏺𤲟樚𣚭𦲷萾䓟䓎"
  ],
  [
    "9840",
    "𦴦𦵑𦲂𦿞漗𧄉茽𡜺菭𦲀𧁓𡟛妉媂𡞳婡婱𡤅𤇼㜭姯𡜼㛇熎鎐暚𤊥婮娫𤊓樫𣻹𧜶𤑛𤋊焝𤉙𨧡侰𦴨峂𤓎𧹍𤎽樌𤉖𡌄炦焳𤏩㶥泟勇𤩏繥姫崯㷳彜𤩝𡟟綤萦"
  ],
  [
    "98a1",
    "咅𣫺𣌀𠈔坾𠣕𠘙㿥𡾞𪊶瀃𩅛嵰玏糓𨩙𩐠俈翧狍猐𧫴猸猹𥛶獁獈㺩𧬘遬燵𤣲珡臶㻊県㻑沢国琙琞琟㻢㻰㻴㻺瓓㼎㽓畂畭畲疍㽼痈痜㿀癍㿗癴㿜発𤽜熈嘣覀塩䀝睃䀹条䁅㗛瞘䁪䁯属瞾矋売砘点砜䂨砹硇硑硦葈𥔵礳栃礲䄃"
  ],
  [
    "9940",
    "䄉禑禙辻稆込䅧窑䆲窼艹䇄竏竛䇏両筢筬筻簒簛䉠䉺类粜䊌粸䊔糭输烀𠳏総緔緐緽羮羴犟䎗耠耥笹耮耱联㷌垴炠肷胩䏭脌猪脎脒畠脔䐁㬹腖腙腚"
  ],
  [
    "99a1",
    "䐓堺腼膄䐥膓䐭膥埯臁臤艔䒏芦艶苊苘苿䒰荗险榊萅烵葤惣蒈䔄蒾蓡蓸蔐蔸蕒䔻蕯蕰藠䕷虲蚒蚲蛯际螋䘆䘗袮裿褤襇覑𧥧訩訸誔誴豑賔賲贜䞘塟跃䟭仮踺嗘坔蹱嗵躰䠷軎転軤軭軲辷迁迊迌逳駄䢭飠鈓䤞鈨鉘鉫銱銮銿"
  ],
  [
    "9a40",
    "鋣鋫鋳鋴鋽鍃鎄鎭䥅䥑麿鐗匁鐝鐭鐾䥪鑔鑹锭関䦧间阳䧥枠䨤靀䨵鞲韂噔䫤惨颹䬙飱塄餎餙冴餜餷饂饝饢䭰駅䮝騼鬏窃魩鮁鯝鯱鯴䱭鰠㝯𡯂鵉鰺"
  ],
  [
    "9aa1",
    "黾噐鶓鶽鷀鷼银辶鹻麬麱麽黆铜黢黱黸竈齄𠂔𠊷𠎠椚铃妬𠓗塀铁㞹𠗕𠘕𠙶𡚺块煳𠫂𠫍𠮿呪吆𠯋咞𠯻𠰻𠱓𠱥𠱼惧𠲍噺𠲵𠳝𠳭𠵯𠶲𠷈楕鰯螥𠸄𠸎𠻗𠾐𠼭𠹳尠𠾼帋𡁜𡁏𡁶朞𡁻𡂈𡂖㙇𡂿𡃓𡄯𡄻卤蒭𡋣𡍵𡌶讁𡕷𡘙𡟃𡟇乸炻𡠭𡥪"
  ],
  [
    "9b40",
    "𡨭𡩅𡰪𡱰𡲬𡻈拃𡻕𡼕熘桕𢁅槩㛈𢉼𢏗𢏺𢜪𢡱𢥏苽𢥧𢦓𢫕覥𢫨辠𢬎鞸𢬿顇骽𢱌"
  ],
  [
    "9b62",
    "𢲈𢲷𥯨𢴈𢴒𢶷𢶕𢹂𢽴𢿌𣀳𣁦𣌟𣏞徱晈暿𧩹𣕧𣗳爁𤦺矗𣘚𣜖纇𠍆墵朎"
  ],
  [
    "9ba1",
    "椘𣪧𧙗𥿢𣸑𣺹𧗾𢂚䣐䪸𤄙𨪚𤋮𤌍𤀻𤌴𤎖𤩅𠗊凒𠘑妟𡺨㮾𣳿𤐄𤓖垈𤙴㦛𤜯𨗨𩧉㝢𢇃譞𨭎駖𤠒𤣻𤨕爉𤫀𠱸奥𤺥𤾆𠝹軚𥀬劏圿煱𥊙𥐙𣽊𤪧喼𥑆𥑮𦭒釔㑳𥔿𧘲𥕞䜘𥕢𥕦𥟇𤤿𥡝偦㓻𣏌惞𥤃䝼𨥈𥪮𥮉𥰆𡶐垡煑澶𦄂𧰒遖𦆲𤾚譢𦐂𦑊"
  ],
  [
    "9c40",
    "嵛𦯷輶𦒄𡤜諪𤧶𦒈𣿯𦔒䯀𦖿𦚵𢜛鑥𥟡憕娧晉侻嚹𤔡𦛼乪𤤴陖涏𦲽㘘襷𦞙𦡮𦐑𦡞營𦣇筂𩃀𠨑𦤦鄄𦤹穅鷰𦧺騦𦨭㙟𦑩𠀡禃𦨴𦭛崬𣔙菏𦮝䛐𦲤画补𦶮墶"
  ],
  [
    "9ca1",
    "㜜𢖍𧁋𧇍㱔𧊀𧊅銁𢅺𧊋錰𧋦𤧐氹钟𧑐𠻸蠧裵𢤦𨑳𡞱溸𤨪𡠠㦤㚹尐秣䔿暶𩲭𩢤襃𧟌𧡘囖䃟𡘊㦡𣜯𨃨𡏅熭荦𧧝𩆨婧䲷𧂯𨦫𧧽𧨊𧬋𧵦𤅺筃祾𨀉澵𪋟樃𨌘厢𦸇鎿栶靝𨅯𨀣𦦵𡏭𣈯𨁈嶅𨰰𨂃圕頣𨥉嶫𤦈斾槕叒𤪥𣾁㰑朶𨂐𨃴𨄮𡾡𨅏"
  ],
  [
    "9d40",
    "𨆉𨆯𨈚𨌆𨌯𨎊㗊𨑨𨚪䣺揦𨥖砈鉕𨦸䏲𨧧䏟𨧨𨭆𨯔姸𨰉輋𨿅𩃬筑𩄐𩄼㷷𩅞𤫊运犏嚋𩓧𩗩𩖰𩖸𩜲𩣑𩥉𩥪𩧃𩨨𩬎𩵚𩶛纟𩻸𩼣䲤镇𪊓熢𪋿䶑递𪗋䶜𠲜达嗁"
  ],
  [
    "9da1",
    "辺𢒰边𤪓䔉繿潖檱仪㓤𨬬𧢝㜺躀𡟵𨀤𨭬𨮙𧨾𦚯㷫𧙕𣲷𥘵𥥖亚𥺁𦉘嚿𠹭踎孭𣺈𤲞揞拐𡟶𡡻攰嘭𥱊吚𥌑㷆𩶘䱽嘢嘞罉𥻘奵𣵀蝰东𠿪𠵉𣚺脗鵞贘瘻鱅癎瞹鍅吲腈苷嘥脲萘肽嗪祢噃吖𠺝㗎嘅嗱曱𨋢㘭甴嗰喺咗啲𠱁𠲖廐𥅈𠹶𢱢"
  ],
  [
    "9e40",
    "𠺢麫絚嗞𡁵抝靭咔賍燶酶揼掹揾啩𢭃鱲𢺳冚㓟𠶧冧呍唞唓癦踭𦢊疱肶蠄螆裇膶萜𡃁䓬猄𤜆宐茋𦢓噻𢛴𧴯𤆣𧵳𦻐𧊶酰𡇙鈈𣳼𪚩𠺬𠻹牦𡲢䝎𤿂𧿹𠿫䃺"
  ],
  [
    "9ea1",
    "鱝攟𢶠䣳𤟠𩵼𠿬𠸊恢𧖣𠿭"
  ],
  [
    "9ead",
    "𦁈𡆇熣纎鵐业丄㕷嬍沲卧㚬㧜卽㚥𤘘墚𤭮舭呋垪𥪕𠥹"
  ],
  [
    "9ec5",
    "㩒𢑥獴𩺬䴉鯭𣳾𩼰䱛𤾩𩖞𩿞葜𣶶𧊲𦞳𣜠挮紥𣻷𣸬㨪逈勌㹴㙺䗩𠒎癀嫰𠺶硺𧼮墧䂿噼鮋嵴癔𪐴麅䳡痹㟻愙𣃚𤏲"
  ],
  [
    "9ef5",
    "噝𡊩垧𤥣𩸆刴𧂮㖭汊鵼"
  ],
  [
    "9f40",
    "籖鬹埞𡝬屓擓𩓐𦌵𧅤蚭𠴨𦴢𤫢𠵱"
  ],
  [
    "9f4f",
    "凾𡼏嶎霃𡷑麁遌笟鬂峑箣扨挵髿篏鬪籾鬮籂粆鰕篼鬉鼗鰛𤤾齚啳寃俽麘俲剠㸆勑坧偖妷帒韈鶫轜呩鞴饀鞺匬愰"
  ],
  [
    "9fa1",
    "椬叚鰊鴂䰻陁榀傦畆𡝭駚剳"
  ],
  [
    "9fae",
    "酙隁酜"
  ],
  [
    "9fb2",
    "酑𨺗捿𦴣櫊嘑醎畺抅𠏼獏籰𥰡𣳽"
  ],
  [
    "9fc1",
    "𤤙盖鮝个𠳔莾衂"
  ],
  [
    "9fc9",
    "届槀僭坺刟巵从氱𠇲伹咜哚劚趂㗾弌㗳"
  ],
  [
    "9fdb",
    "歒酼龥鮗頮颴骺麨麄煺笔"
  ],
  [
    "9fe7",
    "毺蠘罸"
  ],
  [
    "9feb",
    "嘠𪙊蹷齓"
  ],
  [
    "9ff0",
    "跔蹏鸜踁抂𨍽踨蹵竓𤩷稾磘泪詧瘇"
  ],
  [
    "a040",
    "𨩚鼦泎蟖痃𪊲硓咢贌狢獱謭猂瓱賫𤪻蘯徺袠䒷"
  ],
  [
    "a055",
    "𡠻𦸅"
  ],
  [
    "a058",
    "詾𢔛"
  ],
  [
    "a05b",
    "惽癧髗鵄鍮鮏蟵"
  ],
  [
    "a063",
    "蠏賷猬霡鮰㗖犲䰇籑饊𦅙慙䰄麖慽"
  ],
  [
    "a073",
    "坟慯抦戹拎㩜懢厪𣏵捤栂㗒"
  ],
  [
    "a0a1",
    "嵗𨯂迚𨸹"
  ],
  [
    "a0a6",
    "僙𡵆礆匲阸𠼻䁥"
  ],
  [
    "a0ae",
    "矾"
  ],
  [
    "a0b0",
    "糂𥼚糚稭聦聣絍甅瓲覔舚朌聢𧒆聛瓰脃眤覉𦟌畓𦻑螩蟎臈螌詉貭譃眫瓸蓚㘵榲趦"
  ],
  [
    "a0d4",
    "覩瑨涹蟁𤀑瓧㷛煶悤憜㳑煢恷"
  ],
  [
    "a0e2",
    "罱𨬭牐惩䭾删㰘𣳇𥻗𧙖𥔱𡥄𡋾𩤃𦷜𧂭峁𦆭𨨏𣙷𠃮𦡆𤼎䕢嬟𦍌齐麦𦉫"
  ],
  [
    "a3c0",
    "␀",
    31,
    "␡"
  ],
  [
    "c6a1",
    "①",
    9,
    "⑴",
    9,
    "ⅰ",
    9,
    "丶丿亅亠冂冖冫勹匸卩厶夊宀巛⼳广廴彐彡攴无疒癶辵隶¨ˆヽヾゝゞ〃仝々〆〇ー［］✽ぁ",
    23
  ],
  [
    "c740",
    "す",
    58,
    "ァアィイ"
  ],
  [
    "c7a1",
    "ゥ",
    81,
    "А",
    5,
    "ЁЖ",
    4
  ],
  [
    "c840",
    "Л",
    26,
    "ёж",
    25,
    "⇧↸↹㇏𠃌乚𠂊刂䒑"
  ],
  [
    "c8a1",
    "龰冈龱𧘇"
  ],
  [
    "c8cd",
    "￢￤＇＂㈱№℡゛゜⺀⺄⺆⺇⺈⺊⺌⺍⺕⺜⺝⺥⺧⺪⺬⺮⺶⺼⺾⻆⻊⻌⻍⻏⻖⻗⻞⻣"
  ],
  [
    "c8f5",
    "ʃɐɛɔɵœøŋʊɪ"
  ],
  [
    "f9fe",
    "￭"
  ],
  [
    "fa40",
    "𠕇鋛𠗟𣿅蕌䊵珯况㙉𤥂𨧤鍄𡧛苮𣳈砼杄拟𤤳𨦪𠊠𦮳𡌅侫𢓭倈𦴩𧪄𣘀𤪱𢔓倩𠍾徤𠎀𠍇滛𠐟偽儁㑺儎顬㝃萖𤦤𠒇兠𣎴兪𠯿𢃼𠋥𢔰𠖎𣈳𡦃宂蝽𠖳𣲙冲冸"
  ],
  [
    "faa1",
    "鴴凉减凑㳜凓𤪦决凢卂凭菍椾𣜭彻刋刦刼劵剗劔効勅簕蕂勠蘍𦬓包𨫞啉滙𣾀𠥔𣿬匳卄𠯢泋𡜦栛珕恊㺪㣌𡛨燝䒢卭却𨚫卾卿𡖖𡘓矦厓𨪛厠厫厮玧𥝲㽙玜叁叅汉义埾叙㪫𠮏叠𣿫𢶣叶𠱷吓灹唫晗浛呭𦭓𠵴啝咏咤䞦𡜍𠻝㶴𠵍"
  ],
  [
    "fb40",
    "𨦼𢚘啇䳭启琗喆喩嘅𡣗𤀺䕒𤐵暳𡂴嘷曍𣊊暤暭噍噏磱囱鞇叾圀囯园𨭦㘣𡉏坆𤆥汮炋坂㚱𦱾埦𡐖堃𡑔𤍣堦𤯵塜墪㕡壠壜𡈼壻寿坃𪅐𤉸鏓㖡够梦㛃湙"
  ],
  [
    "fba1",
    "𡘾娤啓𡚒蔅姉𠵎𦲁𦴪𡟜姙𡟻𡞲𦶦浱𡠨𡛕姹𦹅媫婣㛦𤦩婷㜈媖瑥嫓𦾡𢕔㶅𡤑㜲𡚸広勐孶斈孼𧨎䀄䡝𠈄寕慠𡨴𥧌𠖥寳宝䴐尅𡭄尓珎尔𡲥𦬨屉䣝岅峩峯嶋𡷹𡸷崐崘嵆𡺤岺巗苼㠭𤤁𢁉𢅳芇㠶㯂帮檊幵幺𤒼𠳓厦亷廐厨𡝱帉廴𨒂"
  ],
  [
    "fc40",
    "廹廻㢠廼栾鐛弍𠇁弢㫞䢮𡌺强𦢈𢏐彘𢑱彣鞽𦹮彲鍀𨨶徧嶶㵟𥉐𡽪𧃸𢙨釖𠊞𨨩怱暅𡡷㥣㷇㘹垐𢞴祱㹀悞悤悳𤦂𤦏𧩓璤僡媠慤萤慂慈𦻒憁凴𠙖憇宪𣾷"
  ],
  [
    "fca1",
    "𢡟懓𨮝𩥝懐㤲𢦀𢣁怣慜攞掋𠄘担𡝰拕𢸍捬𤧟㨗搸揸𡎎𡟼撐澊𢸶頔𤂌𥜝擡擥鑻㩦携㩗敍漖𤨨𤨣斅敭敟𣁾斵𤥀䬷旑䃘𡠩无旣忟𣐀昘𣇷𣇸晄𣆤𣆥晋𠹵晧𥇦晳晴𡸽𣈱𨗴𣇈𥌓矅𢣷馤朂𤎜𤨡㬫槺𣟂杞杧杢𤇍𩃭柗䓩栢湐鈼栁𣏦𦶠桝"
  ],
  [
    "fd40",
    "𣑯槡樋𨫟楳棃𣗍椁椀㴲㨁𣘼㮀枬楡𨩊䋼椶榘㮡𠏉荣傐槹𣙙𢄪橅𣜃檝㯳枱櫈𩆜㰍欝𠤣惞欵歴𢟍溵𣫛𠎵𡥘㝀吡𣭚毡𣻼毜氷𢒋𤣱𦭑汚舦汹𣶼䓅𣶽𤆤𤤌𤤀"
  ],
  [
    "fda1",
    "𣳉㛥㳫𠴲鮃𣇹𢒑羏样𦴥𦶡𦷫涖浜湼漄𤥿𤂅𦹲蔳𦽴凇沜渝萮𨬡港𣸯瑓𣾂秌湏媑𣁋濸㜍澝𣸰滺𡒗𤀽䕕鏰潄潜㵎潴𩅰㴻澟𤅄濓𤂑𤅕𤀹𣿰𣾴𤄿凟𤅖𤅗𤅀𦇝灋灾炧炁烌烕烖烟䄄㷨熴熖𤉷焫煅媈煊煮岜𤍥煏鍢𤋁焬𤑚𤨧𤨢熺𨯨炽爎"
  ],
  [
    "fe40",
    "鑂爕夑鑃爤鍁𥘅爮牀𤥴梽牕牗㹕𣁄栍漽犂猪猫𤠣𨠫䣭𨠄猨献珏玪𠰺𦨮珉瑉𤇢𡛧𤨤昣㛅𤦷𤦍𤧻珷琕椃𤨦琹𠗃㻗瑜𢢭瑠𨺲瑇珤瑶莹瑬㜰瑴鏱樬璂䥓𤪌"
  ],
  [
    "fea1",
    "𤅟𤩹𨮏孆𨰃𡢞瓈𡦈甎瓩甞𨻙𡩋寗𨺬鎅畍畊畧畮𤾂㼄𤴓疎瑝疞疴瘂瘬癑癏癯癶𦏵皐臯㟸𦤑𦤎皡皥皷盌𦾟葢𥂝𥅽𡸜眞眦着撯𥈠睘𣊬瞯𨥤𨥨𡛁矴砉𡍶𤨒棊碯磇磓隥礮𥗠磗礴碱𧘌辸袄𨬫𦂃𢘜禆褀椂禀𥡗禝𧬹礼禩渪𧄦㺨秆𩄍秔"
  ]
];
var dbcsData;
var hasRequiredDbcsData;
function requireDbcsData() {
  if (hasRequiredDbcsData) return dbcsData;
  hasRequiredDbcsData = 1;
  dbcsData = {
    // == Japanese/ShiftJIS ====================================================
    // All japanese encodings are based on JIS X set of standards:
    // JIS X 0201 - Single-byte encoding of ASCII + ¥ + Kana chars at 0xA1-0xDF.
    // JIS X 0208 - Main set of 6879 characters, placed in 94x94 plane, to be encoded by 2 bytes. 
    //              Has several variations in 1978, 1983, 1990 and 1997.
    // JIS X 0212 - Supplementary plane of 6067 chars in 94x94 plane. 1990. Effectively dead.
    // JIS X 0213 - Extension and modern replacement of 0208 and 0212. Total chars: 11233.
    //              2 planes, first is superset of 0208, second - revised 0212.
    //              Introduced in 2000, revised 2004. Some characters are in Unicode Plane 2 (0x2xxxx)
    // Byte encodings are:
    //  * Shift_JIS: Compatible with 0201, uses not defined chars in top half as lead bytes for double-byte
    //               encoding of 0208. Lead byte ranges: 0x81-0x9F, 0xE0-0xEF; Trail byte ranges: 0x40-0x7E, 0x80-0x9E, 0x9F-0xFC.
    //               Windows CP932 is a superset of Shift_JIS. Some companies added more chars, notably KDDI.
    //  * EUC-JP:    Up to 3 bytes per character. Used mostly on *nixes.
    //               0x00-0x7F       - lower part of 0201
    //               0x8E, 0xA1-0xDF - upper part of 0201
    //               (0xA1-0xFE)x2   - 0208 plane (94x94).
    //               0x8F, (0xA1-0xFE)x2 - 0212 plane (94x94).
    //  * JIS X 208: 7-bit, direct encoding of 0208. Byte ranges: 0x21-0x7E (94 values). Uncommon.
    //               Used as-is in ISO2022 family.
    //  * ISO2022-JP: Stateful encoding, with escape sequences to switch between ASCII, 
    //                0201-1976 Roman, 0208-1978, 0208-1983.
    //  * ISO2022-JP-1: Adds esc seq for 0212-1990.
    //  * ISO2022-JP-2: Adds esc seq for GB2313-1980, KSX1001-1992, ISO8859-1, ISO8859-7.
    //  * ISO2022-JP-3: Adds esc seq for 0201-1976 Kana set, 0213-2000 Planes 1, 2.
    //  * ISO2022-JP-2004: Adds 0213-2004 Plane 1.
    //
    // After JIS X 0213 appeared, Shift_JIS-2004, EUC-JISX0213 and ISO2022-JP-2004 followed, with just changing the planes.
    //
    // Overall, it seems that it's a mess :( http://www8.plala.or.jp/tkubota1/unicode-symbols-map2.html
    "shiftjis": {
      type: "_dbcs",
      table: function() {
        return require$$0;
      },
      encodeAdd: { "¥": 92, "‾": 126 },
      encodeSkipVals: [{ from: 60736, to: 63808 }]
    },
    "csshiftjis": "shiftjis",
    "mskanji": "shiftjis",
    "sjis": "shiftjis",
    "windows31j": "shiftjis",
    "ms31j": "shiftjis",
    "xsjis": "shiftjis",
    "windows932": "shiftjis",
    "ms932": "shiftjis",
    "932": "shiftjis",
    "cp932": "shiftjis",
    "eucjp": {
      type: "_dbcs",
      table: function() {
        return require$$1;
      },
      encodeAdd: { "¥": 92, "‾": 126 }
    },
    // TODO: KDDI extension to Shift_JIS
    // TODO: IBM CCSID 942 = CP932, but F0-F9 custom chars and other char changes.
    // TODO: IBM CCSID 943 = Shift_JIS = CP932 with original Shift_JIS lower 128 chars.
    // == Chinese/GBK ==========================================================
    // http://en.wikipedia.org/wiki/GBK
    // We mostly implement W3C recommendation: https://www.w3.org/TR/encoding/#gbk-encoder
    // Oldest GB2312 (1981, ~7600 chars) is a subset of CP936
    "gb2312": "cp936",
    "gb231280": "cp936",
    "gb23121980": "cp936",
    "csgb2312": "cp936",
    "csiso58gb231280": "cp936",
    "euccn": "cp936",
    // Microsoft's CP936 is a subset and approximation of GBK.
    "windows936": "cp936",
    "ms936": "cp936",
    "936": "cp936",
    "cp936": {
      type: "_dbcs",
      table: function() {
        return require$$2;
      }
    },
    // GBK (~22000 chars) is an extension of CP936 that added user-mapped chars and some other.
    "gbk": {
      type: "_dbcs",
      table: function() {
        return require$$2.concat(require$$3$1);
      }
    },
    "xgbk": "gbk",
    "isoir58": "gbk",
    // GB18030 is an algorithmic extension of GBK.
    // Main source: https://www.w3.org/TR/encoding/#gbk-encoder
    // http://icu-project.org/docs/papers/gb18030.html
    // http://source.icu-project.org/repos/icu/data/trunk/charset/data/xml/gb-18030-2000.xml
    // http://www.khngai.com/chinese/charmap/tblgbk.php?page=0
    "gb18030": {
      type: "_dbcs",
      table: function() {
        return require$$2.concat(require$$3$1);
      },
      gb18030: function() {
        return require$$4;
      },
      encodeSkipVals: [128],
      encodeAdd: { "€": 41699 }
    },
    "chinese": "gb18030",
    // == Korean ===============================================================
    // EUC-KR, KS_C_5601 and KS X 1001 are exactly the same.
    "windows949": "cp949",
    "ms949": "cp949",
    "949": "cp949",
    "cp949": {
      type: "_dbcs",
      table: function() {
        return require$$5;
      }
    },
    "cseuckr": "cp949",
    "csksc56011987": "cp949",
    "euckr": "cp949",
    "isoir149": "cp949",
    "korean": "cp949",
    "ksc56011987": "cp949",
    "ksc56011989": "cp949",
    "ksc5601": "cp949",
    // == Big5/Taiwan/Hong Kong ================================================
    // There are lots of tables for Big5 and cp950. Please see the following links for history:
    // http://moztw.org/docs/big5/  http://www.haible.de/bruno/charsets/conversion-tables/Big5.html
    // Variations, in roughly number of defined chars:
    //  * Windows CP 950: Microsoft variant of Big5. Canonical: http://www.unicode.org/Public/MAPPINGS/VENDORS/MICSFT/WINDOWS/CP950.TXT
    //  * Windows CP 951: Microsoft variant of Big5-HKSCS-2001. Seems to be never public. http://me.abelcheung.org/articles/research/what-is-cp951/
    //  * Big5-2003 (Taiwan standard) almost superset of cp950.
    //  * Unicode-at-on (UAO) / Mozilla 1.8. Falling out of use on the Web. Not supported by other browsers.
    //  * Big5-HKSCS (-2001, -2004, -2008). Hong Kong standard. 
    //    many unicode code points moved from PUA to Supplementary plane (U+2XXXX) over the years.
    //    Plus, it has 4 combining sequences.
    //    Seems that Mozilla refused to support it for 10 yrs. https://bugzilla.mozilla.org/show_bug.cgi?id=162431 https://bugzilla.mozilla.org/show_bug.cgi?id=310299
    //    because big5-hkscs is the only encoding to include astral characters in non-algorithmic way.
    //    Implementations are not consistent within browsers; sometimes labeled as just big5.
    //    MS Internet Explorer switches from big5 to big5-hkscs when a patch applied.
    //    Great discussion & recap of what's going on https://bugzilla.mozilla.org/show_bug.cgi?id=912470#c31
    //    In the encoder, it might make sense to support encoding old PUA mappings to Big5 bytes seq-s.
    //    Official spec: http://www.ogcio.gov.hk/en/business/tech_promotion/ccli/terms/doc/2003cmp_2008.txt
    //                   http://www.ogcio.gov.hk/tc/business/tech_promotion/ccli/terms/doc/hkscs-2008-big5-iso.txt
    // 
    // Current understanding of how to deal with Big5(-HKSCS) is in the Encoding Standard, http://encoding.spec.whatwg.org/#big5-encoder
    // Unicode mapping (http://www.unicode.org/Public/MAPPINGS/OBSOLETE/EASTASIA/OTHER/BIG5.TXT) is said to be wrong.
    "windows950": "cp950",
    "ms950": "cp950",
    "950": "cp950",
    "cp950": {
      type: "_dbcs",
      table: function() {
        return require$$6;
      }
    },
    // Big5 has many variations and is an extension of cp950. We use Encoding Standard's as a consensus.
    "big5": "big5hkscs",
    "big5hkscs": {
      type: "_dbcs",
      table: function() {
        return require$$6.concat(require$$7);
      },
      encodeSkipVals: [41676]
    },
    "cnbig5": "big5hkscs",
    "csbig5": "big5hkscs",
    "xxbig5": "big5hkscs"
  };
  return dbcsData;
}
var hasRequiredEncodings;
function requireEncodings() {
  if (hasRequiredEncodings) return encodings;
  hasRequiredEncodings = 1;
  (function(exports2) {
    var modules = [
      requireInternal(),
      requireUtf16(),
      requireUtf7(),
      requireSbcsCodec(),
      requireSbcsData(),
      requireSbcsDataGenerated(),
      requireDbcsCodec(),
      requireDbcsData()
    ];
    for (var i = 0; i < modules.length; i++) {
      var module2 = modules[i];
      for (var enc in module2)
        if (Object.prototype.hasOwnProperty.call(module2, enc))
          exports2[enc] = module2[enc];
    }
  })(encodings);
  return encodings;
}
var streams;
var hasRequiredStreams;
function requireStreams() {
  if (hasRequiredStreams) return streams;
  hasRequiredStreams = 1;
  var Buffer2 = require$$0$5.Buffer, Transform = require$$1$2.Transform;
  streams = function(iconv) {
    iconv.encodeStream = function encodeStream(encoding, options) {
      return new IconvLiteEncoderStream(iconv.getEncoder(encoding, options), options);
    };
    iconv.decodeStream = function decodeStream(encoding, options) {
      return new IconvLiteDecoderStream(iconv.getDecoder(encoding, options), options);
    };
    iconv.supportsStreams = true;
    iconv.IconvLiteEncoderStream = IconvLiteEncoderStream;
    iconv.IconvLiteDecoderStream = IconvLiteDecoderStream;
    iconv._collect = IconvLiteDecoderStream.prototype.collect;
  };
  function IconvLiteEncoderStream(conv, options) {
    this.conv = conv;
    options = options || {};
    options.decodeStrings = false;
    Transform.call(this, options);
  }
  IconvLiteEncoderStream.prototype = Object.create(Transform.prototype, {
    constructor: { value: IconvLiteEncoderStream }
  });
  IconvLiteEncoderStream.prototype._transform = function(chunk, encoding, done) {
    if (typeof chunk != "string")
      return done(new Error("Iconv encoding stream needs strings as its input."));
    try {
      var res = this.conv.write(chunk);
      if (res && res.length) this.push(res);
      done();
    } catch (e) {
      done(e);
    }
  };
  IconvLiteEncoderStream.prototype._flush = function(done) {
    try {
      var res = this.conv.end();
      if (res && res.length) this.push(res);
      done();
    } catch (e) {
      done(e);
    }
  };
  IconvLiteEncoderStream.prototype.collect = function(cb) {
    var chunks = [];
    this.on("error", cb);
    this.on("data", function(chunk) {
      chunks.push(chunk);
    });
    this.on("end", function() {
      cb(null, Buffer2.concat(chunks));
    });
    return this;
  };
  function IconvLiteDecoderStream(conv, options) {
    this.conv = conv;
    options = options || {};
    options.encoding = this.encoding = "utf8";
    Transform.call(this, options);
  }
  IconvLiteDecoderStream.prototype = Object.create(Transform.prototype, {
    constructor: { value: IconvLiteDecoderStream }
  });
  IconvLiteDecoderStream.prototype._transform = function(chunk, encoding, done) {
    if (!Buffer2.isBuffer(chunk))
      return done(new Error("Iconv decoding stream needs buffers as its input."));
    try {
      var res = this.conv.write(chunk);
      if (res && res.length) this.push(res, this.encoding);
      done();
    } catch (e) {
      done(e);
    }
  };
  IconvLiteDecoderStream.prototype._flush = function(done) {
    try {
      var res = this.conv.end();
      if (res && res.length) this.push(res, this.encoding);
      done();
    } catch (e) {
      done(e);
    }
  };
  IconvLiteDecoderStream.prototype.collect = function(cb) {
    var res = "";
    this.on("error", cb);
    this.on("data", function(chunk) {
      res += chunk;
    });
    this.on("end", function() {
      cb(null, res);
    });
    return this;
  };
  return streams;
}
var extendNode;
var hasRequiredExtendNode;
function requireExtendNode() {
  if (hasRequiredExtendNode) return extendNode;
  hasRequiredExtendNode = 1;
  var Buffer2 = require$$0$5.Buffer;
  extendNode = function(iconv) {
    var original = void 0;
    iconv.supportsNodeEncodingsExtension = !(Buffer2.from || new Buffer2(0) instanceof Uint8Array);
    iconv.extendNodeEncodings = function extendNodeEncodings() {
      if (original) return;
      original = {};
      if (!iconv.supportsNodeEncodingsExtension) {
        console.error("ACTION NEEDED: require('iconv-lite').extendNodeEncodings() is not supported in your version of Node");
        console.error("See more info at https://github.com/ashtuchkin/iconv-lite/wiki/Node-v4-compatibility");
        return;
      }
      var nodeNativeEncodings = {
        "hex": true,
        "utf8": true,
        "utf-8": true,
        "ascii": true,
        "binary": true,
        "base64": true,
        "ucs2": true,
        "ucs-2": true,
        "utf16le": true,
        "utf-16le": true
      };
      Buffer2.isNativeEncoding = function(enc) {
        return enc && nodeNativeEncodings[enc.toLowerCase()];
      };
      var SlowBuffer = require$$0$5.SlowBuffer;
      original.SlowBufferToString = SlowBuffer.prototype.toString;
      SlowBuffer.prototype.toString = function(encoding, start, end) {
        encoding = String(encoding || "utf8").toLowerCase();
        if (Buffer2.isNativeEncoding(encoding))
          return original.SlowBufferToString.call(this, encoding, start, end);
        if (typeof start == "undefined") start = 0;
        if (typeof end == "undefined") end = this.length;
        return iconv.decode(this.slice(start, end), encoding);
      };
      original.SlowBufferWrite = SlowBuffer.prototype.write;
      SlowBuffer.prototype.write = function(string, offset, length, encoding) {
        if (isFinite(offset)) {
          if (!isFinite(length)) {
            encoding = length;
            length = void 0;
          }
        } else {
          var swap = encoding;
          encoding = offset;
          offset = length;
          length = swap;
        }
        offset = +offset || 0;
        var remaining = this.length - offset;
        if (!length) {
          length = remaining;
        } else {
          length = +length;
          if (length > remaining) {
            length = remaining;
          }
        }
        encoding = String(encoding || "utf8").toLowerCase();
        if (Buffer2.isNativeEncoding(encoding))
          return original.SlowBufferWrite.call(this, string, offset, length, encoding);
        if (string.length > 0 && (length < 0 || offset < 0))
          throw new RangeError("attempt to write beyond buffer bounds");
        var buf = iconv.encode(string, encoding);
        if (buf.length < length) length = buf.length;
        buf.copy(this, offset, 0, length);
        return length;
      };
      original.BufferIsEncoding = Buffer2.isEncoding;
      Buffer2.isEncoding = function(encoding) {
        return Buffer2.isNativeEncoding(encoding) || iconv.encodingExists(encoding);
      };
      original.BufferByteLength = Buffer2.byteLength;
      Buffer2.byteLength = SlowBuffer.byteLength = function(str, encoding) {
        encoding = String(encoding || "utf8").toLowerCase();
        if (Buffer2.isNativeEncoding(encoding))
          return original.BufferByteLength.call(this, str, encoding);
        return iconv.encode(str, encoding).length;
      };
      original.BufferToString = Buffer2.prototype.toString;
      Buffer2.prototype.toString = function(encoding, start, end) {
        encoding = String(encoding || "utf8").toLowerCase();
        if (Buffer2.isNativeEncoding(encoding))
          return original.BufferToString.call(this, encoding, start, end);
        if (typeof start == "undefined") start = 0;
        if (typeof end == "undefined") end = this.length;
        return iconv.decode(this.slice(start, end), encoding);
      };
      original.BufferWrite = Buffer2.prototype.write;
      Buffer2.prototype.write = function(string, offset, length, encoding) {
        var _offset = offset, _length = length, _encoding = encoding;
        if (isFinite(offset)) {
          if (!isFinite(length)) {
            encoding = length;
            length = void 0;
          }
        } else {
          var swap = encoding;
          encoding = offset;
          offset = length;
          length = swap;
        }
        encoding = String(encoding || "utf8").toLowerCase();
        if (Buffer2.isNativeEncoding(encoding))
          return original.BufferWrite.call(this, string, _offset, _length, _encoding);
        offset = +offset || 0;
        var remaining = this.length - offset;
        if (!length) {
          length = remaining;
        } else {
          length = +length;
          if (length > remaining) {
            length = remaining;
          }
        }
        if (string.length > 0 && (length < 0 || offset < 0))
          throw new RangeError("attempt to write beyond buffer bounds");
        var buf = iconv.encode(string, encoding);
        if (buf.length < length) length = buf.length;
        buf.copy(this, offset, 0, length);
        return length;
      };
      if (iconv.supportsStreams) {
        var Readable = require$$1$2.Readable;
        original.ReadableSetEncoding = Readable.prototype.setEncoding;
        Readable.prototype.setEncoding = function setEncoding(enc, options) {
          this._readableState.decoder = iconv.getDecoder(enc, options);
          this._readableState.encoding = enc;
        };
        Readable.prototype.collect = iconv._collect;
      }
    };
    iconv.undoExtendNodeEncodings = function undoExtendNodeEncodings() {
      if (!iconv.supportsNodeEncodingsExtension)
        return;
      if (!original)
        throw new Error("require('iconv-lite').undoExtendNodeEncodings(): Nothing to undo; extendNodeEncodings() is not called.");
      delete Buffer2.isNativeEncoding;
      var SlowBuffer = require$$0$5.SlowBuffer;
      SlowBuffer.prototype.toString = original.SlowBufferToString;
      SlowBuffer.prototype.write = original.SlowBufferWrite;
      Buffer2.isEncoding = original.BufferIsEncoding;
      Buffer2.byteLength = original.BufferByteLength;
      Buffer2.prototype.toString = original.BufferToString;
      Buffer2.prototype.write = original.BufferWrite;
      if (iconv.supportsStreams) {
        var Readable = require$$1$2.Readable;
        Readable.prototype.setEncoding = original.ReadableSetEncoding;
        delete Readable.prototype.collect;
      }
      original = void 0;
    };
  };
  return extendNode;
}
var hasRequiredLib;
function requireLib() {
  if (hasRequiredLib) return lib.exports;
  hasRequiredLib = 1;
  (function(module2) {
    var Buffer2 = requireSafer().Buffer;
    var bomHandling2 = requireBomHandling(), iconv = module2.exports;
    iconv.encodings = null;
    iconv.defaultCharUnicode = "�";
    iconv.defaultCharSingleByte = "?";
    iconv.encode = function encode(str, encoding, options) {
      str = "" + (str || "");
      var encoder = iconv.getEncoder(encoding, options);
      var res = encoder.write(str);
      var trail = encoder.end();
      return trail && trail.length > 0 ? Buffer2.concat([res, trail]) : res;
    };
    iconv.decode = function decode(buf, encoding, options) {
      if (typeof buf === "string") {
        if (!iconv.skipDecodeWarning) {
          console.error("Iconv-lite warning: decode()-ing strings is deprecated. Refer to https://github.com/ashtuchkin/iconv-lite/wiki/Use-Buffers-when-decoding");
          iconv.skipDecodeWarning = true;
        }
        buf = Buffer2.from("" + (buf || ""), "binary");
      }
      var decoder = iconv.getDecoder(encoding, options);
      var res = decoder.write(buf);
      var trail = decoder.end();
      return trail ? res + trail : res;
    };
    iconv.encodingExists = function encodingExists(enc) {
      try {
        iconv.getCodec(enc);
        return true;
      } catch (e) {
        return false;
      }
    };
    iconv.toEncoding = iconv.encode;
    iconv.fromEncoding = iconv.decode;
    iconv._codecDataCache = {};
    iconv.getCodec = function getCodec(encoding) {
      if (!iconv.encodings)
        iconv.encodings = requireEncodings();
      var enc = iconv._canonicalizeEncoding(encoding);
      var codecOptions = {};
      while (true) {
        var codec = iconv._codecDataCache[enc];
        if (codec)
          return codec;
        var codecDef = iconv.encodings[enc];
        switch (typeof codecDef) {
          case "string":
            enc = codecDef;
            break;
          case "object":
            for (var key in codecDef)
              codecOptions[key] = codecDef[key];
            if (!codecOptions.encodingName)
              codecOptions.encodingName = enc;
            enc = codecDef.type;
            break;
          case "function":
            if (!codecOptions.encodingName)
              codecOptions.encodingName = enc;
            codec = new codecDef(codecOptions, iconv);
            iconv._codecDataCache[codecOptions.encodingName] = codec;
            return codec;
          default:
            throw new Error("Encoding not recognized: '" + encoding + "' (searched as: '" + enc + "')");
        }
      }
    };
    iconv._canonicalizeEncoding = function(encoding) {
      return ("" + encoding).toLowerCase().replace(/:\d{4}$|[^0-9a-z]/g, "");
    };
    iconv.getEncoder = function getEncoder(encoding, options) {
      var codec = iconv.getCodec(encoding), encoder = new codec.encoder(options, codec);
      if (codec.bomAware && options && options.addBOM)
        encoder = new bomHandling2.PrependBOM(encoder, options);
      return encoder;
    };
    iconv.getDecoder = function getDecoder(encoding, options) {
      var codec = iconv.getCodec(encoding), decoder = new codec.decoder(options, codec);
      if (codec.bomAware && !(options && options.stripBOM === false))
        decoder = new bomHandling2.StripBOM(decoder, options);
      return decoder;
    };
    var nodeVer = typeof process !== "undefined" && process.versions && process.versions.node;
    if (nodeVer) {
      var nodeVerArr = nodeVer.split(".").map(Number);
      if (nodeVerArr[0] > 0 || nodeVerArr[1] >= 10) {
        requireStreams()(iconv);
      }
      requireExtendNode()(iconv);
    }
  })(lib);
  return lib.exports;
}
var tmp = {};
var osTmpdir;
var hasRequiredOsTmpdir;
function requireOsTmpdir() {
  if (hasRequiredOsTmpdir) return osTmpdir;
  hasRequiredOsTmpdir = 1;
  var isWindows = process.platform === "win32";
  var trailingSlashRe = isWindows ? /[^:]\\$/ : /.\/$/;
  osTmpdir = function() {
    var path2;
    if (isWindows) {
      path2 = process.env.TEMP || process.env.TMP || (process.env.SystemRoot || process.env.windir) + "\\temp";
    } else {
      path2 = process.env.TMPDIR || process.env.TMP || process.env.TEMP || "/tmp";
    }
    if (trailingSlashRe.test(path2)) {
      path2 = path2.slice(0, -1);
    }
    return path2;
  };
  return osTmpdir;
}
/*!
 * Tmp
 *
 * Copyright (c) 2011-2017 KARASZI Istvan <github@spam.raszi.hu>
 *
 * MIT Licensed
 */
var hasRequiredTmp;
function requireTmp() {
  if (hasRequiredTmp) return tmp;
  hasRequiredTmp = 1;
  const fs$1 = fs;
  const path$1 = path;
  const crypto = require$$2$2;
  const osTmpDir = requireOsTmpdir();
  const _c = process.binding("constants");
  const tmpDir = osTmpDir(), RANDOM_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", TEMPLATE_PATTERN = /XXXXXX/, DEFAULT_TRIES = 3, CREATE_FLAGS = (_c.O_CREAT || _c.fs.O_CREAT) | (_c.O_EXCL || _c.fs.O_EXCL) | (_c.O_RDWR || _c.fs.O_RDWR), EBADF = _c.EBADF || _c.os.errno.EBADF, ENOENT = _c.ENOENT || _c.os.errno.ENOENT, DIR_MODE = 448, FILE_MODE = 384, _removeObjects = [];
  var _gracefulCleanup = false, _uncaughtException = false;
  function _randomChars(howMany) {
    var value = [], rnd = null;
    try {
      rnd = crypto.randomBytes(howMany);
    } catch (e) {
      rnd = crypto.pseudoRandomBytes(howMany);
    }
    for (var i = 0; i < howMany; i++) {
      value.push(RANDOM_CHARS[rnd[i] % RANDOM_CHARS.length]);
    }
    return value.join("");
  }
  function _isUndefined(obj) {
    return typeof obj === "undefined";
  }
  function _parseArguments(options, callback) {
    if (typeof options == "function") {
      return [callback || {}, options];
    }
    if (_isUndefined(options)) {
      return [{}, callback];
    }
    return [options, callback];
  }
  function _generateTmpName(opts) {
    if (opts.name) {
      return path$1.join(opts.dir || tmpDir, opts.name);
    }
    if (opts.template) {
      return opts.template.replace(TEMPLATE_PATTERN, _randomChars(6));
    }
    const name = [
      opts.prefix || "tmp-",
      process.pid,
      _randomChars(12),
      opts.postfix || ""
    ].join("");
    return path$1.join(opts.dir || tmpDir, name);
  }
  function tmpName(options, callback) {
    var args2 = _parseArguments(options, callback), opts = args2[0], cb = args2[1], tries = opts.name ? 1 : opts.tries || DEFAULT_TRIES;
    if (isNaN(tries) || tries < 0)
      return cb(new Error("Invalid tries"));
    if (opts.template && !opts.template.match(TEMPLATE_PATTERN))
      return cb(new Error("Invalid template provided"));
    (function _getUniqueName() {
      const name = _generateTmpName(opts);
      fs$1.stat(name, function(err) {
        if (!err) {
          if (tries-- > 0) return _getUniqueName();
          return cb(new Error("Could not get a unique tmp filename, max tries reached " + name));
        }
        cb(null, name);
      });
    })();
  }
  function tmpNameSync(options) {
    var args2 = _parseArguments(options), opts = args2[0], tries = opts.name ? 1 : opts.tries || DEFAULT_TRIES;
    if (isNaN(tries) || tries < 0)
      throw new Error("Invalid tries");
    if (opts.template && !opts.template.match(TEMPLATE_PATTERN))
      throw new Error("Invalid template provided");
    do {
      const name = _generateTmpName(opts);
      try {
        fs$1.statSync(name);
      } catch (e) {
        return name;
      }
    } while (tries-- > 0);
    throw new Error("Could not get a unique tmp filename, max tries reached");
  }
  function file(options, callback) {
    var args2 = _parseArguments(options, callback), opts = args2[0], cb = args2[1];
    opts.postfix = _isUndefined(opts.postfix) ? ".tmp" : opts.postfix;
    tmpName(opts, function _tmpNameCreated(err, name) {
      if (err) return cb(err);
      fs$1.open(name, CREATE_FLAGS, opts.mode || FILE_MODE, function _fileCreated(err2, fd) {
        if (err2) return cb(err2);
        if (opts.discardDescriptor) {
          return fs$1.close(fd, function _discardCallback(err3) {
            if (err3) {
              try {
                fs$1.unlinkSync(name);
              } catch (e) {
                if (!isENOENT(e)) {
                  err3 = e;
                }
              }
              return cb(err3);
            }
            cb(null, name, void 0, _prepareTmpFileRemoveCallback(name, -1, opts));
          });
        }
        if (opts.detachDescriptor) {
          return cb(null, name, fd, _prepareTmpFileRemoveCallback(name, -1, opts));
        }
        cb(null, name, fd, _prepareTmpFileRemoveCallback(name, fd, opts));
      });
    });
  }
  function fileSync(options) {
    var args2 = _parseArguments(options), opts = args2[0];
    opts.postfix = opts.postfix || ".tmp";
    const discardOrDetachDescriptor = opts.discardDescriptor || opts.detachDescriptor;
    const name = tmpNameSync(opts);
    var fd = fs$1.openSync(name, CREATE_FLAGS, opts.mode || FILE_MODE);
    if (opts.discardDescriptor) {
      fs$1.closeSync(fd);
      fd = void 0;
    }
    return {
      name,
      fd,
      removeCallback: _prepareTmpFileRemoveCallback(name, discardOrDetachDescriptor ? -1 : fd, opts)
    };
  }
  function _rmdirRecursiveSync(root) {
    const dirs = [root];
    do {
      var dir2 = dirs.pop(), deferred = false, files = fs$1.readdirSync(dir2);
      for (var i = 0, length = files.length; i < length; i++) {
        var file2 = path$1.join(dir2, files[i]), stat = fs$1.lstatSync(file2);
        if (stat.isDirectory()) {
          if (!deferred) {
            deferred = true;
            dirs.push(dir2);
          }
          dirs.push(file2);
        } else {
          fs$1.unlinkSync(file2);
        }
      }
      if (!deferred) {
        fs$1.rmdirSync(dir2);
      }
    } while (dirs.length !== 0);
  }
  function dir(options, callback) {
    var args2 = _parseArguments(options, callback), opts = args2[0], cb = args2[1];
    tmpName(opts, function _tmpNameCreated(err, name) {
      if (err) return cb(err);
      fs$1.mkdir(name, opts.mode || DIR_MODE, function _dirCreated(err2) {
        if (err2) return cb(err2);
        cb(null, name, _prepareTmpDirRemoveCallback(name, opts));
      });
    });
  }
  function dirSync(options) {
    var args2 = _parseArguments(options), opts = args2[0];
    const name = tmpNameSync(opts);
    fs$1.mkdirSync(name, opts.mode || DIR_MODE);
    return {
      name,
      removeCallback: _prepareTmpDirRemoveCallback(name, opts)
    };
  }
  function _prepareTmpFileRemoveCallback(name, fd, opts) {
    const removeCallback = _prepareRemoveCallback(function _removeCallback(fdPath) {
      try {
        if (0 <= fdPath[0]) {
          fs$1.closeSync(fdPath[0]);
        }
      } catch (e) {
        if (!isEBADF(e) && !isENOENT(e)) {
          throw e;
        }
      }
      try {
        fs$1.unlinkSync(fdPath[1]);
      } catch (e) {
        if (!isENOENT(e)) {
          throw e;
        }
      }
    }, [fd, name]);
    if (!opts.keep) {
      _removeObjects.unshift(removeCallback);
    }
    return removeCallback;
  }
  function _prepareTmpDirRemoveCallback(name, opts) {
    const removeFunction = opts.unsafeCleanup ? _rmdirRecursiveSync : fs$1.rmdirSync.bind(fs$1);
    const removeCallback = _prepareRemoveCallback(removeFunction, name);
    if (!opts.keep) {
      _removeObjects.unshift(removeCallback);
    }
    return removeCallback;
  }
  function _prepareRemoveCallback(removeFunction, arg) {
    var called = false;
    return function _cleanupCallback(next) {
      if (!called) {
        const index = _removeObjects.indexOf(_cleanupCallback);
        if (index >= 0) {
          _removeObjects.splice(index, 1);
        }
        called = true;
        removeFunction(arg);
      }
      if (next) next(null);
    };
  }
  function _garbageCollector() {
    if (_uncaughtException && !_gracefulCleanup) {
      return;
    }
    while (_removeObjects.length) {
      try {
        _removeObjects[0].call(null);
      } catch (e) {
      }
    }
  }
  function isEBADF(error2) {
    return isExpectedError(error2, -EBADF, "EBADF");
  }
  function isENOENT(error2) {
    return isExpectedError(error2, -ENOENT, "ENOENT");
  }
  function isExpectedError(error2, code, errno) {
    return error2.code == code || error2.code == errno;
  }
  function setGracefulCleanup() {
    _gracefulCleanup = true;
  }
  const version2 = process.versions.node.split(".").map(function(value) {
    return parseInt(value, 10);
  });
  if (version2[0] === 0 && (version2[1] < 9 || version2[1] === 9 && version2[2] < 5)) {
    process.addListener("uncaughtException", function _uncaughtExceptionThrown(err) {
      _uncaughtException = true;
      _garbageCollector();
      throw err;
    });
  }
  process.addListener("exit", function _exit(code) {
    if (code) _uncaughtException = true;
    _garbageCollector();
  });
  tmp.tmpdir = tmpDir;
  tmp.dir = dir;
  tmp.dirSync = dirSync;
  tmp.file = file;
  tmp.fileSync = fileSync;
  tmp.tmpName = tmpName;
  tmp.tmpNameSync = tmpNameSync;
  tmp.setGracefulCleanup = setGracefulCleanup;
  return tmp;
}
var CreateFileError = {};
var hasRequiredCreateFileError;
function requireCreateFileError() {
  if (hasRequiredCreateFileError) return CreateFileError;
  hasRequiredCreateFileError = 1;
  var __extends = CreateFileError && CreateFileError.__extends || /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  Object.defineProperty(CreateFileError, "__esModule", { value: true });
  var CreateFileError$1 = (
    /** @class */
    function(_super) {
      __extends(CreateFileError2, _super);
      function CreateFileError2(originalError) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, "Failed to create temporary file for editor") || this;
        _this.originalError = originalError;
        var proto = _newTarget.prototype;
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(_this, proto);
        } else {
          _this.__proto__ = _newTarget.prototype;
        }
        return _this;
      }
      return CreateFileError2;
    }(Error)
  );
  CreateFileError.CreateFileError = CreateFileError$1;
  return CreateFileError;
}
var LaunchEditorError = {};
var hasRequiredLaunchEditorError;
function requireLaunchEditorError() {
  if (hasRequiredLaunchEditorError) return LaunchEditorError;
  hasRequiredLaunchEditorError = 1;
  var __extends = LaunchEditorError && LaunchEditorError.__extends || /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  Object.defineProperty(LaunchEditorError, "__esModule", { value: true });
  var LaunchEditorError$1 = (
    /** @class */
    function(_super) {
      __extends(LaunchEditorError2, _super);
      function LaunchEditorError2(originalError) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, "Failed launch editor") || this;
        _this.originalError = originalError;
        var proto = _newTarget.prototype;
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(_this, proto);
        } else {
          _this.__proto__ = _newTarget.prototype;
        }
        return _this;
      }
      return LaunchEditorError2;
    }(Error)
  );
  LaunchEditorError.LaunchEditorError = LaunchEditorError$1;
  return LaunchEditorError;
}
var ReadFileError = {};
var hasRequiredReadFileError;
function requireReadFileError() {
  if (hasRequiredReadFileError) return ReadFileError;
  hasRequiredReadFileError = 1;
  var __extends = ReadFileError && ReadFileError.__extends || /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  Object.defineProperty(ReadFileError, "__esModule", { value: true });
  var ReadFileError$1 = (
    /** @class */
    function(_super) {
      __extends(ReadFileError2, _super);
      function ReadFileError2(originalError) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, "Failed to read temporary file") || this;
        _this.originalError = originalError;
        var proto = _newTarget.prototype;
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(_this, proto);
        } else {
          _this.__proto__ = _newTarget.prototype;
        }
        return _this;
      }
      return ReadFileError2;
    }(Error)
  );
  ReadFileError.ReadFileError = ReadFileError$1;
  return ReadFileError;
}
var RemoveFileError = {};
var hasRequiredRemoveFileError;
function requireRemoveFileError() {
  if (hasRequiredRemoveFileError) return RemoveFileError;
  hasRequiredRemoveFileError = 1;
  var __extends = RemoveFileError && RemoveFileError.__extends || /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (b2.hasOwnProperty(p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  Object.defineProperty(RemoveFileError, "__esModule", { value: true });
  var RemoveFileError$1 = (
    /** @class */
    function(_super) {
      __extends(RemoveFileError2, _super);
      function RemoveFileError2(originalError) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, "Failed to cleanup temporary file") || this;
        _this.originalError = originalError;
        var proto = _newTarget.prototype;
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(_this, proto);
        } else {
          _this.__proto__ = _newTarget.prototype;
        }
        return _this;
      }
      return RemoveFileError2;
    }(Error)
  );
  RemoveFileError.RemoveFileError = RemoveFileError$1;
  return RemoveFileError;
}
var hasRequiredMain;
function requireMain() {
  if (hasRequiredMain) return main;
  hasRequiredMain = 1;
  Object.defineProperty(main, "__esModule", { value: true });
  var chardet_1 = requireChardet();
  var child_process_1 = require$$1$4;
  var fs_1 = fs;
  var iconv_lite_1 = requireLib();
  var tmp_1 = requireTmp();
  var CreateFileError_1 = requireCreateFileError();
  main.CreateFileError = CreateFileError_1.CreateFileError;
  var LaunchEditorError_1 = requireLaunchEditorError();
  main.LaunchEditorError = LaunchEditorError_1.LaunchEditorError;
  var ReadFileError_1 = requireReadFileError();
  main.ReadFileError = ReadFileError_1.ReadFileError;
  var RemoveFileError_1 = requireRemoveFileError();
  main.RemoveFileError = RemoveFileError_1.RemoveFileError;
  function edit(text, fileOptions) {
    if (text === void 0) {
      text = "";
    }
    var editor2 = new ExternalEditor(text, fileOptions);
    editor2.run();
    editor2.cleanup();
    return editor2.text;
  }
  main.edit = edit;
  function editAsync(text, callback, fileOptions) {
    if (text === void 0) {
      text = "";
    }
    var editor2 = new ExternalEditor(text, fileOptions);
    editor2.runAsync(function(err, result) {
      if (err) {
        setImmediate(callback, err, null);
      } else {
        try {
          editor2.cleanup();
          setImmediate(callback, null, result);
        } catch (cleanupError) {
          setImmediate(callback, cleanupError, null);
        }
      }
    });
  }
  main.editAsync = editAsync;
  var ExternalEditor = (
    /** @class */
    function() {
      function ExternalEditor2(text, fileOptions) {
        if (text === void 0) {
          text = "";
        }
        this.text = "";
        this.fileOptions = {};
        this.text = text;
        if (fileOptions) {
          this.fileOptions = fileOptions;
        }
        this.determineEditor();
        this.createTemporaryFile();
      }
      ExternalEditor2.splitStringBySpace = function(str) {
        var pieces = [];
        var currentString = "";
        for (var strIndex = 0; strIndex < str.length; strIndex++) {
          var currentLetter = str[strIndex];
          if (strIndex > 0 && currentLetter === " " && str[strIndex - 1] !== "\\" && currentString.length > 0) {
            pieces.push(currentString);
            currentString = "";
          } else {
            currentString += currentLetter;
          }
        }
        if (currentString.length > 0) {
          pieces.push(currentString);
        }
        return pieces;
      };
      Object.defineProperty(ExternalEditor2.prototype, "temp_file", {
        get: function() {
          console.log("DEPRECATED: temp_file. Use tempFile moving forward.");
          return this.tempFile;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(ExternalEditor2.prototype, "last_exit_status", {
        get: function() {
          console.log("DEPRECATED: last_exit_status. Use lastExitStatus moving forward.");
          return this.lastExitStatus;
        },
        enumerable: true,
        configurable: true
      });
      ExternalEditor2.prototype.run = function() {
        this.launchEditor();
        this.readTemporaryFile();
        return this.text;
      };
      ExternalEditor2.prototype.runAsync = function(callback) {
        var _this = this;
        try {
          this.launchEditorAsync(function() {
            try {
              _this.readTemporaryFile();
              setImmediate(callback, null, _this.text);
            } catch (readError) {
              setImmediate(callback, readError, null);
            }
          });
        } catch (launchError) {
          setImmediate(callback, launchError, null);
        }
      };
      ExternalEditor2.prototype.cleanup = function() {
        this.removeTemporaryFile();
      };
      ExternalEditor2.prototype.determineEditor = function() {
        var editor2 = process.env.VISUAL ? process.env.VISUAL : process.env.EDITOR ? process.env.EDITOR : /^win/.test(process.platform) ? "notepad" : "vim";
        var editorOpts = ExternalEditor2.splitStringBySpace(editor2).map(function(piece) {
          return piece.replace("\\ ", " ");
        });
        var bin = editorOpts.shift();
        this.editor = { args: editorOpts, bin };
      };
      ExternalEditor2.prototype.createTemporaryFile = function() {
        try {
          this.tempFile = tmp_1.tmpNameSync(this.fileOptions);
          var opt = { encoding: "utf8" };
          if (this.fileOptions.hasOwnProperty("mode")) {
            opt.mode = this.fileOptions.mode;
          }
          fs_1.writeFileSync(this.tempFile, this.text, opt);
        } catch (createFileError) {
          throw new CreateFileError_1.CreateFileError(createFileError);
        }
      };
      ExternalEditor2.prototype.readTemporaryFile = function() {
        try {
          var tempFileBuffer = fs_1.readFileSync(this.tempFile);
          if (tempFileBuffer.length === 0) {
            this.text = "";
          } else {
            var encoding = chardet_1.detect(tempFileBuffer).toString();
            if (!iconv_lite_1.encodingExists(encoding)) {
              encoding = "utf8";
            }
            this.text = iconv_lite_1.decode(tempFileBuffer, encoding);
          }
        } catch (readFileError) {
          throw new ReadFileError_1.ReadFileError(readFileError);
        }
      };
      ExternalEditor2.prototype.removeTemporaryFile = function() {
        try {
          fs_1.unlinkSync(this.tempFile);
        } catch (removeFileError) {
          throw new RemoveFileError_1.RemoveFileError(removeFileError);
        }
      };
      ExternalEditor2.prototype.launchEditor = function() {
        try {
          var editorProcess = child_process_1.spawnSync(this.editor.bin, this.editor.args.concat([this.tempFile]), { stdio: "inherit" });
          this.lastExitStatus = editorProcess.status;
        } catch (launchError) {
          throw new LaunchEditorError_1.LaunchEditorError(launchError);
        }
      };
      ExternalEditor2.prototype.launchEditorAsync = function(callback) {
        var _this = this;
        try {
          var editorProcess = child_process_1.spawn(this.editor.bin, this.editor.args.concat([this.tempFile]), { stdio: "inherit" });
          editorProcess.on("exit", function(code) {
            _this.lastExitStatus = code;
            setImmediate(callback);
          });
        } catch (launchError) {
          throw new LaunchEditorError_1.LaunchEditorError(launchError);
        }
      };
      return ExternalEditor2;
    }()
  );
  main.ExternalEditor = ExternalEditor;
  return main;
}
var mainExports = requireMain();
const editorTheme = {
  validationFailureMode: "keep"
};
const editor = createPrompt((config2, done) => {
  const { waitForUseInput = true, file: { postfix = config2.postfix ?? ".txt", ...fileProps } = {}, validate = () => true } = config2;
  const theme = makeTheme(editorTheme, config2.theme);
  const [status, setStatus] = useState("idle");
  const [value = "", setValue] = useState(config2.default);
  const [errorMsg, setError] = useState();
  const prefix = usePrefix({ status, theme });
  function startEditor(rl) {
    rl.pause();
    const editCallback = node_async_hooks.AsyncResource.bind(async (error3, answer) => {
      rl.resume();
      if (error3) {
        setError(error3.toString());
      } else {
        setStatus("loading");
        const isValid = await validate(answer);
        if (isValid === true) {
          setError(void 0);
          setStatus("done");
          done(answer);
        } else {
          if (theme.validationFailureMode === "clear") {
            setValue(config2.default);
          } else {
            setValue(answer);
          }
          setError(isValid || "You must provide a valid value");
          setStatus("idle");
        }
      }
    });
    mainExports.editAsync(value, (error3, answer) => void editCallback(error3, answer), {
      postfix,
      ...fileProps
    });
  }
  useEffect((rl) => {
    if (!waitForUseInput) {
      startEditor(rl);
    }
  }, []);
  useKeypress((key, rl) => {
    if (status !== "idle") {
      return;
    }
    if (isEnterKey(key)) {
      startEditor(rl);
    }
  });
  const message = theme.style.message(config2.message, status);
  let helpTip = "";
  if (status === "loading") {
    helpTip = theme.style.help("Received");
  } else if (status === "idle") {
    const enterKey = theme.style.key("enter");
    helpTip = theme.style.help(`Press ${enterKey} to launch your preferred editor.`);
  }
  let error2 = "";
  if (errorMsg) {
    error2 = theme.style.error(errorMsg);
  }
  return [[prefix, message, helpTip].filter(Boolean).join(" "), error2];
});
function getBooleanValue(value, defaultValue) {
  let answer = defaultValue !== false;
  if (/^(y|yes)/i.test(value))
    answer = true;
  else if (/^(n|no)/i.test(value))
    answer = false;
  return answer;
}
function boolToString(value) {
  return value ? "Yes" : "No";
}
const confirm = createPrompt((config2, done) => {
  const { transformer = boolToString } = config2;
  const [status, setStatus] = useState("idle");
  const [value, setValue] = useState("");
  const theme = makeTheme(config2.theme);
  const prefix = usePrefix({ status, theme });
  useKeypress((key, rl) => {
    if (isEnterKey(key)) {
      const answer = getBooleanValue(value, config2.default);
      setValue(transformer(answer));
      setStatus("done");
      done(answer);
    } else if (key.name === "tab") {
      const answer = boolToString(!getBooleanValue(value, config2.default));
      rl.clearLine(0);
      rl.write(answer);
      setValue(answer);
    } else {
      setValue(rl.line);
    }
  });
  let formattedValue = value;
  let defaultValue = "";
  if (status === "done") {
    formattedValue = theme.style.answer(value);
  } else {
    defaultValue = ` ${theme.style.defaultAnswer(config2.default === false ? "y/N" : "Y/n")}`;
  }
  const message = theme.style.message(config2.message, status);
  return `${prefix} ${message}${defaultValue} ${formattedValue}`;
});
const inputTheme = {
  validationFailureMode: "keep"
};
const input = createPrompt((config2, done) => {
  const { required, validate = () => true } = config2;
  const theme = makeTheme(inputTheme, config2.theme);
  const [status, setStatus] = useState("idle");
  const [defaultValue = "", setDefaultValue] = useState(config2.default);
  const [errorMsg, setError] = useState();
  const [value, setValue] = useState("");
  const prefix = usePrefix({ status, theme });
  useKeypress(async (key, rl) => {
    if (status !== "idle") {
      return;
    }
    if (isEnterKey(key)) {
      const answer = value || defaultValue;
      setStatus("loading");
      const isValid = required && !answer ? "You must provide a value" : await validate(answer);
      if (isValid === true) {
        setValue(answer);
        setStatus("done");
        done(answer);
      } else {
        if (theme.validationFailureMode === "clear") {
          setValue("");
        } else {
          rl.write(value);
        }
        setError(isValid || "You must provide a valid value");
        setStatus("idle");
      }
    } else if (isBackspaceKey(key) && !value) {
      setDefaultValue(void 0);
    } else if (key.name === "tab" && !value) {
      setDefaultValue(void 0);
      rl.clearLine(0);
      rl.write(defaultValue);
      setValue(defaultValue);
    } else {
      setValue(rl.line);
      setError(void 0);
    }
  });
  const message = theme.style.message(config2.message, status);
  let formattedValue = value;
  if (typeof config2.transformer === "function") {
    formattedValue = config2.transformer(value, { isFinal: status === "done" });
  } else if (status === "done") {
    formattedValue = theme.style.answer(value);
  }
  let defaultStr;
  if (defaultValue && status !== "done" && !value) {
    defaultStr = theme.style.defaultAnswer(defaultValue);
  }
  let error2 = "";
  if (errorMsg) {
    error2 = theme.style.error(errorMsg);
  }
  return [
    [prefix, message, defaultStr, formattedValue].filter((v) => v !== void 0).join(" "),
    error2
  ];
});
function isStepOf(value, step, min2) {
  const valuePow = value * Math.pow(10, 6);
  const stepPow = step * Math.pow(10, 6);
  const minPow = min2 * Math.pow(10, 6);
  return (valuePow - (Number.isFinite(min2) ? minPow : 0)) % stepPow === 0;
}
function validateNumber(value, { min: min2, max: max2, step }) {
  if (value == null || Number.isNaN(value)) {
    return false;
  } else if (value < min2 || value > max2) {
    return `Value must be between ${min2} and ${max2}`;
  } else if (step !== "any" && !isStepOf(value, step, min2)) {
    return `Value must be a multiple of ${step}${Number.isFinite(min2) ? ` starting from ${min2}` : ""}`;
  }
  return true;
}
const number = createPrompt((config2, done) => {
  const { validate = () => true, min: min2 = -Infinity, max: max2 = Infinity, step = 1, required = false } = config2;
  const theme = makeTheme(config2.theme);
  const [status, setStatus] = useState("idle");
  const [value, setValue] = useState("");
  const validDefault = validateNumber(config2.default, { min: min2, max: max2, step }) === true ? config2.default?.toString() : void 0;
  const [defaultValue = "", setDefaultValue] = useState(validDefault);
  const [errorMsg, setError] = useState();
  const prefix = usePrefix({ status, theme });
  useKeypress(async (key, rl) => {
    if (status !== "idle") {
      return;
    }
    if (isEnterKey(key)) {
      const input2 = value || defaultValue;
      const answer = input2 === "" ? void 0 : Number(input2);
      setStatus("loading");
      let isValid = true;
      if (required || answer != null) {
        isValid = validateNumber(answer, { min: min2, max: max2, step });
      }
      if (isValid === true) {
        isValid = await validate(answer);
      }
      if (isValid === true) {
        setValue(String(answer ?? ""));
        setStatus("done");
        done(answer);
      } else {
        rl.write(value);
        setError(isValid || "You must provide a valid numeric value");
        setStatus("idle");
      }
    } else if (isBackspaceKey(key) && !value) {
      setDefaultValue(void 0);
    } else if (key.name === "tab" && !value) {
      setDefaultValue(void 0);
      rl.clearLine(0);
      rl.write(defaultValue);
      setValue(defaultValue);
    } else {
      setValue(rl.line);
      setError(void 0);
    }
  });
  const message = theme.style.message(config2.message, status);
  let formattedValue = value;
  if (status === "done") {
    formattedValue = theme.style.answer(value);
  }
  let defaultStr;
  if (defaultValue && status !== "done" && !value) {
    defaultStr = theme.style.defaultAnswer(defaultValue);
  }
  let error2 = "";
  if (errorMsg) {
    error2 = theme.style.error(errorMsg);
  }
  return [
    [prefix, message, defaultStr, formattedValue].filter((v) => v !== void 0).join(" "),
    error2
  ];
});
function normalizeChoices$3(choices) {
  return choices.map((choice) => {
    if (Separator.isSeparator(choice)) {
      return choice;
    }
    const name = "name" in choice ? choice.name : String(choice.value);
    const value = "value" in choice ? choice.value : name;
    return {
      value,
      name,
      key: choice.key.toLowerCase()
    };
  });
}
const helpChoice = {
  key: "h",
  name: "Help, list all options",
  value: void 0
};
const expand$1 = createPrompt((config2, done) => {
  const { default: defaultKey = "h" } = config2;
  const choices = useMemo(() => normalizeChoices$3(config2.choices), [config2.choices]);
  const [status, setStatus] = useState("idle");
  const [value, setValue] = useState("");
  const [expanded, setExpanded] = useState(config2.expanded ?? false);
  const [errorMsg, setError] = useState();
  const theme = makeTheme(config2.theme);
  const prefix = usePrefix({ theme, status });
  useKeypress((event, rl) => {
    if (isEnterKey(event)) {
      const answer = (value || defaultKey).toLowerCase();
      if (answer === "h" && !expanded) {
        setExpanded(true);
      } else {
        const selectedChoice = choices.find((choice) => !Separator.isSeparator(choice) && choice.key === answer);
        if (selectedChoice) {
          setStatus("done");
          setValue(answer);
          done(selectedChoice.value);
        } else if (value === "") {
          setError("Please input a value");
        } else {
          setError(`"${colors.red(value)}" isn't an available option`);
        }
      }
    } else {
      setValue(rl.line);
      setError(void 0);
    }
  });
  const message = theme.style.message(config2.message, status);
  if (status === "done") {
    const selectedChoice = choices.find((choice) => !Separator.isSeparator(choice) && choice.key === value.toLowerCase());
    return `${prefix} ${message} ${theme.style.answer(selectedChoice.name)}`;
  }
  const allChoices = expanded ? choices : [...choices, helpChoice];
  let longChoices = "";
  let shortChoices = allChoices.map((choice) => {
    if (Separator.isSeparator(choice))
      return "";
    if (choice.key === defaultKey) {
      return choice.key.toUpperCase();
    }
    return choice.key;
  }).join("");
  shortChoices = ` ${theme.style.defaultAnswer(shortChoices)}`;
  if (expanded) {
    shortChoices = "";
    longChoices = allChoices.map((choice) => {
      if (Separator.isSeparator(choice)) {
        return ` ${choice.separator}`;
      }
      const line = `  ${choice.key}) ${choice.name}`;
      if (choice.key === value.toLowerCase()) {
        return theme.style.highlight(line);
      }
      return line;
    }).join("\n");
  }
  let helpTip = "";
  const currentOption = choices.find((choice) => !Separator.isSeparator(choice) && choice.key === value.toLowerCase());
  if (currentOption) {
    helpTip = `${colors.cyan(">>")} ${currentOption.name}`;
  }
  let error2 = "";
  if (errorMsg) {
    error2 = theme.style.error(errorMsg);
  }
  return [
    `${prefix} ${message}${shortChoices} ${value}`,
    [longChoices, helpTip, error2].filter(Boolean).join("\n")
  ];
});
const numberRegex = /\d+/;
function isSelectableChoice(choice) {
  return choice != null && !Separator.isSeparator(choice);
}
function normalizeChoices$2(choices) {
  let index = 0;
  return choices.map((choice) => {
    if (Separator.isSeparator(choice))
      return choice;
    index += 1;
    if (typeof choice === "string") {
      return {
        value: choice,
        name: choice,
        short: choice,
        key: String(index)
      };
    }
    const name = choice.name ?? String(choice.value);
    return {
      value: choice.value,
      name,
      short: choice.short ?? name,
      key: choice.key ?? String(index)
    };
  });
}
const rawlist = createPrompt((config2, done) => {
  const choices = useMemo(() => normalizeChoices$2(config2.choices), [config2.choices]);
  const [status, setStatus] = useState("idle");
  const [value, setValue] = useState("");
  const [errorMsg, setError] = useState();
  const theme = makeTheme(config2.theme);
  const prefix = usePrefix({ status, theme });
  useKeypress((key, rl) => {
    if (isEnterKey(key)) {
      let selectedChoice;
      if (numberRegex.test(value)) {
        const answer = Number.parseInt(value, 10) - 1;
        selectedChoice = choices.filter(isSelectableChoice)[answer];
      } else {
        selectedChoice = choices.find((choice) => isSelectableChoice(choice) && choice.key === value);
      }
      if (isSelectableChoice(selectedChoice)) {
        setValue(selectedChoice.short);
        setStatus("done");
        done(selectedChoice.value);
      } else if (value === "") {
        setError("Please input a value");
      } else {
        setError(`"${colors.red(value)}" isn't an available option`);
      }
    } else {
      setValue(rl.line);
      setError(void 0);
    }
  });
  const message = theme.style.message(config2.message, status);
  if (status === "done") {
    return `${prefix} ${message} ${theme.style.answer(value)}`;
  }
  const choicesStr = choices.map((choice) => {
    if (Separator.isSeparator(choice)) {
      return ` ${choice.separator}`;
    }
    const line = `  ${choice.key}) ${choice.name}`;
    if (choice.key === value.toLowerCase()) {
      return theme.style.highlight(line);
    }
    return line;
  }).join("\n");
  let error2 = "";
  if (errorMsg) {
    error2 = theme.style.error(errorMsg);
  }
  return [
    `${prefix} ${message} ${value}`,
    [choicesStr, error2].filter(Boolean).join("\n")
  ];
});
const password = createPrompt((config2, done) => {
  const { validate = () => true } = config2;
  const theme = makeTheme(config2.theme);
  const [status, setStatus] = useState("idle");
  const [errorMsg, setError] = useState();
  const [value, setValue] = useState("");
  const prefix = usePrefix({ status, theme });
  useKeypress(async (key, rl) => {
    if (status !== "idle") {
      return;
    }
    if (isEnterKey(key)) {
      const answer = value;
      setStatus("loading");
      const isValid = await validate(answer);
      if (isValid === true) {
        setValue(answer);
        setStatus("done");
        done(answer);
      } else {
        rl.write(value);
        setError(isValid || "You must provide a valid value");
        setStatus("idle");
      }
    } else {
      setValue(rl.line);
      setError(void 0);
    }
  });
  const message = theme.style.message(config2.message, status);
  let formattedValue = "";
  let helpTip;
  if (config2.mask) {
    const maskChar = typeof config2.mask === "string" ? config2.mask : "*";
    formattedValue = maskChar.repeat(value.length);
  } else if (status !== "done") {
    helpTip = `${theme.style.help("[input is masked]")}${ansiEscapes.cursorHide}`;
  }
  if (status === "done") {
    formattedValue = theme.style.answer(formattedValue);
  }
  let error2 = "";
  if (errorMsg) {
    error2 = theme.style.error(errorMsg);
  }
  return [[prefix, message, config2.mask ? formattedValue : helpTip].join(" "), error2];
});
const searchTheme = {
  icon: { cursor: figures.pointer },
  style: {
    disabled: (text) => colors.dim(`- ${text}`),
    searchTerm: (text) => colors.cyan(text),
    description: (text) => colors.cyan(text)
  },
  helpMode: "auto"
};
function isSelectable$1(item) {
  return !Separator.isSeparator(item) && !item.disabled;
}
function normalizeChoices$1(choices) {
  return choices.map((choice) => {
    if (Separator.isSeparator(choice))
      return choice;
    if (typeof choice === "string") {
      return {
        value: choice,
        name: choice,
        short: choice,
        disabled: false
      };
    }
    const name = choice.name ?? String(choice.value);
    return {
      value: choice.value,
      name,
      description: choice.description,
      short: choice.short ?? name,
      disabled: choice.disabled ?? false
    };
  });
}
const search = createPrompt((config2, done) => {
  const { pageSize = 7, validate = () => true } = config2;
  const theme = makeTheme(searchTheme, config2.theme);
  const firstRender = useRef(true);
  const [status, setStatus] = useState("loading");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState();
  const prefix = usePrefix({ status, theme });
  const bounds = useMemo(() => {
    const first2 = searchResults.findIndex(isSelectable$1);
    const last2 = searchResults.findLastIndex(isSelectable$1);
    return { first: first2, last: last2 };
  }, [searchResults]);
  const [active = bounds.first, setActive] = useState();
  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    setSearchError(void 0);
    const fetchResults = async () => {
      try {
        const results = await config2.source(searchTerm || void 0, {
          signal: controller.signal
        });
        if (!controller.signal.aborted) {
          setActive(void 0);
          setSearchError(void 0);
          setSearchResults(normalizeChoices$1(results));
          setStatus("idle");
        }
      } catch (error3) {
        if (!controller.signal.aborted && error3 instanceof Error) {
          setSearchError(error3.message);
        }
      }
    };
    void fetchResults();
    return () => {
      controller.abort();
    };
  }, [searchTerm]);
  const selectedChoice = searchResults[active];
  useKeypress(async (key, rl) => {
    if (isEnterKey(key)) {
      if (selectedChoice) {
        setStatus("loading");
        const isValid = await validate(selectedChoice.value);
        setStatus("idle");
        if (isValid === true) {
          setStatus("done");
          done(selectedChoice.value);
        } else if (selectedChoice.name === searchTerm) {
          setSearchError(isValid || "You must provide a valid value");
        } else {
          rl.write(selectedChoice.name);
          setSearchTerm(selectedChoice.name);
        }
      } else {
        rl.write(searchTerm);
      }
    } else if (key.name === "tab" && selectedChoice) {
      rl.clearLine(0);
      rl.write(selectedChoice.name);
      setSearchTerm(selectedChoice.name);
    } else if (status !== "loading" && (key.name === "up" || key.name === "down")) {
      rl.clearLine(0);
      if (key.name === "up" && active !== bounds.first || key.name === "down" && active !== bounds.last) {
        const offset = key.name === "up" ? -1 : 1;
        let next = active;
        do {
          next = (next + offset + searchResults.length) % searchResults.length;
        } while (!isSelectable$1(searchResults[next]));
        setActive(next);
      }
    } else {
      setSearchTerm(rl.line);
    }
  });
  const message = theme.style.message(config2.message, status);
  if (active > 0) {
    firstRender.current = false;
  }
  let helpTip = "";
  if (searchResults.length > 1 && (theme.helpMode === "always" || theme.helpMode === "auto" && firstRender.current)) {
    helpTip = searchResults.length > pageSize ? `
${theme.style.help("(Use arrow keys to reveal more choices)")}` : `
${theme.style.help("(Use arrow keys)")}`;
  }
  const page = usePagination({
    items: searchResults,
    active,
    renderItem({ item, isActive }) {
      if (Separator.isSeparator(item)) {
        return ` ${item.separator}`;
      }
      if (item.disabled) {
        const disabledLabel = typeof item.disabled === "string" ? item.disabled : "(disabled)";
        return theme.style.disabled(`${item.name} ${disabledLabel}`);
      }
      const color = isActive ? theme.style.highlight : (x) => x;
      const cursor = isActive ? theme.icon.cursor : ` `;
      return color(`${cursor} ${item.name}`);
    },
    pageSize,
    loop: false
  });
  let error2;
  if (searchError) {
    error2 = theme.style.error(searchError);
  } else if (searchResults.length === 0 && searchTerm !== "" && status === "idle") {
    error2 = theme.style.error("No results found");
  }
  let searchStr;
  if (status === "done" && selectedChoice) {
    const answer = selectedChoice.short;
    return `${prefix} ${message} ${theme.style.answer(answer)}`;
  } else {
    searchStr = theme.style.searchTerm(searchTerm);
  }
  const choiceDescription = selectedChoice?.description ? `
${theme.style.description(selectedChoice.description)}` : ``;
  return [
    [prefix, message, searchStr].filter(Boolean).join(" "),
    `${error2 ?? page}${helpTip}${choiceDescription}`
  ];
});
const selectTheme = {
  icon: { cursor: figures.pointer },
  style: {
    disabled: (text) => colors.dim(`- ${text}`),
    description: (text) => colors.cyan(text)
  },
  helpMode: "auto"
};
function isSelectable(item) {
  return !Separator.isSeparator(item) && !item.disabled;
}
function normalizeChoices(choices) {
  return choices.map((choice) => {
    if (Separator.isSeparator(choice))
      return choice;
    if (typeof choice === "string") {
      return {
        value: choice,
        name: choice,
        short: choice,
        disabled: false
      };
    }
    const name = choice.name ?? String(choice.value);
    return {
      value: choice.value,
      name,
      description: choice.description,
      short: choice.short ?? name,
      disabled: choice.disabled ?? false
    };
  });
}
const select = createPrompt((config2, done) => {
  const { loop = true, pageSize = 7 } = config2;
  const firstRender = useRef(true);
  const theme = makeTheme(selectTheme, config2.theme);
  const [status, setStatus] = useState("idle");
  const prefix = usePrefix({ status, theme });
  const searchTimeoutRef = useRef();
  const items = useMemo(() => normalizeChoices(config2.choices), [config2.choices]);
  const bounds = useMemo(() => {
    const first2 = items.findIndex(isSelectable);
    const last2 = items.findLastIndex(isSelectable);
    if (first2 === -1) {
      throw new ValidationError("[select prompt] No selectable choices. All choices are disabled.");
    }
    return { first: first2, last: last2 };
  }, [items]);
  const defaultItemIndex = useMemo(() => {
    if (!("default" in config2))
      return -1;
    return items.findIndex((item) => isSelectable(item) && item.value === config2.default);
  }, [config2.default, items]);
  const [active, setActive] = useState(defaultItemIndex === -1 ? bounds.first : defaultItemIndex);
  const selectedChoice = items[active];
  useKeypress((key, rl) => {
    clearTimeout(searchTimeoutRef.current);
    if (isEnterKey(key)) {
      setStatus("done");
      done(selectedChoice.value);
    } else if (isUpKey(key) || isDownKey(key)) {
      rl.clearLine(0);
      if (loop || isUpKey(key) && active !== bounds.first || isDownKey(key) && active !== bounds.last) {
        const offset = isUpKey(key) ? -1 : 1;
        let next = active;
        do {
          next = (next + offset + items.length) % items.length;
        } while (!isSelectable(items[next]));
        setActive(next);
      }
    } else if (isNumberKey(key)) {
      rl.clearLine(0);
      const position = Number(key.name) - 1;
      const item = items[position];
      if (item != null && isSelectable(item)) {
        setActive(position);
      }
    } else if (isBackspaceKey(key)) {
      rl.clearLine(0);
    } else {
      const searchTerm = rl.line.toLowerCase();
      const matchIndex = items.findIndex((item) => {
        if (Separator.isSeparator(item) || !isSelectable(item))
          return false;
        return item.name.toLowerCase().startsWith(searchTerm);
      });
      if (matchIndex !== -1) {
        setActive(matchIndex);
      }
      searchTimeoutRef.current = setTimeout(() => {
        rl.clearLine(0);
      }, 700);
    }
  });
  useEffect(() => () => {
    clearTimeout(searchTimeoutRef.current);
  }, []);
  const message = theme.style.message(config2.message, status);
  let helpTipTop = "";
  let helpTipBottom = "";
  if (theme.helpMode === "always" || theme.helpMode === "auto" && firstRender.current) {
    firstRender.current = false;
    if (items.length > pageSize) {
      helpTipBottom = `
${theme.style.help("(Use arrow keys to reveal more choices)")}`;
    } else {
      helpTipTop = theme.style.help("(Use arrow keys)");
    }
  }
  const page = usePagination({
    items,
    active,
    renderItem({ item, isActive }) {
      if (Separator.isSeparator(item)) {
        return ` ${item.separator}`;
      }
      if (item.disabled) {
        const disabledLabel = typeof item.disabled === "string" ? item.disabled : "(disabled)";
        return theme.style.disabled(`${item.name} ${disabledLabel}`);
      }
      const color = isActive ? theme.style.highlight : (x) => x;
      const cursor = isActive ? theme.icon.cursor : ` `;
      return color(`${cursor} ${item.name}`);
    },
    pageSize,
    loop
  });
  if (status === "done") {
    return `${prefix} ${message} ${theme.style.answer(selectedChoice.short)}`;
  }
  const choiceDescription = selectedChoice.description ? `
${theme.style.description(selectedChoice.description)}` : ``;
  return `${[prefix, message, helpTipTop].filter(Boolean).join(" ")}
${page}${helpTipBottom}${choiceDescription}${ansiEscapes.cursorHide}`;
});
var cjs = {};
var Observable = {};
var Subscriber = {};
var isFunction = {};
var hasRequiredIsFunction;
function requireIsFunction() {
  if (hasRequiredIsFunction) return isFunction;
  hasRequiredIsFunction = 1;
  Object.defineProperty(isFunction, "__esModule", { value: true });
  isFunction.isFunction = void 0;
  function isFunction$1(value) {
    return typeof value === "function";
  }
  isFunction.isFunction = isFunction$1;
  return isFunction;
}
var Subscription = {};
var UnsubscriptionError = {};
var createErrorClass = {};
var hasRequiredCreateErrorClass;
function requireCreateErrorClass() {
  if (hasRequiredCreateErrorClass) return createErrorClass;
  hasRequiredCreateErrorClass = 1;
  Object.defineProperty(createErrorClass, "__esModule", { value: true });
  createErrorClass.createErrorClass = void 0;
  function createErrorClass$1(createImpl) {
    var _super = function(instance) {
      Error.call(instance);
      instance.stack = new Error().stack;
    };
    var ctorFunc = createImpl(_super);
    ctorFunc.prototype = Object.create(Error.prototype);
    ctorFunc.prototype.constructor = ctorFunc;
    return ctorFunc;
  }
  createErrorClass.createErrorClass = createErrorClass$1;
  return createErrorClass;
}
var hasRequiredUnsubscriptionError;
function requireUnsubscriptionError() {
  if (hasRequiredUnsubscriptionError) return UnsubscriptionError;
  hasRequiredUnsubscriptionError = 1;
  Object.defineProperty(UnsubscriptionError, "__esModule", { value: true });
  UnsubscriptionError.UnsubscriptionError = void 0;
  var createErrorClass_1 = /* @__PURE__ */ requireCreateErrorClass();
  UnsubscriptionError.UnsubscriptionError = createErrorClass_1.createErrorClass(function(_super) {
    return function UnsubscriptionErrorImpl(errors) {
      _super(this);
      this.message = errors ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function(err, i) {
        return i + 1 + ") " + err.toString();
      }).join("\n  ") : "";
      this.name = "UnsubscriptionError";
      this.errors = errors;
    };
  });
  return UnsubscriptionError;
}
var arrRemove = {};
var hasRequiredArrRemove;
function requireArrRemove() {
  if (hasRequiredArrRemove) return arrRemove;
  hasRequiredArrRemove = 1;
  Object.defineProperty(arrRemove, "__esModule", { value: true });
  arrRemove.arrRemove = void 0;
  function arrRemove$1(arr, item) {
    if (arr) {
      var index = arr.indexOf(item);
      0 <= index && arr.splice(index, 1);
    }
  }
  arrRemove.arrRemove = arrRemove$1;
  return arrRemove;
}
var hasRequiredSubscription;
function requireSubscription() {
  if (hasRequiredSubscription) return Subscription;
  hasRequiredSubscription = 1;
  var __values = Subscription && Subscription.__values || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  var __read = Subscription && Subscription.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error2) {
      e = { error: error2 };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray = Subscription && Subscription.__spreadArray || function(to, from2) {
    for (var i = 0, il = from2.length, j = to.length; i < il; i++, j++)
      to[j] = from2[i];
    return to;
  };
  Object.defineProperty(Subscription, "__esModule", { value: true });
  Subscription.isSubscription = Subscription.EMPTY_SUBSCRIPTION = Subscription.Subscription = void 0;
  var isFunction_1 = /* @__PURE__ */ requireIsFunction();
  var UnsubscriptionError_1 = /* @__PURE__ */ requireUnsubscriptionError();
  var arrRemove_1 = /* @__PURE__ */ requireArrRemove();
  var Subscription$1 = function() {
    function Subscription2(initialTeardown) {
      this.initialTeardown = initialTeardown;
      this.closed = false;
      this._parentage = null;
      this._finalizers = null;
    }
    Subscription2.prototype.unsubscribe = function() {
      var e_1, _a, e_2, _b;
      var errors;
      if (!this.closed) {
        this.closed = true;
        var _parentage = this._parentage;
        if (_parentage) {
          this._parentage = null;
          if (Array.isArray(_parentage)) {
            try {
              for (var _parentage_1 = __values(_parentage), _parentage_1_1 = _parentage_1.next(); !_parentage_1_1.done; _parentage_1_1 = _parentage_1.next()) {
                var parent_1 = _parentage_1_1.value;
                parent_1.remove(this);
              }
            } catch (e_1_1) {
              e_1 = { error: e_1_1 };
            } finally {
              try {
                if (_parentage_1_1 && !_parentage_1_1.done && (_a = _parentage_1.return)) _a.call(_parentage_1);
              } finally {
                if (e_1) throw e_1.error;
              }
            }
          } else {
            _parentage.remove(this);
          }
        }
        var initialFinalizer = this.initialTeardown;
        if (isFunction_1.isFunction(initialFinalizer)) {
          try {
            initialFinalizer();
          } catch (e) {
            errors = e instanceof UnsubscriptionError_1.UnsubscriptionError ? e.errors : [e];
          }
        }
        var _finalizers = this._finalizers;
        if (_finalizers) {
          this._finalizers = null;
          try {
            for (var _finalizers_1 = __values(_finalizers), _finalizers_1_1 = _finalizers_1.next(); !_finalizers_1_1.done; _finalizers_1_1 = _finalizers_1.next()) {
              var finalizer = _finalizers_1_1.value;
              try {
                execFinalizer(finalizer);
              } catch (err) {
                errors = errors !== null && errors !== void 0 ? errors : [];
                if (err instanceof UnsubscriptionError_1.UnsubscriptionError) {
                  errors = __spreadArray(__spreadArray([], __read(errors)), __read(err.errors));
                } else {
                  errors.push(err);
                }
              }
            }
          } catch (e_2_1) {
            e_2 = { error: e_2_1 };
          } finally {
            try {
              if (_finalizers_1_1 && !_finalizers_1_1.done && (_b = _finalizers_1.return)) _b.call(_finalizers_1);
            } finally {
              if (e_2) throw e_2.error;
            }
          }
        }
        if (errors) {
          throw new UnsubscriptionError_1.UnsubscriptionError(errors);
        }
      }
    };
    Subscription2.prototype.add = function(teardown) {
      var _a;
      if (teardown && teardown !== this) {
        if (this.closed) {
          execFinalizer(teardown);
        } else {
          if (teardown instanceof Subscription2) {
            if (teardown.closed || teardown._hasParent(this)) {
              return;
            }
            teardown._addParent(this);
          }
          (this._finalizers = (_a = this._finalizers) !== null && _a !== void 0 ? _a : []).push(teardown);
        }
      }
    };
    Subscription2.prototype._hasParent = function(parent) {
      var _parentage = this._parentage;
      return _parentage === parent || Array.isArray(_parentage) && _parentage.includes(parent);
    };
    Subscription2.prototype._addParent = function(parent) {
      var _parentage = this._parentage;
      this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
    };
    Subscription2.prototype._removeParent = function(parent) {
      var _parentage = this._parentage;
      if (_parentage === parent) {
        this._parentage = null;
      } else if (Array.isArray(_parentage)) {
        arrRemove_1.arrRemove(_parentage, parent);
      }
    };
    Subscription2.prototype.remove = function(teardown) {
      var _finalizers = this._finalizers;
      _finalizers && arrRemove_1.arrRemove(_finalizers, teardown);
      if (teardown instanceof Subscription2) {
        teardown._removeParent(this);
      }
    };
    Subscription2.EMPTY = function() {
      var empty2 = new Subscription2();
      empty2.closed = true;
      return empty2;
    }();
    return Subscription2;
  }();
  Subscription.Subscription = Subscription$1;
  Subscription.EMPTY_SUBSCRIPTION = Subscription$1.EMPTY;
  function isSubscription(value) {
    return value instanceof Subscription$1 || value && "closed" in value && isFunction_1.isFunction(value.remove) && isFunction_1.isFunction(value.add) && isFunction_1.isFunction(value.unsubscribe);
  }
  Subscription.isSubscription = isSubscription;
  function execFinalizer(finalizer) {
    if (isFunction_1.isFunction(finalizer)) {
      finalizer();
    } else {
      finalizer.unsubscribe();
    }
  }
  return Subscription;
}
var config = {};
var hasRequiredConfig;
function requireConfig() {
  if (hasRequiredConfig) return config;
  hasRequiredConfig = 1;
  Object.defineProperty(config, "__esModule", { value: true });
  config.config = void 0;
  config.config = {
    onUnhandledError: null,
    onStoppedNotification: null,
    Promise: void 0,
    useDeprecatedSynchronousErrorHandling: false,
    useDeprecatedNextContext: false
  };
  return config;
}
var reportUnhandledError = {};
var timeoutProvider = {};
var hasRequiredTimeoutProvider;
function requireTimeoutProvider() {
  if (hasRequiredTimeoutProvider) return timeoutProvider;
  hasRequiredTimeoutProvider = 1;
  (function(exports2) {
    var __read = timeoutProvider && timeoutProvider.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m) return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
      } catch (error2) {
        e = { error: error2 };
      } finally {
        try {
          if (r && !r.done && (m = i["return"])) m.call(i);
        } finally {
          if (e) throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = timeoutProvider && timeoutProvider.__spreadArray || function(to, from2) {
      for (var i = 0, il = from2.length, j = to.length; i < il; i++, j++)
        to[j] = from2[i];
      return to;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.timeoutProvider = void 0;
    exports2.timeoutProvider = {
      setTimeout: function(handler, timeout2) {
        var args2 = [];
        for (var _i = 2; _i < arguments.length; _i++) {
          args2[_i - 2] = arguments[_i];
        }
        var delegate = exports2.timeoutProvider.delegate;
        if (delegate === null || delegate === void 0 ? void 0 : delegate.setTimeout) {
          return delegate.setTimeout.apply(delegate, __spreadArray([handler, timeout2], __read(args2)));
        }
        return setTimeout.apply(void 0, __spreadArray([handler, timeout2], __read(args2)));
      },
      clearTimeout: function(handle) {
        var delegate = exports2.timeoutProvider.delegate;
        return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout)(handle);
      },
      delegate: void 0
    };
  })(timeoutProvider);
  return timeoutProvider;
}
var hasRequiredReportUnhandledError;
function requireReportUnhandledError() {
  if (hasRequiredReportUnhandledError) return reportUnhandledError;
  hasRequiredReportUnhandledError = 1;
  Object.defineProperty(reportUnhandledError, "__esModule", { value: true });
  reportUnhandledError.reportUnhandledError = void 0;
  var config_1 = /* @__PURE__ */ requireConfig();
  var timeoutProvider_1 = /* @__PURE__ */ requireTimeoutProvider();
  function reportUnhandledError$1(err) {
    timeoutProvider_1.timeoutProvider.setTimeout(function() {
      var onUnhandledError = config_1.config.onUnhandledError;
      if (onUnhandledError) {
        onUnhandledError(err);
      } else {
        throw err;
      }
    });
  }
  reportUnhandledError.reportUnhandledError = reportUnhandledError$1;
  return reportUnhandledError;
}
var noop = {};
var hasRequiredNoop;
function requireNoop() {
  if (hasRequiredNoop) return noop;
  hasRequiredNoop = 1;
  Object.defineProperty(noop, "__esModule", { value: true });
  noop.noop = void 0;
  function noop$1() {
  }
  noop.noop = noop$1;
  return noop;
}
var NotificationFactories = {};
var hasRequiredNotificationFactories;
function requireNotificationFactories() {
  if (hasRequiredNotificationFactories) return NotificationFactories;
  hasRequiredNotificationFactories = 1;
  Object.defineProperty(NotificationFactories, "__esModule", { value: true });
  NotificationFactories.createNotification = NotificationFactories.nextNotification = NotificationFactories.errorNotification = NotificationFactories.COMPLETE_NOTIFICATION = void 0;
  NotificationFactories.COMPLETE_NOTIFICATION = function() {
    return createNotification("C", void 0, void 0);
  }();
  function errorNotification(error2) {
    return createNotification("E", void 0, error2);
  }
  NotificationFactories.errorNotification = errorNotification;
  function nextNotification(value) {
    return createNotification("N", value, void 0);
  }
  NotificationFactories.nextNotification = nextNotification;
  function createNotification(kind, value, error2) {
    return {
      kind,
      value,
      error: error2
    };
  }
  NotificationFactories.createNotification = createNotification;
  return NotificationFactories;
}
var errorContext = {};
var hasRequiredErrorContext;
function requireErrorContext() {
  if (hasRequiredErrorContext) return errorContext;
  hasRequiredErrorContext = 1;
  Object.defineProperty(errorContext, "__esModule", { value: true });
  errorContext.captureError = errorContext.errorContext = void 0;
  var config_1 = /* @__PURE__ */ requireConfig();
  var context = null;
  function errorContext$1(cb) {
    if (config_1.config.useDeprecatedSynchronousErrorHandling) {
      var isRoot = !context;
      if (isRoot) {
        context = { errorThrown: false, error: null };
      }
      cb();
      if (isRoot) {
        var _a = context, errorThrown = _a.errorThrown, error2 = _a.error;
        context = null;
        if (errorThrown) {
          throw error2;
        }
      }
    } else {
      cb();
    }
  }
  errorContext.errorContext = errorContext$1;
  function captureError(err) {
    if (config_1.config.useDeprecatedSynchronousErrorHandling && context) {
      context.errorThrown = true;
      context.error = err;
    }
  }
  errorContext.captureError = captureError;
  return errorContext;
}
var hasRequiredSubscriber;
function requireSubscriber() {
  if (hasRequiredSubscriber) return Subscriber;
  hasRequiredSubscriber = 1;
  (function(exports2) {
    var __extends = Subscriber && Subscriber.__extends || /* @__PURE__ */ function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
          d2.__proto__ = b2;
        } || function(d2, b2) {
          for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        if (typeof b !== "function" && b !== null)
          throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.EMPTY_OBSERVER = exports2.SafeSubscriber = exports2.Subscriber = void 0;
    var isFunction_1 = /* @__PURE__ */ requireIsFunction();
    var Subscription_1 = /* @__PURE__ */ requireSubscription();
    var config_1 = /* @__PURE__ */ requireConfig();
    var reportUnhandledError_1 = /* @__PURE__ */ requireReportUnhandledError();
    var noop_1 = /* @__PURE__ */ requireNoop();
    var NotificationFactories_1 = /* @__PURE__ */ requireNotificationFactories();
    var timeoutProvider_1 = /* @__PURE__ */ requireTimeoutProvider();
    var errorContext_1 = /* @__PURE__ */ requireErrorContext();
    var Subscriber$1 = function(_super) {
      __extends(Subscriber2, _super);
      function Subscriber2(destination) {
        var _this = _super.call(this) || this;
        _this.isStopped = false;
        if (destination) {
          _this.destination = destination;
          if (Subscription_1.isSubscription(destination)) {
            destination.add(_this);
          }
        } else {
          _this.destination = exports2.EMPTY_OBSERVER;
        }
        return _this;
      }
      Subscriber2.create = function(next, error2, complete) {
        return new SafeSubscriber(next, error2, complete);
      };
      Subscriber2.prototype.next = function(value) {
        if (this.isStopped) {
          handleStoppedNotification(NotificationFactories_1.nextNotification(value), this);
        } else {
          this._next(value);
        }
      };
      Subscriber2.prototype.error = function(err) {
        if (this.isStopped) {
          handleStoppedNotification(NotificationFactories_1.errorNotification(err), this);
        } else {
          this.isStopped = true;
          this._error(err);
        }
      };
      Subscriber2.prototype.complete = function() {
        if (this.isStopped) {
          handleStoppedNotification(NotificationFactories_1.COMPLETE_NOTIFICATION, this);
        } else {
          this.isStopped = true;
          this._complete();
        }
      };
      Subscriber2.prototype.unsubscribe = function() {
        if (!this.closed) {
          this.isStopped = true;
          _super.prototype.unsubscribe.call(this);
          this.destination = null;
        }
      };
      Subscriber2.prototype._next = function(value) {
        this.destination.next(value);
      };
      Subscriber2.prototype._error = function(err) {
        try {
          this.destination.error(err);
        } finally {
          this.unsubscribe();
        }
      };
      Subscriber2.prototype._complete = function() {
        try {
          this.destination.complete();
        } finally {
          this.unsubscribe();
        }
      };
      return Subscriber2;
    }(Subscription_1.Subscription);
    exports2.Subscriber = Subscriber$1;
    var _bind = Function.prototype.bind;
    function bind(fn, thisArg) {
      return _bind.call(fn, thisArg);
    }
    var ConsumerObserver = function() {
      function ConsumerObserver2(partialObserver) {
        this.partialObserver = partialObserver;
      }
      ConsumerObserver2.prototype.next = function(value) {
        var partialObserver = this.partialObserver;
        if (partialObserver.next) {
          try {
            partialObserver.next(value);
          } catch (error2) {
            handleUnhandledError(error2);
          }
        }
      };
      ConsumerObserver2.prototype.error = function(err) {
        var partialObserver = this.partialObserver;
        if (partialObserver.error) {
          try {
            partialObserver.error(err);
          } catch (error2) {
            handleUnhandledError(error2);
          }
        } else {
          handleUnhandledError(err);
        }
      };
      ConsumerObserver2.prototype.complete = function() {
        var partialObserver = this.partialObserver;
        if (partialObserver.complete) {
          try {
            partialObserver.complete();
          } catch (error2) {
            handleUnhandledError(error2);
          }
        }
      };
      return ConsumerObserver2;
    }();
    var SafeSubscriber = function(_super) {
      __extends(SafeSubscriber2, _super);
      function SafeSubscriber2(observerOrNext, error2, complete) {
        var _this = _super.call(this) || this;
        var partialObserver;
        if (isFunction_1.isFunction(observerOrNext) || !observerOrNext) {
          partialObserver = {
            next: observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : void 0,
            error: error2 !== null && error2 !== void 0 ? error2 : void 0,
            complete: complete !== null && complete !== void 0 ? complete : void 0
          };
        } else {
          var context_1;
          if (_this && config_1.config.useDeprecatedNextContext) {
            context_1 = Object.create(observerOrNext);
            context_1.unsubscribe = function() {
              return _this.unsubscribe();
            };
            partialObserver = {
              next: observerOrNext.next && bind(observerOrNext.next, context_1),
              error: observerOrNext.error && bind(observerOrNext.error, context_1),
              complete: observerOrNext.complete && bind(observerOrNext.complete, context_1)
            };
          } else {
            partialObserver = observerOrNext;
          }
        }
        _this.destination = new ConsumerObserver(partialObserver);
        return _this;
      }
      return SafeSubscriber2;
    }(Subscriber$1);
    exports2.SafeSubscriber = SafeSubscriber;
    function handleUnhandledError(error2) {
      if (config_1.config.useDeprecatedSynchronousErrorHandling) {
        errorContext_1.captureError(error2);
      } else {
        reportUnhandledError_1.reportUnhandledError(error2);
      }
    }
    function defaultErrorHandler(err) {
      throw err;
    }
    function handleStoppedNotification(notification, subscriber) {
      var onStoppedNotification = config_1.config.onStoppedNotification;
      onStoppedNotification && timeoutProvider_1.timeoutProvider.setTimeout(function() {
        return onStoppedNotification(notification, subscriber);
      });
    }
    exports2.EMPTY_OBSERVER = {
      closed: true,
      next: noop_1.noop,
      error: defaultErrorHandler,
      complete: noop_1.noop
    };
  })(Subscriber);
  return Subscriber;
}
var observable = {};
var hasRequiredObservable$1;
function requireObservable$1() {
  if (hasRequiredObservable$1) return observable;
  hasRequiredObservable$1 = 1;
  Object.defineProperty(observable, "__esModule", { value: true });
  observable.observable = void 0;
  observable.observable = function() {
    return typeof Symbol === "function" && Symbol.observable || "@@observable";
  }();
  return observable;
}
var pipe = {};
var identity = {};
var hasRequiredIdentity;
function requireIdentity() {
  if (hasRequiredIdentity) return identity;
  hasRequiredIdentity = 1;
  Object.defineProperty(identity, "__esModule", { value: true });
  identity.identity = void 0;
  function identity$1(x) {
    return x;
  }
  identity.identity = identity$1;
  return identity;
}
var hasRequiredPipe;
function requirePipe() {
  if (hasRequiredPipe) return pipe;
  hasRequiredPipe = 1;
  Object.defineProperty(pipe, "__esModule", { value: true });
  pipe.pipeFromArray = pipe.pipe = void 0;
  var identity_1 = /* @__PURE__ */ requireIdentity();
  function pipe$1() {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      fns[_i] = arguments[_i];
    }
    return pipeFromArray(fns);
  }
  pipe.pipe = pipe$1;
  function pipeFromArray(fns) {
    if (fns.length === 0) {
      return identity_1.identity;
    }
    if (fns.length === 1) {
      return fns[0];
    }
    return function piped(input2) {
      return fns.reduce(function(prev, fn) {
        return fn(prev);
      }, input2);
    };
  }
  pipe.pipeFromArray = pipeFromArray;
  return pipe;
}
var hasRequiredObservable;
function requireObservable() {
  if (hasRequiredObservable) return Observable;
  hasRequiredObservable = 1;
  Object.defineProperty(Observable, "__esModule", { value: true });
  Observable.Observable = void 0;
  var Subscriber_1 = /* @__PURE__ */ requireSubscriber();
  var Subscription_1 = /* @__PURE__ */ requireSubscription();
  var observable_1 = /* @__PURE__ */ requireObservable$1();
  var pipe_1 = /* @__PURE__ */ requirePipe();
  var config_1 = /* @__PURE__ */ requireConfig();
  var isFunction_1 = /* @__PURE__ */ requireIsFunction();
  var errorContext_1 = /* @__PURE__ */ requireErrorContext();
  var Observable$1 = function() {
    function Observable2(subscribe) {
      if (subscribe) {
        this._subscribe = subscribe;
      }
    }
    Observable2.prototype.lift = function(operator) {
      var observable2 = new Observable2();
      observable2.source = this;
      observable2.operator = operator;
      return observable2;
    };
    Observable2.prototype.subscribe = function(observerOrNext, error2, complete) {
      var _this = this;
      var subscriber = isSubscriber(observerOrNext) ? observerOrNext : new Subscriber_1.SafeSubscriber(observerOrNext, error2, complete);
      errorContext_1.errorContext(function() {
        var _a = _this, operator = _a.operator, source = _a.source;
        subscriber.add(operator ? operator.call(subscriber, source) : source ? _this._subscribe(subscriber) : _this._trySubscribe(subscriber));
      });
      return subscriber;
    };
    Observable2.prototype._trySubscribe = function(sink) {
      try {
        return this._subscribe(sink);
      } catch (err) {
        sink.error(err);
      }
    };
    Observable2.prototype.forEach = function(next, promiseCtor) {
      var _this = this;
      promiseCtor = getPromiseCtor(promiseCtor);
      return new promiseCtor(function(resolve, reject) {
        var subscriber = new Subscriber_1.SafeSubscriber({
          next: function(value) {
            try {
              next(value);
            } catch (err) {
              reject(err);
              subscriber.unsubscribe();
            }
          },
          error: reject,
          complete: resolve
        });
        _this.subscribe(subscriber);
      });
    };
    Observable2.prototype._subscribe = function(subscriber) {
      var _a;
      return (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber);
    };
    Observable2.prototype[observable_1.observable] = function() {
      return this;
    };
    Observable2.prototype.pipe = function() {
      var operations = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        operations[_i] = arguments[_i];
      }
      return pipe_1.pipeFromArray(operations)(this);
    };
    Observable2.prototype.toPromise = function(promiseCtor) {
      var _this = this;
      promiseCtor = getPromiseCtor(promiseCtor);
      return new promiseCtor(function(resolve, reject) {
        var value;
        _this.subscribe(function(x) {
          return value = x;
        }, function(err) {
          return reject(err);
        }, function() {
          return resolve(value);
        });
      });
    };
    Observable2.create = function(subscribe) {
      return new Observable2(subscribe);
    };
    return Observable2;
  }();
  Observable.Observable = Observable$1;
  function getPromiseCtor(promiseCtor) {
    var _a;
    return (_a = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config_1.config.Promise) !== null && _a !== void 0 ? _a : Promise;
  }
  function isObserver(value) {
    return value && isFunction_1.isFunction(value.next) && isFunction_1.isFunction(value.error) && isFunction_1.isFunction(value.complete);
  }
  function isSubscriber(value) {
    return value && value instanceof Subscriber_1.Subscriber || isObserver(value) && Subscription_1.isSubscription(value);
  }
  return Observable;
}
var ConnectableObservable = {};
var refCount = {};
var lift = {};
var hasRequiredLift;
function requireLift() {
  if (hasRequiredLift) return lift;
  hasRequiredLift = 1;
  Object.defineProperty(lift, "__esModule", { value: true });
  lift.operate = lift.hasLift = void 0;
  var isFunction_1 = /* @__PURE__ */ requireIsFunction();
  function hasLift(source) {
    return isFunction_1.isFunction(source === null || source === void 0 ? void 0 : source.lift);
  }
  lift.hasLift = hasLift;
  function operate(init) {
    return function(source) {
      if (hasLift(source)) {
        return source.lift(function(liftedSource) {
          try {
            return init(liftedSource, this);
          } catch (err) {
            this.error(err);
          }
        });
      }
      throw new TypeError("Unable to lift unknown Observable type");
    };
  }
  lift.operate = operate;
  return lift;
}
var OperatorSubscriber = {};
var hasRequiredOperatorSubscriber;
function requireOperatorSubscriber() {
  if (hasRequiredOperatorSubscriber) return OperatorSubscriber;
  hasRequiredOperatorSubscriber = 1;
  var __extends = OperatorSubscriber && OperatorSubscriber.__extends || /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  Object.defineProperty(OperatorSubscriber, "__esModule", { value: true });
  OperatorSubscriber.OperatorSubscriber = OperatorSubscriber.createOperatorSubscriber = void 0;
  var Subscriber_1 = /* @__PURE__ */ requireSubscriber();
  function createOperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
    return new OperatorSubscriber$1(destination, onNext, onComplete, onError, onFinalize);
  }
  OperatorSubscriber.createOperatorSubscriber = createOperatorSubscriber;
  var OperatorSubscriber$1 = function(_super) {
    __extends(OperatorSubscriber2, _super);
    function OperatorSubscriber2(destination, onNext, onComplete, onError, onFinalize, shouldUnsubscribe) {
      var _this = _super.call(this, destination) || this;
      _this.onFinalize = onFinalize;
      _this.shouldUnsubscribe = shouldUnsubscribe;
      _this._next = onNext ? function(value) {
        try {
          onNext(value);
        } catch (err) {
          destination.error(err);
        }
      } : _super.prototype._next;
      _this._error = onError ? function(err) {
        try {
          onError(err);
        } catch (err2) {
          destination.error(err2);
        } finally {
          this.unsubscribe();
        }
      } : _super.prototype._error;
      _this._complete = onComplete ? function() {
        try {
          onComplete();
        } catch (err) {
          destination.error(err);
        } finally {
          this.unsubscribe();
        }
      } : _super.prototype._complete;
      return _this;
    }
    OperatorSubscriber2.prototype.unsubscribe = function() {
      var _a;
      if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
        var closed_1 = this.closed;
        _super.prototype.unsubscribe.call(this);
        !closed_1 && ((_a = this.onFinalize) === null || _a === void 0 ? void 0 : _a.call(this));
      }
    };
    return OperatorSubscriber2;
  }(Subscriber_1.Subscriber);
  OperatorSubscriber.OperatorSubscriber = OperatorSubscriber$1;
  return OperatorSubscriber;
}
var hasRequiredRefCount;
function requireRefCount() {
  if (hasRequiredRefCount) return refCount;
  hasRequiredRefCount = 1;
  Object.defineProperty(refCount, "__esModule", { value: true });
  refCount.refCount = void 0;
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  function refCount$1() {
    return lift_1.operate(function(source, subscriber) {
      var connection = null;
      source._refCount++;
      var refCounter = OperatorSubscriber_1.createOperatorSubscriber(subscriber, void 0, void 0, void 0, function() {
        if (!source || source._refCount <= 0 || 0 < --source._refCount) {
          connection = null;
          return;
        }
        var sharedConnection = source._connection;
        var conn = connection;
        connection = null;
        if (sharedConnection && (!conn || sharedConnection === conn)) {
          sharedConnection.unsubscribe();
        }
        subscriber.unsubscribe();
      });
      source.subscribe(refCounter);
      if (!refCounter.closed) {
        connection = source.connect();
      }
    });
  }
  refCount.refCount = refCount$1;
  return refCount;
}
var hasRequiredConnectableObservable;
function requireConnectableObservable() {
  if (hasRequiredConnectableObservable) return ConnectableObservable;
  hasRequiredConnectableObservable = 1;
  var __extends = ConnectableObservable && ConnectableObservable.__extends || /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  Object.defineProperty(ConnectableObservable, "__esModule", { value: true });
  ConnectableObservable.ConnectableObservable = void 0;
  var Observable_1 = /* @__PURE__ */ requireObservable();
  var Subscription_1 = /* @__PURE__ */ requireSubscription();
  var refCount_1 = /* @__PURE__ */ requireRefCount();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  var lift_1 = /* @__PURE__ */ requireLift();
  var ConnectableObservable$1 = function(_super) {
    __extends(ConnectableObservable2, _super);
    function ConnectableObservable2(source, subjectFactory) {
      var _this = _super.call(this) || this;
      _this.source = source;
      _this.subjectFactory = subjectFactory;
      _this._subject = null;
      _this._refCount = 0;
      _this._connection = null;
      if (lift_1.hasLift(source)) {
        _this.lift = source.lift;
      }
      return _this;
    }
    ConnectableObservable2.prototype._subscribe = function(subscriber) {
      return this.getSubject().subscribe(subscriber);
    };
    ConnectableObservable2.prototype.getSubject = function() {
      var subject = this._subject;
      if (!subject || subject.isStopped) {
        this._subject = this.subjectFactory();
      }
      return this._subject;
    };
    ConnectableObservable2.prototype._teardown = function() {
      this._refCount = 0;
      var _connection = this._connection;
      this._subject = this._connection = null;
      _connection === null || _connection === void 0 ? void 0 : _connection.unsubscribe();
    };
    ConnectableObservable2.prototype.connect = function() {
      var _this = this;
      var connection = this._connection;
      if (!connection) {
        connection = this._connection = new Subscription_1.Subscription();
        var subject_1 = this.getSubject();
        connection.add(this.source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subject_1, void 0, function() {
          _this._teardown();
          subject_1.complete();
        }, function(err) {
          _this._teardown();
          subject_1.error(err);
        }, function() {
          return _this._teardown();
        })));
        if (connection.closed) {
          this._connection = null;
          connection = Subscription_1.Subscription.EMPTY;
        }
      }
      return connection;
    };
    ConnectableObservable2.prototype.refCount = function() {
      return refCount_1.refCount()(this);
    };
    return ConnectableObservable2;
  }(Observable_1.Observable);
  ConnectableObservable.ConnectableObservable = ConnectableObservable$1;
  return ConnectableObservable;
}
var animationFrames = {};
var performanceTimestampProvider = {};
var hasRequiredPerformanceTimestampProvider;
function requirePerformanceTimestampProvider() {
  if (hasRequiredPerformanceTimestampProvider) return performanceTimestampProvider;
  hasRequiredPerformanceTimestampProvider = 1;
  (function(exports2) {
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.performanceTimestampProvider = void 0;
    exports2.performanceTimestampProvider = {
      now: function() {
        return (exports2.performanceTimestampProvider.delegate || performance).now();
      },
      delegate: void 0
    };
  })(performanceTimestampProvider);
  return performanceTimestampProvider;
}
var animationFrameProvider = {};
var hasRequiredAnimationFrameProvider;
function requireAnimationFrameProvider() {
  if (hasRequiredAnimationFrameProvider) return animationFrameProvider;
  hasRequiredAnimationFrameProvider = 1;
  (function(exports2) {
    var __read = animationFrameProvider && animationFrameProvider.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m) return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
      } catch (error2) {
        e = { error: error2 };
      } finally {
        try {
          if (r && !r.done && (m = i["return"])) m.call(i);
        } finally {
          if (e) throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = animationFrameProvider && animationFrameProvider.__spreadArray || function(to, from2) {
      for (var i = 0, il = from2.length, j = to.length; i < il; i++, j++)
        to[j] = from2[i];
      return to;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.animationFrameProvider = void 0;
    var Subscription_1 = /* @__PURE__ */ requireSubscription();
    exports2.animationFrameProvider = {
      schedule: function(callback) {
        var request = requestAnimationFrame;
        var cancel = cancelAnimationFrame;
        var delegate = exports2.animationFrameProvider.delegate;
        if (delegate) {
          request = delegate.requestAnimationFrame;
          cancel = delegate.cancelAnimationFrame;
        }
        var handle = request(function(timestamp2) {
          cancel = void 0;
          callback(timestamp2);
        });
        return new Subscription_1.Subscription(function() {
          return cancel === null || cancel === void 0 ? void 0 : cancel(handle);
        });
      },
      requestAnimationFrame: function() {
        var args2 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args2[_i] = arguments[_i];
        }
        var delegate = exports2.animationFrameProvider.delegate;
        return ((delegate === null || delegate === void 0 ? void 0 : delegate.requestAnimationFrame) || requestAnimationFrame).apply(void 0, __spreadArray([], __read(args2)));
      },
      cancelAnimationFrame: function() {
        var args2 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args2[_i] = arguments[_i];
        }
        var delegate = exports2.animationFrameProvider.delegate;
        return ((delegate === null || delegate === void 0 ? void 0 : delegate.cancelAnimationFrame) || cancelAnimationFrame).apply(void 0, __spreadArray([], __read(args2)));
      },
      delegate: void 0
    };
  })(animationFrameProvider);
  return animationFrameProvider;
}
var hasRequiredAnimationFrames;
function requireAnimationFrames() {
  if (hasRequiredAnimationFrames) return animationFrames;
  hasRequiredAnimationFrames = 1;
  Object.defineProperty(animationFrames, "__esModule", { value: true });
  animationFrames.animationFrames = void 0;
  var Observable_1 = /* @__PURE__ */ requireObservable();
  var performanceTimestampProvider_1 = /* @__PURE__ */ requirePerformanceTimestampProvider();
  var animationFrameProvider_1 = /* @__PURE__ */ requireAnimationFrameProvider();
  function animationFrames$1(timestampProvider) {
    return timestampProvider ? animationFramesFactory(timestampProvider) : DEFAULT_ANIMATION_FRAMES;
  }
  animationFrames.animationFrames = animationFrames$1;
  function animationFramesFactory(timestampProvider) {
    return new Observable_1.Observable(function(subscriber) {
      var provider = timestampProvider || performanceTimestampProvider_1.performanceTimestampProvider;
      var start = provider.now();
      var id = 0;
      var run = function() {
        if (!subscriber.closed) {
          id = animationFrameProvider_1.animationFrameProvider.requestAnimationFrame(function(timestamp2) {
            id = 0;
            var now = provider.now();
            subscriber.next({
              timestamp: timestampProvider ? now : timestamp2,
              elapsed: now - start
            });
            run();
          });
        }
      };
      run();
      return function() {
        if (id) {
          animationFrameProvider_1.animationFrameProvider.cancelAnimationFrame(id);
        }
      };
    });
  }
  var DEFAULT_ANIMATION_FRAMES = animationFramesFactory();
  return animationFrames;
}
var Subject = {};
var ObjectUnsubscribedError = {};
var hasRequiredObjectUnsubscribedError;
function requireObjectUnsubscribedError() {
  if (hasRequiredObjectUnsubscribedError) return ObjectUnsubscribedError;
  hasRequiredObjectUnsubscribedError = 1;
  Object.defineProperty(ObjectUnsubscribedError, "__esModule", { value: true });
  ObjectUnsubscribedError.ObjectUnsubscribedError = void 0;
  var createErrorClass_1 = /* @__PURE__ */ requireCreateErrorClass();
  ObjectUnsubscribedError.ObjectUnsubscribedError = createErrorClass_1.createErrorClass(function(_super) {
    return function ObjectUnsubscribedErrorImpl() {
      _super(this);
      this.name = "ObjectUnsubscribedError";
      this.message = "object unsubscribed";
    };
  });
  return ObjectUnsubscribedError;
}
var hasRequiredSubject;
function requireSubject() {
  if (hasRequiredSubject) return Subject;
  hasRequiredSubject = 1;
  var __extends = Subject && Subject.__extends || /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  var __values = Subject && Subject.__values || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  Object.defineProperty(Subject, "__esModule", { value: true });
  Subject.AnonymousSubject = Subject.Subject = void 0;
  var Observable_1 = /* @__PURE__ */ requireObservable();
  var Subscription_1 = /* @__PURE__ */ requireSubscription();
  var ObjectUnsubscribedError_1 = /* @__PURE__ */ requireObjectUnsubscribedError();
  var arrRemove_1 = /* @__PURE__ */ requireArrRemove();
  var errorContext_1 = /* @__PURE__ */ requireErrorContext();
  var Subject$1 = function(_super) {
    __extends(Subject2, _super);
    function Subject2() {
      var _this = _super.call(this) || this;
      _this.closed = false;
      _this.currentObservers = null;
      _this.observers = [];
      _this.isStopped = false;
      _this.hasError = false;
      _this.thrownError = null;
      return _this;
    }
    Subject2.prototype.lift = function(operator) {
      var subject = new AnonymousSubject(this, this);
      subject.operator = operator;
      return subject;
    };
    Subject2.prototype._throwIfClosed = function() {
      if (this.closed) {
        throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
      }
    };
    Subject2.prototype.next = function(value) {
      var _this = this;
      errorContext_1.errorContext(function() {
        var e_1, _a;
        _this._throwIfClosed();
        if (!_this.isStopped) {
          if (!_this.currentObservers) {
            _this.currentObservers = Array.from(_this.observers);
          }
          try {
            for (var _b = __values(_this.currentObservers), _c = _b.next(); !_c.done; _c = _b.next()) {
              var observer = _c.value;
              observer.next(value);
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            } finally {
              if (e_1) throw e_1.error;
            }
          }
        }
      });
    };
    Subject2.prototype.error = function(err) {
      var _this = this;
      errorContext_1.errorContext(function() {
        _this._throwIfClosed();
        if (!_this.isStopped) {
          _this.hasError = _this.isStopped = true;
          _this.thrownError = err;
          var observers = _this.observers;
          while (observers.length) {
            observers.shift().error(err);
          }
        }
      });
    };
    Subject2.prototype.complete = function() {
      var _this = this;
      errorContext_1.errorContext(function() {
        _this._throwIfClosed();
        if (!_this.isStopped) {
          _this.isStopped = true;
          var observers = _this.observers;
          while (observers.length) {
            observers.shift().complete();
          }
        }
      });
    };
    Subject2.prototype.unsubscribe = function() {
      this.isStopped = this.closed = true;
      this.observers = this.currentObservers = null;
    };
    Object.defineProperty(Subject2.prototype, "observed", {
      get: function() {
        var _a;
        return ((_a = this.observers) === null || _a === void 0 ? void 0 : _a.length) > 0;
      },
      enumerable: false,
      configurable: true
    });
    Subject2.prototype._trySubscribe = function(subscriber) {
      this._throwIfClosed();
      return _super.prototype._trySubscribe.call(this, subscriber);
    };
    Subject2.prototype._subscribe = function(subscriber) {
      this._throwIfClosed();
      this._checkFinalizedStatuses(subscriber);
      return this._innerSubscribe(subscriber);
    };
    Subject2.prototype._innerSubscribe = function(subscriber) {
      var _this = this;
      var _a = this, hasError = _a.hasError, isStopped = _a.isStopped, observers = _a.observers;
      if (hasError || isStopped) {
        return Subscription_1.EMPTY_SUBSCRIPTION;
      }
      this.currentObservers = null;
      observers.push(subscriber);
      return new Subscription_1.Subscription(function() {
        _this.currentObservers = null;
        arrRemove_1.arrRemove(observers, subscriber);
      });
    };
    Subject2.prototype._checkFinalizedStatuses = function(subscriber) {
      var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, isStopped = _a.isStopped;
      if (hasError) {
        subscriber.error(thrownError);
      } else if (isStopped) {
        subscriber.complete();
      }
    };
    Subject2.prototype.asObservable = function() {
      var observable2 = new Observable_1.Observable();
      observable2.source = this;
      return observable2;
    };
    Subject2.create = function(destination, source) {
      return new AnonymousSubject(destination, source);
    };
    return Subject2;
  }(Observable_1.Observable);
  Subject.Subject = Subject$1;
  var AnonymousSubject = function(_super) {
    __extends(AnonymousSubject2, _super);
    function AnonymousSubject2(destination, source) {
      var _this = _super.call(this) || this;
      _this.destination = destination;
      _this.source = source;
      return _this;
    }
    AnonymousSubject2.prototype.next = function(value) {
      var _a, _b;
      (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.next) === null || _b === void 0 ? void 0 : _b.call(_a, value);
    };
    AnonymousSubject2.prototype.error = function(err) {
      var _a, _b;
      (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.call(_a, err);
    };
    AnonymousSubject2.prototype.complete = function() {
      var _a, _b;
      (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.complete) === null || _b === void 0 ? void 0 : _b.call(_a);
    };
    AnonymousSubject2.prototype._subscribe = function(subscriber) {
      var _a, _b;
      return (_b = (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber)) !== null && _b !== void 0 ? _b : Subscription_1.EMPTY_SUBSCRIPTION;
    };
    return AnonymousSubject2;
  }(Subject$1);
  Subject.AnonymousSubject = AnonymousSubject;
  return Subject;
}
var BehaviorSubject = {};
var hasRequiredBehaviorSubject;
function requireBehaviorSubject() {
  if (hasRequiredBehaviorSubject) return BehaviorSubject;
  hasRequiredBehaviorSubject = 1;
  var __extends = BehaviorSubject && BehaviorSubject.__extends || /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  Object.defineProperty(BehaviorSubject, "__esModule", { value: true });
  BehaviorSubject.BehaviorSubject = void 0;
  var Subject_1 = /* @__PURE__ */ requireSubject();
  var BehaviorSubject$1 = function(_super) {
    __extends(BehaviorSubject2, _super);
    function BehaviorSubject2(_value) {
      var _this = _super.call(this) || this;
      _this._value = _value;
      return _this;
    }
    Object.defineProperty(BehaviorSubject2.prototype, "value", {
      get: function() {
        return this.getValue();
      },
      enumerable: false,
      configurable: true
    });
    BehaviorSubject2.prototype._subscribe = function(subscriber) {
      var subscription = _super.prototype._subscribe.call(this, subscriber);
      !subscription.closed && subscriber.next(this._value);
      return subscription;
    };
    BehaviorSubject2.prototype.getValue = function() {
      var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, _value = _a._value;
      if (hasError) {
        throw thrownError;
      }
      this._throwIfClosed();
      return _value;
    };
    BehaviorSubject2.prototype.next = function(value) {
      _super.prototype.next.call(this, this._value = value);
    };
    return BehaviorSubject2;
  }(Subject_1.Subject);
  BehaviorSubject.BehaviorSubject = BehaviorSubject$1;
  return BehaviorSubject;
}
var ReplaySubject = {};
var dateTimestampProvider = {};
var hasRequiredDateTimestampProvider;
function requireDateTimestampProvider() {
  if (hasRequiredDateTimestampProvider) return dateTimestampProvider;
  hasRequiredDateTimestampProvider = 1;
  (function(exports2) {
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.dateTimestampProvider = void 0;
    exports2.dateTimestampProvider = {
      now: function() {
        return (exports2.dateTimestampProvider.delegate || Date).now();
      },
      delegate: void 0
    };
  })(dateTimestampProvider);
  return dateTimestampProvider;
}
var hasRequiredReplaySubject;
function requireReplaySubject() {
  if (hasRequiredReplaySubject) return ReplaySubject;
  hasRequiredReplaySubject = 1;
  var __extends = ReplaySubject && ReplaySubject.__extends || /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  Object.defineProperty(ReplaySubject, "__esModule", { value: true });
  ReplaySubject.ReplaySubject = void 0;
  var Subject_1 = /* @__PURE__ */ requireSubject();
  var dateTimestampProvider_1 = /* @__PURE__ */ requireDateTimestampProvider();
  var ReplaySubject$1 = function(_super) {
    __extends(ReplaySubject2, _super);
    function ReplaySubject2(_bufferSize, _windowTime, _timestampProvider) {
      if (_bufferSize === void 0) {
        _bufferSize = Infinity;
      }
      if (_windowTime === void 0) {
        _windowTime = Infinity;
      }
      if (_timestampProvider === void 0) {
        _timestampProvider = dateTimestampProvider_1.dateTimestampProvider;
      }
      var _this = _super.call(this) || this;
      _this._bufferSize = _bufferSize;
      _this._windowTime = _windowTime;
      _this._timestampProvider = _timestampProvider;
      _this._buffer = [];
      _this._infiniteTimeWindow = true;
      _this._infiniteTimeWindow = _windowTime === Infinity;
      _this._bufferSize = Math.max(1, _bufferSize);
      _this._windowTime = Math.max(1, _windowTime);
      return _this;
    }
    ReplaySubject2.prototype.next = function(value) {
      var _a = this, isStopped = _a.isStopped, _buffer = _a._buffer, _infiniteTimeWindow = _a._infiniteTimeWindow, _timestampProvider = _a._timestampProvider, _windowTime = _a._windowTime;
      if (!isStopped) {
        _buffer.push(value);
        !_infiniteTimeWindow && _buffer.push(_timestampProvider.now() + _windowTime);
      }
      this._trimBuffer();
      _super.prototype.next.call(this, value);
    };
    ReplaySubject2.prototype._subscribe = function(subscriber) {
      this._throwIfClosed();
      this._trimBuffer();
      var subscription = this._innerSubscribe(subscriber);
      var _a = this, _infiniteTimeWindow = _a._infiniteTimeWindow, _buffer = _a._buffer;
      var copy = _buffer.slice();
      for (var i = 0; i < copy.length && !subscriber.closed; i += _infiniteTimeWindow ? 1 : 2) {
        subscriber.next(copy[i]);
      }
      this._checkFinalizedStatuses(subscriber);
      return subscription;
    };
    ReplaySubject2.prototype._trimBuffer = function() {
      var _a = this, _bufferSize = _a._bufferSize, _timestampProvider = _a._timestampProvider, _buffer = _a._buffer, _infiniteTimeWindow = _a._infiniteTimeWindow;
      var adjustedBufferSize = (_infiniteTimeWindow ? 1 : 2) * _bufferSize;
      _bufferSize < Infinity && adjustedBufferSize < _buffer.length && _buffer.splice(0, _buffer.length - adjustedBufferSize);
      if (!_infiniteTimeWindow) {
        var now = _timestampProvider.now();
        var last2 = 0;
        for (var i = 1; i < _buffer.length && _buffer[i] <= now; i += 2) {
          last2 = i;
        }
        last2 && _buffer.splice(0, last2 + 1);
      }
    };
    return ReplaySubject2;
  }(Subject_1.Subject);
  ReplaySubject.ReplaySubject = ReplaySubject$1;
  return ReplaySubject;
}
var AsyncSubject = {};
var hasRequiredAsyncSubject;
function requireAsyncSubject() {
  if (hasRequiredAsyncSubject) return AsyncSubject;
  hasRequiredAsyncSubject = 1;
  var __extends = AsyncSubject && AsyncSubject.__extends || /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  Object.defineProperty(AsyncSubject, "__esModule", { value: true });
  AsyncSubject.AsyncSubject = void 0;
  var Subject_1 = /* @__PURE__ */ requireSubject();
  var AsyncSubject$1 = function(_super) {
    __extends(AsyncSubject2, _super);
    function AsyncSubject2() {
      var _this = _super !== null && _super.apply(this, arguments) || this;
      _this._value = null;
      _this._hasValue = false;
      _this._isComplete = false;
      return _this;
    }
    AsyncSubject2.prototype._checkFinalizedStatuses = function(subscriber) {
      var _a = this, hasError = _a.hasError, _hasValue = _a._hasValue, _value = _a._value, thrownError = _a.thrownError, isStopped = _a.isStopped, _isComplete = _a._isComplete;
      if (hasError) {
        subscriber.error(thrownError);
      } else if (isStopped || _isComplete) {
        _hasValue && subscriber.next(_value);
        subscriber.complete();
      }
    };
    AsyncSubject2.prototype.next = function(value) {
      if (!this.isStopped) {
        this._value = value;
        this._hasValue = true;
      }
    };
    AsyncSubject2.prototype.complete = function() {
      var _a = this, _hasValue = _a._hasValue, _value = _a._value, _isComplete = _a._isComplete;
      if (!_isComplete) {
        this._isComplete = true;
        _hasValue && _super.prototype.next.call(this, _value);
        _super.prototype.complete.call(this);
      }
    };
    return AsyncSubject2;
  }(Subject_1.Subject);
  AsyncSubject.AsyncSubject = AsyncSubject$1;
  return AsyncSubject;
}
var asap = {};
var AsapAction = {};
var AsyncAction = {};
var Action = {};
var hasRequiredAction;
function requireAction() {
  if (hasRequiredAction) return Action;
  hasRequiredAction = 1;
  var __extends = Action && Action.__extends || /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  Object.defineProperty(Action, "__esModule", { value: true });
  Action.Action = void 0;
  var Subscription_1 = /* @__PURE__ */ requireSubscription();
  var Action$1 = function(_super) {
    __extends(Action2, _super);
    function Action2(scheduler, work) {
      return _super.call(this) || this;
    }
    Action2.prototype.schedule = function(state, delay2) {
      return this;
    };
    return Action2;
  }(Subscription_1.Subscription);
  Action.Action = Action$1;
  return Action;
}
var intervalProvider = {};
var hasRequiredIntervalProvider;
function requireIntervalProvider() {
  if (hasRequiredIntervalProvider) return intervalProvider;
  hasRequiredIntervalProvider = 1;
  (function(exports2) {
    var __read = intervalProvider && intervalProvider.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m) return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
      } catch (error2) {
        e = { error: error2 };
      } finally {
        try {
          if (r && !r.done && (m = i["return"])) m.call(i);
        } finally {
          if (e) throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = intervalProvider && intervalProvider.__spreadArray || function(to, from2) {
      for (var i = 0, il = from2.length, j = to.length; i < il; i++, j++)
        to[j] = from2[i];
      return to;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.intervalProvider = void 0;
    exports2.intervalProvider = {
      setInterval: function(handler, timeout2) {
        var args2 = [];
        for (var _i = 2; _i < arguments.length; _i++) {
          args2[_i - 2] = arguments[_i];
        }
        var delegate = exports2.intervalProvider.delegate;
        if (delegate === null || delegate === void 0 ? void 0 : delegate.setInterval) {
          return delegate.setInterval.apply(delegate, __spreadArray([handler, timeout2], __read(args2)));
        }
        return setInterval.apply(void 0, __spreadArray([handler, timeout2], __read(args2)));
      },
      clearInterval: function(handle) {
        var delegate = exports2.intervalProvider.delegate;
        return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearInterval) || clearInterval)(handle);
      },
      delegate: void 0
    };
  })(intervalProvider);
  return intervalProvider;
}
var hasRequiredAsyncAction;
function requireAsyncAction() {
  if (hasRequiredAsyncAction) return AsyncAction;
  hasRequiredAsyncAction = 1;
  var __extends = AsyncAction && AsyncAction.__extends || /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  Object.defineProperty(AsyncAction, "__esModule", { value: true });
  AsyncAction.AsyncAction = void 0;
  var Action_1 = /* @__PURE__ */ requireAction();
  var intervalProvider_1 = /* @__PURE__ */ requireIntervalProvider();
  var arrRemove_1 = /* @__PURE__ */ requireArrRemove();
  var AsyncAction$1 = function(_super) {
    __extends(AsyncAction2, _super);
    function AsyncAction2(scheduler, work) {
      var _this = _super.call(this, scheduler, work) || this;
      _this.scheduler = scheduler;
      _this.work = work;
      _this.pending = false;
      return _this;
    }
    AsyncAction2.prototype.schedule = function(state, delay2) {
      var _a;
      if (delay2 === void 0) {
        delay2 = 0;
      }
      if (this.closed) {
        return this;
      }
      this.state = state;
      var id = this.id;
      var scheduler = this.scheduler;
      if (id != null) {
        this.id = this.recycleAsyncId(scheduler, id, delay2);
      }
      this.pending = true;
      this.delay = delay2;
      this.id = (_a = this.id) !== null && _a !== void 0 ? _a : this.requestAsyncId(scheduler, this.id, delay2);
      return this;
    };
    AsyncAction2.prototype.requestAsyncId = function(scheduler, _id, delay2) {
      if (delay2 === void 0) {
        delay2 = 0;
      }
      return intervalProvider_1.intervalProvider.setInterval(scheduler.flush.bind(scheduler, this), delay2);
    };
    AsyncAction2.prototype.recycleAsyncId = function(_scheduler, id, delay2) {
      if (delay2 === void 0) {
        delay2 = 0;
      }
      if (delay2 != null && this.delay === delay2 && this.pending === false) {
        return id;
      }
      if (id != null) {
        intervalProvider_1.intervalProvider.clearInterval(id);
      }
      return void 0;
    };
    AsyncAction2.prototype.execute = function(state, delay2) {
      if (this.closed) {
        return new Error("executing a cancelled action");
      }
      this.pending = false;
      var error2 = this._execute(state, delay2);
      if (error2) {
        return error2;
      } else if (this.pending === false && this.id != null) {
        this.id = this.recycleAsyncId(this.scheduler, this.id, null);
      }
    };
    AsyncAction2.prototype._execute = function(state, _delay) {
      var errored = false;
      var errorValue;
      try {
        this.work(state);
      } catch (e) {
        errored = true;
        errorValue = e ? e : new Error("Scheduled action threw falsy error");
      }
      if (errored) {
        this.unsubscribe();
        return errorValue;
      }
    };
    AsyncAction2.prototype.unsubscribe = function() {
      if (!this.closed) {
        var _a = this, id = _a.id, scheduler = _a.scheduler;
        var actions = scheduler.actions;
        this.work = this.state = this.scheduler = null;
        this.pending = false;
        arrRemove_1.arrRemove(actions, this);
        if (id != null) {
          this.id = this.recycleAsyncId(scheduler, id, null);
        }
        this.delay = null;
        _super.prototype.unsubscribe.call(this);
      }
    };
    return AsyncAction2;
  }(Action_1.Action);
  AsyncAction.AsyncAction = AsyncAction$1;
  return AsyncAction;
}
var immediateProvider = {};
var Immediate = {};
var hasRequiredImmediate;
function requireImmediate() {
  if (hasRequiredImmediate) return Immediate;
  hasRequiredImmediate = 1;
  Object.defineProperty(Immediate, "__esModule", { value: true });
  Immediate.TestTools = Immediate.Immediate = void 0;
  var nextHandle = 1;
  var resolved;
  var activeHandles = {};
  function findAndClearHandle(handle) {
    if (handle in activeHandles) {
      delete activeHandles[handle];
      return true;
    }
    return false;
  }
  Immediate.Immediate = {
    setImmediate: function(cb) {
      var handle = nextHandle++;
      activeHandles[handle] = true;
      if (!resolved) {
        resolved = Promise.resolve();
      }
      resolved.then(function() {
        return findAndClearHandle(handle) && cb();
      });
      return handle;
    },
    clearImmediate: function(handle) {
      findAndClearHandle(handle);
    }
  };
  Immediate.TestTools = {
    pending: function() {
      return Object.keys(activeHandles).length;
    }
  };
  return Immediate;
}
var hasRequiredImmediateProvider;
function requireImmediateProvider() {
  if (hasRequiredImmediateProvider) return immediateProvider;
  hasRequiredImmediateProvider = 1;
  (function(exports2) {
    var __read = immediateProvider && immediateProvider.__read || function(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m) return o;
      var i = m.call(o), r, ar = [], e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
      } catch (error2) {
        e = { error: error2 };
      } finally {
        try {
          if (r && !r.done && (m = i["return"])) m.call(i);
        } finally {
          if (e) throw e.error;
        }
      }
      return ar;
    };
    var __spreadArray = immediateProvider && immediateProvider.__spreadArray || function(to, from2) {
      for (var i = 0, il = from2.length, j = to.length; i < il; i++, j++)
        to[j] = from2[i];
      return to;
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.immediateProvider = void 0;
    var Immediate_1 = /* @__PURE__ */ requireImmediate();
    var setImmediate2 = Immediate_1.Immediate.setImmediate, clearImmediate = Immediate_1.Immediate.clearImmediate;
    exports2.immediateProvider = {
      setImmediate: function() {
        var args2 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args2[_i] = arguments[_i];
        }
        var delegate = exports2.immediateProvider.delegate;
        return ((delegate === null || delegate === void 0 ? void 0 : delegate.setImmediate) || setImmediate2).apply(void 0, __spreadArray([], __read(args2)));
      },
      clearImmediate: function(handle) {
        var delegate = exports2.immediateProvider.delegate;
        return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearImmediate) || clearImmediate)(handle);
      },
      delegate: void 0
    };
  })(immediateProvider);
  return immediateProvider;
}
var hasRequiredAsapAction;
function requireAsapAction() {
  if (hasRequiredAsapAction) return AsapAction;
  hasRequiredAsapAction = 1;
  var __extends = AsapAction && AsapAction.__extends || /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  Object.defineProperty(AsapAction, "__esModule", { value: true });
  AsapAction.AsapAction = void 0;
  var AsyncAction_1 = /* @__PURE__ */ requireAsyncAction();
  var immediateProvider_1 = /* @__PURE__ */ requireImmediateProvider();
  var AsapAction$1 = function(_super) {
    __extends(AsapAction2, _super);
    function AsapAction2(scheduler, work) {
      var _this = _super.call(this, scheduler, work) || this;
      _this.scheduler = scheduler;
      _this.work = work;
      return _this;
    }
    AsapAction2.prototype.requestAsyncId = function(scheduler, id, delay2) {
      if (delay2 === void 0) {
        delay2 = 0;
      }
      if (delay2 !== null && delay2 > 0) {
        return _super.prototype.requestAsyncId.call(this, scheduler, id, delay2);
      }
      scheduler.actions.push(this);
      return scheduler._scheduled || (scheduler._scheduled = immediateProvider_1.immediateProvider.setImmediate(scheduler.flush.bind(scheduler, void 0)));
    };
    AsapAction2.prototype.recycleAsyncId = function(scheduler, id, delay2) {
      var _a;
      if (delay2 === void 0) {
        delay2 = 0;
      }
      if (delay2 != null ? delay2 > 0 : this.delay > 0) {
        return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay2);
      }
      var actions = scheduler.actions;
      if (id != null && ((_a = actions[actions.length - 1]) === null || _a === void 0 ? void 0 : _a.id) !== id) {
        immediateProvider_1.immediateProvider.clearImmediate(id);
        if (scheduler._scheduled === id) {
          scheduler._scheduled = void 0;
        }
      }
      return void 0;
    };
    return AsapAction2;
  }(AsyncAction_1.AsyncAction);
  AsapAction.AsapAction = AsapAction$1;
  return AsapAction;
}
var AsapScheduler = {};
var AsyncScheduler = {};
var Scheduler = {};
var hasRequiredScheduler;
function requireScheduler() {
  if (hasRequiredScheduler) return Scheduler;
  hasRequiredScheduler = 1;
  Object.defineProperty(Scheduler, "__esModule", { value: true });
  Scheduler.Scheduler = void 0;
  var dateTimestampProvider_1 = /* @__PURE__ */ requireDateTimestampProvider();
  var Scheduler$1 = function() {
    function Scheduler2(schedulerActionCtor, now) {
      if (now === void 0) {
        now = Scheduler2.now;
      }
      this.schedulerActionCtor = schedulerActionCtor;
      this.now = now;
    }
    Scheduler2.prototype.schedule = function(work, delay2, state) {
      if (delay2 === void 0) {
        delay2 = 0;
      }
      return new this.schedulerActionCtor(this, work).schedule(state, delay2);
    };
    Scheduler2.now = dateTimestampProvider_1.dateTimestampProvider.now;
    return Scheduler2;
  }();
  Scheduler.Scheduler = Scheduler$1;
  return Scheduler;
}
var hasRequiredAsyncScheduler;
function requireAsyncScheduler() {
  if (hasRequiredAsyncScheduler) return AsyncScheduler;
  hasRequiredAsyncScheduler = 1;
  var __extends = AsyncScheduler && AsyncScheduler.__extends || /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  Object.defineProperty(AsyncScheduler, "__esModule", { value: true });
  AsyncScheduler.AsyncScheduler = void 0;
  var Scheduler_1 = /* @__PURE__ */ requireScheduler();
  var AsyncScheduler$1 = function(_super) {
    __extends(AsyncScheduler2, _super);
    function AsyncScheduler2(SchedulerAction, now) {
      if (now === void 0) {
        now = Scheduler_1.Scheduler.now;
      }
      var _this = _super.call(this, SchedulerAction, now) || this;
      _this.actions = [];
      _this._active = false;
      return _this;
    }
    AsyncScheduler2.prototype.flush = function(action) {
      var actions = this.actions;
      if (this._active) {
        actions.push(action);
        return;
      }
      var error2;
      this._active = true;
      do {
        if (error2 = action.execute(action.state, action.delay)) {
          break;
        }
      } while (action = actions.shift());
      this._active = false;
      if (error2) {
        while (action = actions.shift()) {
          action.unsubscribe();
        }
        throw error2;
      }
    };
    return AsyncScheduler2;
  }(Scheduler_1.Scheduler);
  AsyncScheduler.AsyncScheduler = AsyncScheduler$1;
  return AsyncScheduler;
}
var hasRequiredAsapScheduler;
function requireAsapScheduler() {
  if (hasRequiredAsapScheduler) return AsapScheduler;
  hasRequiredAsapScheduler = 1;
  var __extends = AsapScheduler && AsapScheduler.__extends || /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  Object.defineProperty(AsapScheduler, "__esModule", { value: true });
  AsapScheduler.AsapScheduler = void 0;
  var AsyncScheduler_1 = /* @__PURE__ */ requireAsyncScheduler();
  var AsapScheduler$1 = function(_super) {
    __extends(AsapScheduler2, _super);
    function AsapScheduler2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    AsapScheduler2.prototype.flush = function(action) {
      this._active = true;
      var flushId = this._scheduled;
      this._scheduled = void 0;
      var actions = this.actions;
      var error2;
      action = action || actions.shift();
      do {
        if (error2 = action.execute(action.state, action.delay)) {
          break;
        }
      } while ((action = actions[0]) && action.id === flushId && actions.shift());
      this._active = false;
      if (error2) {
        while ((action = actions[0]) && action.id === flushId && actions.shift()) {
          action.unsubscribe();
        }
        throw error2;
      }
    };
    return AsapScheduler2;
  }(AsyncScheduler_1.AsyncScheduler);
  AsapScheduler.AsapScheduler = AsapScheduler$1;
  return AsapScheduler;
}
var hasRequiredAsap;
function requireAsap() {
  if (hasRequiredAsap) return asap;
  hasRequiredAsap = 1;
  (function(exports2) {
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.asap = exports2.asapScheduler = void 0;
    var AsapAction_1 = /* @__PURE__ */ requireAsapAction();
    var AsapScheduler_1 = /* @__PURE__ */ requireAsapScheduler();
    exports2.asapScheduler = new AsapScheduler_1.AsapScheduler(AsapAction_1.AsapAction);
    exports2.asap = exports2.asapScheduler;
  })(asap);
  return asap;
}
var async = {};
var hasRequiredAsync;
function requireAsync() {
  if (hasRequiredAsync) return async;
  hasRequiredAsync = 1;
  (function(exports2) {
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.async = exports2.asyncScheduler = void 0;
    var AsyncAction_1 = /* @__PURE__ */ requireAsyncAction();
    var AsyncScheduler_1 = /* @__PURE__ */ requireAsyncScheduler();
    exports2.asyncScheduler = new AsyncScheduler_1.AsyncScheduler(AsyncAction_1.AsyncAction);
    exports2.async = exports2.asyncScheduler;
  })(async);
  return async;
}
var queue = {};
var QueueAction = {};
var hasRequiredQueueAction;
function requireQueueAction() {
  if (hasRequiredQueueAction) return QueueAction;
  hasRequiredQueueAction = 1;
  var __extends = QueueAction && QueueAction.__extends || /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  Object.defineProperty(QueueAction, "__esModule", { value: true });
  QueueAction.QueueAction = void 0;
  var AsyncAction_1 = /* @__PURE__ */ requireAsyncAction();
  var QueueAction$1 = function(_super) {
    __extends(QueueAction2, _super);
    function QueueAction2(scheduler, work) {
      var _this = _super.call(this, scheduler, work) || this;
      _this.scheduler = scheduler;
      _this.work = work;
      return _this;
    }
    QueueAction2.prototype.schedule = function(state, delay2) {
      if (delay2 === void 0) {
        delay2 = 0;
      }
      if (delay2 > 0) {
        return _super.prototype.schedule.call(this, state, delay2);
      }
      this.delay = delay2;
      this.state = state;
      this.scheduler.flush(this);
      return this;
    };
    QueueAction2.prototype.execute = function(state, delay2) {
      return delay2 > 0 || this.closed ? _super.prototype.execute.call(this, state, delay2) : this._execute(state, delay2);
    };
    QueueAction2.prototype.requestAsyncId = function(scheduler, id, delay2) {
      if (delay2 === void 0) {
        delay2 = 0;
      }
      if (delay2 != null && delay2 > 0 || delay2 == null && this.delay > 0) {
        return _super.prototype.requestAsyncId.call(this, scheduler, id, delay2);
      }
      scheduler.flush(this);
      return 0;
    };
    return QueueAction2;
  }(AsyncAction_1.AsyncAction);
  QueueAction.QueueAction = QueueAction$1;
  return QueueAction;
}
var QueueScheduler = {};
var hasRequiredQueueScheduler;
function requireQueueScheduler() {
  if (hasRequiredQueueScheduler) return QueueScheduler;
  hasRequiredQueueScheduler = 1;
  var __extends = QueueScheduler && QueueScheduler.__extends || /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  Object.defineProperty(QueueScheduler, "__esModule", { value: true });
  QueueScheduler.QueueScheduler = void 0;
  var AsyncScheduler_1 = /* @__PURE__ */ requireAsyncScheduler();
  var QueueScheduler$1 = function(_super) {
    __extends(QueueScheduler2, _super);
    function QueueScheduler2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    return QueueScheduler2;
  }(AsyncScheduler_1.AsyncScheduler);
  QueueScheduler.QueueScheduler = QueueScheduler$1;
  return QueueScheduler;
}
var hasRequiredQueue;
function requireQueue() {
  if (hasRequiredQueue) return queue;
  hasRequiredQueue = 1;
  (function(exports2) {
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.queue = exports2.queueScheduler = void 0;
    var QueueAction_1 = /* @__PURE__ */ requireQueueAction();
    var QueueScheduler_1 = /* @__PURE__ */ requireQueueScheduler();
    exports2.queueScheduler = new QueueScheduler_1.QueueScheduler(QueueAction_1.QueueAction);
    exports2.queue = exports2.queueScheduler;
  })(queue);
  return queue;
}
var animationFrame = {};
var AnimationFrameAction = {};
var hasRequiredAnimationFrameAction;
function requireAnimationFrameAction() {
  if (hasRequiredAnimationFrameAction) return AnimationFrameAction;
  hasRequiredAnimationFrameAction = 1;
  var __extends = AnimationFrameAction && AnimationFrameAction.__extends || /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  Object.defineProperty(AnimationFrameAction, "__esModule", { value: true });
  AnimationFrameAction.AnimationFrameAction = void 0;
  var AsyncAction_1 = /* @__PURE__ */ requireAsyncAction();
  var animationFrameProvider_1 = /* @__PURE__ */ requireAnimationFrameProvider();
  var AnimationFrameAction$1 = function(_super) {
    __extends(AnimationFrameAction2, _super);
    function AnimationFrameAction2(scheduler, work) {
      var _this = _super.call(this, scheduler, work) || this;
      _this.scheduler = scheduler;
      _this.work = work;
      return _this;
    }
    AnimationFrameAction2.prototype.requestAsyncId = function(scheduler, id, delay2) {
      if (delay2 === void 0) {
        delay2 = 0;
      }
      if (delay2 !== null && delay2 > 0) {
        return _super.prototype.requestAsyncId.call(this, scheduler, id, delay2);
      }
      scheduler.actions.push(this);
      return scheduler._scheduled || (scheduler._scheduled = animationFrameProvider_1.animationFrameProvider.requestAnimationFrame(function() {
        return scheduler.flush(void 0);
      }));
    };
    AnimationFrameAction2.prototype.recycleAsyncId = function(scheduler, id, delay2) {
      var _a;
      if (delay2 === void 0) {
        delay2 = 0;
      }
      if (delay2 != null ? delay2 > 0 : this.delay > 0) {
        return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay2);
      }
      var actions = scheduler.actions;
      if (id != null && id === scheduler._scheduled && ((_a = actions[actions.length - 1]) === null || _a === void 0 ? void 0 : _a.id) !== id) {
        animationFrameProvider_1.animationFrameProvider.cancelAnimationFrame(id);
        scheduler._scheduled = void 0;
      }
      return void 0;
    };
    return AnimationFrameAction2;
  }(AsyncAction_1.AsyncAction);
  AnimationFrameAction.AnimationFrameAction = AnimationFrameAction$1;
  return AnimationFrameAction;
}
var AnimationFrameScheduler = {};
var hasRequiredAnimationFrameScheduler;
function requireAnimationFrameScheduler() {
  if (hasRequiredAnimationFrameScheduler) return AnimationFrameScheduler;
  hasRequiredAnimationFrameScheduler = 1;
  var __extends = AnimationFrameScheduler && AnimationFrameScheduler.__extends || /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  Object.defineProperty(AnimationFrameScheduler, "__esModule", { value: true });
  AnimationFrameScheduler.AnimationFrameScheduler = void 0;
  var AsyncScheduler_1 = /* @__PURE__ */ requireAsyncScheduler();
  var AnimationFrameScheduler$1 = function(_super) {
    __extends(AnimationFrameScheduler2, _super);
    function AnimationFrameScheduler2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    AnimationFrameScheduler2.prototype.flush = function(action) {
      this._active = true;
      var flushId;
      if (action) {
        flushId = action.id;
      } else {
        flushId = this._scheduled;
        this._scheduled = void 0;
      }
      var actions = this.actions;
      var error2;
      action = action || actions.shift();
      do {
        if (error2 = action.execute(action.state, action.delay)) {
          break;
        }
      } while ((action = actions[0]) && action.id === flushId && actions.shift());
      this._active = false;
      if (error2) {
        while ((action = actions[0]) && action.id === flushId && actions.shift()) {
          action.unsubscribe();
        }
        throw error2;
      }
    };
    return AnimationFrameScheduler2;
  }(AsyncScheduler_1.AsyncScheduler);
  AnimationFrameScheduler.AnimationFrameScheduler = AnimationFrameScheduler$1;
  return AnimationFrameScheduler;
}
var hasRequiredAnimationFrame;
function requireAnimationFrame() {
  if (hasRequiredAnimationFrame) return animationFrame;
  hasRequiredAnimationFrame = 1;
  (function(exports2) {
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.animationFrame = exports2.animationFrameScheduler = void 0;
    var AnimationFrameAction_1 = /* @__PURE__ */ requireAnimationFrameAction();
    var AnimationFrameScheduler_1 = /* @__PURE__ */ requireAnimationFrameScheduler();
    exports2.animationFrameScheduler = new AnimationFrameScheduler_1.AnimationFrameScheduler(AnimationFrameAction_1.AnimationFrameAction);
    exports2.animationFrame = exports2.animationFrameScheduler;
  })(animationFrame);
  return animationFrame;
}
var VirtualTimeScheduler = {};
var hasRequiredVirtualTimeScheduler;
function requireVirtualTimeScheduler() {
  if (hasRequiredVirtualTimeScheduler) return VirtualTimeScheduler;
  hasRequiredVirtualTimeScheduler = 1;
  var __extends = VirtualTimeScheduler && VirtualTimeScheduler.__extends || /* @__PURE__ */ function() {
    var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    return function(d, b) {
      if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  Object.defineProperty(VirtualTimeScheduler, "__esModule", { value: true });
  VirtualTimeScheduler.VirtualAction = VirtualTimeScheduler.VirtualTimeScheduler = void 0;
  var AsyncAction_1 = /* @__PURE__ */ requireAsyncAction();
  var Subscription_1 = /* @__PURE__ */ requireSubscription();
  var AsyncScheduler_1 = /* @__PURE__ */ requireAsyncScheduler();
  var VirtualTimeScheduler$1 = function(_super) {
    __extends(VirtualTimeScheduler2, _super);
    function VirtualTimeScheduler2(schedulerActionCtor, maxFrames) {
      if (schedulerActionCtor === void 0) {
        schedulerActionCtor = VirtualAction;
      }
      if (maxFrames === void 0) {
        maxFrames = Infinity;
      }
      var _this = _super.call(this, schedulerActionCtor, function() {
        return _this.frame;
      }) || this;
      _this.maxFrames = maxFrames;
      _this.frame = 0;
      _this.index = -1;
      return _this;
    }
    VirtualTimeScheduler2.prototype.flush = function() {
      var _a = this, actions = _a.actions, maxFrames = _a.maxFrames;
      var error2;
      var action;
      while ((action = actions[0]) && action.delay <= maxFrames) {
        actions.shift();
        this.frame = action.delay;
        if (error2 = action.execute(action.state, action.delay)) {
          break;
        }
      }
      if (error2) {
        while (action = actions.shift()) {
          action.unsubscribe();
        }
        throw error2;
      }
    };
    VirtualTimeScheduler2.frameTimeFactor = 10;
    return VirtualTimeScheduler2;
  }(AsyncScheduler_1.AsyncScheduler);
  VirtualTimeScheduler.VirtualTimeScheduler = VirtualTimeScheduler$1;
  var VirtualAction = function(_super) {
    __extends(VirtualAction2, _super);
    function VirtualAction2(scheduler, work, index) {
      if (index === void 0) {
        index = scheduler.index += 1;
      }
      var _this = _super.call(this, scheduler, work) || this;
      _this.scheduler = scheduler;
      _this.work = work;
      _this.index = index;
      _this.active = true;
      _this.index = scheduler.index = index;
      return _this;
    }
    VirtualAction2.prototype.schedule = function(state, delay2) {
      if (delay2 === void 0) {
        delay2 = 0;
      }
      if (Number.isFinite(delay2)) {
        if (!this.id) {
          return _super.prototype.schedule.call(this, state, delay2);
        }
        this.active = false;
        var action = new VirtualAction2(this.scheduler, this.work);
        this.add(action);
        return action.schedule(state, delay2);
      } else {
        return Subscription_1.Subscription.EMPTY;
      }
    };
    VirtualAction2.prototype.requestAsyncId = function(scheduler, id, delay2) {
      if (delay2 === void 0) {
        delay2 = 0;
      }
      this.delay = scheduler.frame + delay2;
      var actions = scheduler.actions;
      actions.push(this);
      actions.sort(VirtualAction2.sortActions);
      return 1;
    };
    VirtualAction2.prototype.recycleAsyncId = function(scheduler, id, delay2) {
      return void 0;
    };
    VirtualAction2.prototype._execute = function(state, delay2) {
      if (this.active === true) {
        return _super.prototype._execute.call(this, state, delay2);
      }
    };
    VirtualAction2.sortActions = function(a, b) {
      if (a.delay === b.delay) {
        if (a.index === b.index) {
          return 0;
        } else if (a.index > b.index) {
          return 1;
        } else {
          return -1;
        }
      } else if (a.delay > b.delay) {
        return 1;
      } else {
        return -1;
      }
    };
    return VirtualAction2;
  }(AsyncAction_1.AsyncAction);
  VirtualTimeScheduler.VirtualAction = VirtualAction;
  return VirtualTimeScheduler;
}
var Notification = {};
var empty = {};
var hasRequiredEmpty;
function requireEmpty() {
  if (hasRequiredEmpty) return empty;
  hasRequiredEmpty = 1;
  (function(exports2) {
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.empty = exports2.EMPTY = void 0;
    var Observable_1 = /* @__PURE__ */ requireObservable();
    exports2.EMPTY = new Observable_1.Observable(function(subscriber) {
      return subscriber.complete();
    });
    function empty2(scheduler) {
      return scheduler ? emptyScheduled(scheduler) : exports2.EMPTY;
    }
    exports2.empty = empty2;
    function emptyScheduled(scheduler) {
      return new Observable_1.Observable(function(subscriber) {
        return scheduler.schedule(function() {
          return subscriber.complete();
        });
      });
    }
  })(empty);
  return empty;
}
var of = {};
var args = {};
var isScheduler = {};
var hasRequiredIsScheduler;
function requireIsScheduler() {
  if (hasRequiredIsScheduler) return isScheduler;
  hasRequiredIsScheduler = 1;
  Object.defineProperty(isScheduler, "__esModule", { value: true });
  isScheduler.isScheduler = void 0;
  var isFunction_1 = /* @__PURE__ */ requireIsFunction();
  function isScheduler$1(value) {
    return value && isFunction_1.isFunction(value.schedule);
  }
  isScheduler.isScheduler = isScheduler$1;
  return isScheduler;
}
var hasRequiredArgs;
function requireArgs() {
  if (hasRequiredArgs) return args;
  hasRequiredArgs = 1;
  Object.defineProperty(args, "__esModule", { value: true });
  args.popNumber = args.popScheduler = args.popResultSelector = void 0;
  var isFunction_1 = /* @__PURE__ */ requireIsFunction();
  var isScheduler_1 = /* @__PURE__ */ requireIsScheduler();
  function last2(arr) {
    return arr[arr.length - 1];
  }
  function popResultSelector(args2) {
    return isFunction_1.isFunction(last2(args2)) ? args2.pop() : void 0;
  }
  args.popResultSelector = popResultSelector;
  function popScheduler(args2) {
    return isScheduler_1.isScheduler(last2(args2)) ? args2.pop() : void 0;
  }
  args.popScheduler = popScheduler;
  function popNumber(args2, defaultValue) {
    return typeof last2(args2) === "number" ? args2.pop() : defaultValue;
  }
  args.popNumber = popNumber;
  return args;
}
var from = {};
var scheduled = {};
var scheduleObservable = {};
var innerFrom = {};
var isArrayLike = {};
var hasRequiredIsArrayLike;
function requireIsArrayLike() {
  if (hasRequiredIsArrayLike) return isArrayLike;
  hasRequiredIsArrayLike = 1;
  Object.defineProperty(isArrayLike, "__esModule", { value: true });
  isArrayLike.isArrayLike = void 0;
  isArrayLike.isArrayLike = function(x) {
    return x && typeof x.length === "number" && typeof x !== "function";
  };
  return isArrayLike;
}
var isPromise = {};
var hasRequiredIsPromise;
function requireIsPromise() {
  if (hasRequiredIsPromise) return isPromise;
  hasRequiredIsPromise = 1;
  Object.defineProperty(isPromise, "__esModule", { value: true });
  isPromise.isPromise = void 0;
  var isFunction_1 = /* @__PURE__ */ requireIsFunction();
  function isPromise$1(value) {
    return isFunction_1.isFunction(value === null || value === void 0 ? void 0 : value.then);
  }
  isPromise.isPromise = isPromise$1;
  return isPromise;
}
var isInteropObservable = {};
var hasRequiredIsInteropObservable;
function requireIsInteropObservable() {
  if (hasRequiredIsInteropObservable) return isInteropObservable;
  hasRequiredIsInteropObservable = 1;
  Object.defineProperty(isInteropObservable, "__esModule", { value: true });
  isInteropObservable.isInteropObservable = void 0;
  var observable_1 = /* @__PURE__ */ requireObservable$1();
  var isFunction_1 = /* @__PURE__ */ requireIsFunction();
  function isInteropObservable$1(input2) {
    return isFunction_1.isFunction(input2[observable_1.observable]);
  }
  isInteropObservable.isInteropObservable = isInteropObservable$1;
  return isInteropObservable;
}
var isAsyncIterable = {};
var hasRequiredIsAsyncIterable;
function requireIsAsyncIterable() {
  if (hasRequiredIsAsyncIterable) return isAsyncIterable;
  hasRequiredIsAsyncIterable = 1;
  Object.defineProperty(isAsyncIterable, "__esModule", { value: true });
  isAsyncIterable.isAsyncIterable = void 0;
  var isFunction_1 = /* @__PURE__ */ requireIsFunction();
  function isAsyncIterable$1(obj) {
    return Symbol.asyncIterator && isFunction_1.isFunction(obj === null || obj === void 0 ? void 0 : obj[Symbol.asyncIterator]);
  }
  isAsyncIterable.isAsyncIterable = isAsyncIterable$1;
  return isAsyncIterable;
}
var throwUnobservableError = {};
var hasRequiredThrowUnobservableError;
function requireThrowUnobservableError() {
  if (hasRequiredThrowUnobservableError) return throwUnobservableError;
  hasRequiredThrowUnobservableError = 1;
  Object.defineProperty(throwUnobservableError, "__esModule", { value: true });
  throwUnobservableError.createInvalidObservableTypeError = void 0;
  function createInvalidObservableTypeError(input2) {
    return new TypeError("You provided " + (input2 !== null && typeof input2 === "object" ? "an invalid object" : "'" + input2 + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
  }
  throwUnobservableError.createInvalidObservableTypeError = createInvalidObservableTypeError;
  return throwUnobservableError;
}
var isIterable = {};
var iterator = {};
var hasRequiredIterator;
function requireIterator() {
  if (hasRequiredIterator) return iterator;
  hasRequiredIterator = 1;
  Object.defineProperty(iterator, "__esModule", { value: true });
  iterator.iterator = iterator.getSymbolIterator = void 0;
  function getSymbolIterator() {
    if (typeof Symbol !== "function" || !Symbol.iterator) {
      return "@@iterator";
    }
    return Symbol.iterator;
  }
  iterator.getSymbolIterator = getSymbolIterator;
  iterator.iterator = getSymbolIterator();
  return iterator;
}
var hasRequiredIsIterable;
function requireIsIterable() {
  if (hasRequiredIsIterable) return isIterable;
  hasRequiredIsIterable = 1;
  Object.defineProperty(isIterable, "__esModule", { value: true });
  isIterable.isIterable = void 0;
  var iterator_1 = /* @__PURE__ */ requireIterator();
  var isFunction_1 = /* @__PURE__ */ requireIsFunction();
  function isIterable$1(input2) {
    return isFunction_1.isFunction(input2 === null || input2 === void 0 ? void 0 : input2[iterator_1.iterator]);
  }
  isIterable.isIterable = isIterable$1;
  return isIterable;
}
var isReadableStreamLike = {};
var hasRequiredIsReadableStreamLike;
function requireIsReadableStreamLike() {
  if (hasRequiredIsReadableStreamLike) return isReadableStreamLike;
  hasRequiredIsReadableStreamLike = 1;
  var __generator = isReadableStreamLike && isReadableStreamLike.__generator || function(thisArg, body) {
    var _2 = { label: 0, sent: function() {
      if (t[0] & 1) throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_2) try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _2.label++;
            return { value: op[1], done: false };
          case 5:
            _2.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _2.ops.pop();
            _2.trys.pop();
            continue;
          default:
            if (!(t = _2.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _2 = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _2.label = op[1];
              break;
            }
            if (op[0] === 6 && _2.label < t[1]) {
              _2.label = t[1];
              t = op;
              break;
            }
            if (t && _2.label < t[2]) {
              _2.label = t[2];
              _2.ops.push(op);
              break;
            }
            if (t[2]) _2.ops.pop();
            _2.trys.pop();
            continue;
        }
        op = body.call(thisArg, _2);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var __await = isReadableStreamLike && isReadableStreamLike.__await || function(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
  };
  var __asyncGenerator = isReadableStreamLike && isReadableStreamLike.__asyncGenerator || function(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
      return this;
    }, i;
    function verb(n) {
      if (g[n]) i[n] = function(v) {
        return new Promise(function(a, b) {
          q.push([n, v, a, b]) > 1 || resume(n, v);
        });
      };
    }
    function resume(n, v) {
      try {
        step(g[n](v));
      } catch (e) {
        settle(q[0][3], e);
      }
    }
    function step(r) {
      r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
    }
    function fulfill(value) {
      resume("next", value);
    }
    function reject(value) {
      resume("throw", value);
    }
    function settle(f, v) {
      if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
    }
  };
  Object.defineProperty(isReadableStreamLike, "__esModule", { value: true });
  isReadableStreamLike.isReadableStreamLike = isReadableStreamLike.readableStreamLikeToAsyncGenerator = void 0;
  var isFunction_1 = /* @__PURE__ */ requireIsFunction();
  function readableStreamLikeToAsyncGenerator(readableStream) {
    return __asyncGenerator(this, arguments, function readableStreamLikeToAsyncGenerator_1() {
      var reader, _a, value, done;
      return __generator(this, function(_b) {
        switch (_b.label) {
          case 0:
            reader = readableStream.getReader();
            _b.label = 1;
          case 1:
            _b.trys.push([1, , 9, 10]);
            _b.label = 2;
          case 2:
            return [4, __await(reader.read())];
          case 3:
            _a = _b.sent(), value = _a.value, done = _a.done;
            if (!done) return [3, 5];
            return [4, __await(void 0)];
          case 4:
            return [2, _b.sent()];
          case 5:
            return [4, __await(value)];
          case 6:
            return [4, _b.sent()];
          case 7:
            _b.sent();
            return [3, 2];
          case 8:
            return [3, 10];
          case 9:
            reader.releaseLock();
            return [7];
          case 10:
            return [2];
        }
      });
    });
  }
  isReadableStreamLike.readableStreamLikeToAsyncGenerator = readableStreamLikeToAsyncGenerator;
  function isReadableStreamLike$1(obj) {
    return isFunction_1.isFunction(obj === null || obj === void 0 ? void 0 : obj.getReader);
  }
  isReadableStreamLike.isReadableStreamLike = isReadableStreamLike$1;
  return isReadableStreamLike;
}
var hasRequiredInnerFrom;
function requireInnerFrom() {
  if (hasRequiredInnerFrom) return innerFrom;
  hasRequiredInnerFrom = 1;
  var __awaiter = innerFrom && innerFrom.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator = innerFrom && innerFrom.__generator || function(thisArg, body) {
    var _2 = { label: 0, sent: function() {
      if (t[0] & 1) throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_2) try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _2.label++;
            return { value: op[1], done: false };
          case 5:
            _2.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _2.ops.pop();
            _2.trys.pop();
            continue;
          default:
            if (!(t = _2.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _2 = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _2.label = op[1];
              break;
            }
            if (op[0] === 6 && _2.label < t[1]) {
              _2.label = t[1];
              t = op;
              break;
            }
            if (t && _2.label < t[2]) {
              _2.label = t[2];
              _2.ops.push(op);
              break;
            }
            if (t[2]) _2.ops.pop();
            _2.trys.pop();
            continue;
        }
        op = body.call(thisArg, _2);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  var __asyncValues = innerFrom && innerFrom.__asyncValues || function(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
      return this;
    }, i);
    function verb(n) {
      i[n] = o[n] && function(v) {
        return new Promise(function(resolve, reject) {
          v = o[n](v), settle(resolve, reject, v.done, v.value);
        });
      };
    }
    function settle(resolve, reject, d, v) {
      Promise.resolve(v).then(function(v2) {
        resolve({ value: v2, done: d });
      }, reject);
    }
  };
  var __values = innerFrom && innerFrom.__values || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  Object.defineProperty(innerFrom, "__esModule", { value: true });
  innerFrom.fromReadableStreamLike = innerFrom.fromAsyncIterable = innerFrom.fromIterable = innerFrom.fromPromise = innerFrom.fromArrayLike = innerFrom.fromInteropObservable = innerFrom.innerFrom = void 0;
  var isArrayLike_1 = /* @__PURE__ */ requireIsArrayLike();
  var isPromise_1 = /* @__PURE__ */ requireIsPromise();
  var Observable_1 = /* @__PURE__ */ requireObservable();
  var isInteropObservable_1 = /* @__PURE__ */ requireIsInteropObservable();
  var isAsyncIterable_1 = /* @__PURE__ */ requireIsAsyncIterable();
  var throwUnobservableError_1 = /* @__PURE__ */ requireThrowUnobservableError();
  var isIterable_1 = /* @__PURE__ */ requireIsIterable();
  var isReadableStreamLike_1 = /* @__PURE__ */ requireIsReadableStreamLike();
  var isFunction_1 = /* @__PURE__ */ requireIsFunction();
  var reportUnhandledError_1 = /* @__PURE__ */ requireReportUnhandledError();
  var observable_1 = /* @__PURE__ */ requireObservable$1();
  function innerFrom$1(input2) {
    if (input2 instanceof Observable_1.Observable) {
      return input2;
    }
    if (input2 != null) {
      if (isInteropObservable_1.isInteropObservable(input2)) {
        return fromInteropObservable(input2);
      }
      if (isArrayLike_1.isArrayLike(input2)) {
        return fromArrayLike(input2);
      }
      if (isPromise_1.isPromise(input2)) {
        return fromPromise(input2);
      }
      if (isAsyncIterable_1.isAsyncIterable(input2)) {
        return fromAsyncIterable(input2);
      }
      if (isIterable_1.isIterable(input2)) {
        return fromIterable(input2);
      }
      if (isReadableStreamLike_1.isReadableStreamLike(input2)) {
        return fromReadableStreamLike(input2);
      }
    }
    throw throwUnobservableError_1.createInvalidObservableTypeError(input2);
  }
  innerFrom.innerFrom = innerFrom$1;
  function fromInteropObservable(obj) {
    return new Observable_1.Observable(function(subscriber) {
      var obs = obj[observable_1.observable]();
      if (isFunction_1.isFunction(obs.subscribe)) {
        return obs.subscribe(subscriber);
      }
      throw new TypeError("Provided object does not correctly implement Symbol.observable");
    });
  }
  innerFrom.fromInteropObservable = fromInteropObservable;
  function fromArrayLike(array) {
    return new Observable_1.Observable(function(subscriber) {
      for (var i = 0; i < array.length && !subscriber.closed; i++) {
        subscriber.next(array[i]);
      }
      subscriber.complete();
    });
  }
  innerFrom.fromArrayLike = fromArrayLike;
  function fromPromise(promise) {
    return new Observable_1.Observable(function(subscriber) {
      promise.then(function(value) {
        if (!subscriber.closed) {
          subscriber.next(value);
          subscriber.complete();
        }
      }, function(err) {
        return subscriber.error(err);
      }).then(null, reportUnhandledError_1.reportUnhandledError);
    });
  }
  innerFrom.fromPromise = fromPromise;
  function fromIterable(iterable) {
    return new Observable_1.Observable(function(subscriber) {
      var e_1, _a;
      try {
        for (var iterable_1 = __values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
          var value = iterable_1_1.value;
          subscriber.next(value);
          if (subscriber.closed) {
            return;
          }
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (iterable_1_1 && !iterable_1_1.done && (_a = iterable_1.return)) _a.call(iterable_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
      subscriber.complete();
    });
  }
  innerFrom.fromIterable = fromIterable;
  function fromAsyncIterable(asyncIterable) {
    return new Observable_1.Observable(function(subscriber) {
      process2(asyncIterable, subscriber).catch(function(err) {
        return subscriber.error(err);
      });
    });
  }
  innerFrom.fromAsyncIterable = fromAsyncIterable;
  function fromReadableStreamLike(readableStream) {
    return fromAsyncIterable(isReadableStreamLike_1.readableStreamLikeToAsyncGenerator(readableStream));
  }
  innerFrom.fromReadableStreamLike = fromReadableStreamLike;
  function process2(asyncIterable, subscriber) {
    var asyncIterable_1, asyncIterable_1_1;
    var e_2, _a;
    return __awaiter(this, void 0, void 0, function() {
      var value, e_2_1;
      return __generator(this, function(_b) {
        switch (_b.label) {
          case 0:
            _b.trys.push([0, 5, 6, 11]);
            asyncIterable_1 = __asyncValues(asyncIterable);
            _b.label = 1;
          case 1:
            return [4, asyncIterable_1.next()];
          case 2:
            if (!(asyncIterable_1_1 = _b.sent(), !asyncIterable_1_1.done)) return [3, 4];
            value = asyncIterable_1_1.value;
            subscriber.next(value);
            if (subscriber.closed) {
              return [2];
            }
            _b.label = 3;
          case 3:
            return [3, 1];
          case 4:
            return [3, 11];
          case 5:
            e_2_1 = _b.sent();
            e_2 = { error: e_2_1 };
            return [3, 11];
          case 6:
            _b.trys.push([6, , 9, 10]);
            if (!(asyncIterable_1_1 && !asyncIterable_1_1.done && (_a = asyncIterable_1.return))) return [3, 8];
            return [4, _a.call(asyncIterable_1)];
          case 7:
            _b.sent();
            _b.label = 8;
          case 8:
            return [3, 10];
          case 9:
            if (e_2) throw e_2.error;
            return [7];
          case 10:
            return [7];
          case 11:
            subscriber.complete();
            return [2];
        }
      });
    });
  }
  return innerFrom;
}
var observeOn = {};
var executeSchedule = {};
var hasRequiredExecuteSchedule;
function requireExecuteSchedule() {
  if (hasRequiredExecuteSchedule) return executeSchedule;
  hasRequiredExecuteSchedule = 1;
  Object.defineProperty(executeSchedule, "__esModule", { value: true });
  executeSchedule.executeSchedule = void 0;
  function executeSchedule$1(parentSubscription, scheduler, work, delay2, repeat2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    if (repeat2 === void 0) {
      repeat2 = false;
    }
    var scheduleSubscription = scheduler.schedule(function() {
      work();
      if (repeat2) {
        parentSubscription.add(this.schedule(null, delay2));
      } else {
        this.unsubscribe();
      }
    }, delay2);
    parentSubscription.add(scheduleSubscription);
    if (!repeat2) {
      return scheduleSubscription;
    }
  }
  executeSchedule.executeSchedule = executeSchedule$1;
  return executeSchedule;
}
var hasRequiredObserveOn;
function requireObserveOn() {
  if (hasRequiredObserveOn) return observeOn;
  hasRequiredObserveOn = 1;
  Object.defineProperty(observeOn, "__esModule", { value: true });
  observeOn.observeOn = void 0;
  var executeSchedule_1 = /* @__PURE__ */ requireExecuteSchedule();
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  function observeOn$1(scheduler, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    return lift_1.operate(function(source, subscriber) {
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        return executeSchedule_1.executeSchedule(subscriber, scheduler, function() {
          return subscriber.next(value);
        }, delay2);
      }, function() {
        return executeSchedule_1.executeSchedule(subscriber, scheduler, function() {
          return subscriber.complete();
        }, delay2);
      }, function(err) {
        return executeSchedule_1.executeSchedule(subscriber, scheduler, function() {
          return subscriber.error(err);
        }, delay2);
      }));
    });
  }
  observeOn.observeOn = observeOn$1;
  return observeOn;
}
var subscribeOn = {};
var hasRequiredSubscribeOn;
function requireSubscribeOn() {
  if (hasRequiredSubscribeOn) return subscribeOn;
  hasRequiredSubscribeOn = 1;
  Object.defineProperty(subscribeOn, "__esModule", { value: true });
  subscribeOn.subscribeOn = void 0;
  var lift_1 = /* @__PURE__ */ requireLift();
  function subscribeOn$1(scheduler, delay2) {
    if (delay2 === void 0) {
      delay2 = 0;
    }
    return lift_1.operate(function(source, subscriber) {
      subscriber.add(scheduler.schedule(function() {
        return source.subscribe(subscriber);
      }, delay2));
    });
  }
  subscribeOn.subscribeOn = subscribeOn$1;
  return subscribeOn;
}
var hasRequiredScheduleObservable;
function requireScheduleObservable() {
  if (hasRequiredScheduleObservable) return scheduleObservable;
  hasRequiredScheduleObservable = 1;
  Object.defineProperty(scheduleObservable, "__esModule", { value: true });
  scheduleObservable.scheduleObservable = void 0;
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  var observeOn_1 = /* @__PURE__ */ requireObserveOn();
  var subscribeOn_1 = /* @__PURE__ */ requireSubscribeOn();
  function scheduleObservable$1(input2, scheduler) {
    return innerFrom_1.innerFrom(input2).pipe(subscribeOn_1.subscribeOn(scheduler), observeOn_1.observeOn(scheduler));
  }
  scheduleObservable.scheduleObservable = scheduleObservable$1;
  return scheduleObservable;
}
var schedulePromise = {};
var hasRequiredSchedulePromise;
function requireSchedulePromise() {
  if (hasRequiredSchedulePromise) return schedulePromise;
  hasRequiredSchedulePromise = 1;
  Object.defineProperty(schedulePromise, "__esModule", { value: true });
  schedulePromise.schedulePromise = void 0;
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  var observeOn_1 = /* @__PURE__ */ requireObserveOn();
  var subscribeOn_1 = /* @__PURE__ */ requireSubscribeOn();
  function schedulePromise$1(input2, scheduler) {
    return innerFrom_1.innerFrom(input2).pipe(subscribeOn_1.subscribeOn(scheduler), observeOn_1.observeOn(scheduler));
  }
  schedulePromise.schedulePromise = schedulePromise$1;
  return schedulePromise;
}
var scheduleArray = {};
var hasRequiredScheduleArray;
function requireScheduleArray() {
  if (hasRequiredScheduleArray) return scheduleArray;
  hasRequiredScheduleArray = 1;
  Object.defineProperty(scheduleArray, "__esModule", { value: true });
  scheduleArray.scheduleArray = void 0;
  var Observable_1 = /* @__PURE__ */ requireObservable();
  function scheduleArray$1(input2, scheduler) {
    return new Observable_1.Observable(function(subscriber) {
      var i = 0;
      return scheduler.schedule(function() {
        if (i === input2.length) {
          subscriber.complete();
        } else {
          subscriber.next(input2[i++]);
          if (!subscriber.closed) {
            this.schedule();
          }
        }
      });
    });
  }
  scheduleArray.scheduleArray = scheduleArray$1;
  return scheduleArray;
}
var scheduleIterable = {};
var hasRequiredScheduleIterable;
function requireScheduleIterable() {
  if (hasRequiredScheduleIterable) return scheduleIterable;
  hasRequiredScheduleIterable = 1;
  Object.defineProperty(scheduleIterable, "__esModule", { value: true });
  scheduleIterable.scheduleIterable = void 0;
  var Observable_1 = /* @__PURE__ */ requireObservable();
  var iterator_1 = /* @__PURE__ */ requireIterator();
  var isFunction_1 = /* @__PURE__ */ requireIsFunction();
  var executeSchedule_1 = /* @__PURE__ */ requireExecuteSchedule();
  function scheduleIterable$1(input2, scheduler) {
    return new Observable_1.Observable(function(subscriber) {
      var iterator2;
      executeSchedule_1.executeSchedule(subscriber, scheduler, function() {
        iterator2 = input2[iterator_1.iterator]();
        executeSchedule_1.executeSchedule(subscriber, scheduler, function() {
          var _a;
          var value;
          var done;
          try {
            _a = iterator2.next(), value = _a.value, done = _a.done;
          } catch (err) {
            subscriber.error(err);
            return;
          }
          if (done) {
            subscriber.complete();
          } else {
            subscriber.next(value);
          }
        }, 0, true);
      });
      return function() {
        return isFunction_1.isFunction(iterator2 === null || iterator2 === void 0 ? void 0 : iterator2.return) && iterator2.return();
      };
    });
  }
  scheduleIterable.scheduleIterable = scheduleIterable$1;
  return scheduleIterable;
}
var scheduleAsyncIterable = {};
var hasRequiredScheduleAsyncIterable;
function requireScheduleAsyncIterable() {
  if (hasRequiredScheduleAsyncIterable) return scheduleAsyncIterable;
  hasRequiredScheduleAsyncIterable = 1;
  Object.defineProperty(scheduleAsyncIterable, "__esModule", { value: true });
  scheduleAsyncIterable.scheduleAsyncIterable = void 0;
  var Observable_1 = /* @__PURE__ */ requireObservable();
  var executeSchedule_1 = /* @__PURE__ */ requireExecuteSchedule();
  function scheduleAsyncIterable$1(input2, scheduler) {
    if (!input2) {
      throw new Error("Iterable cannot be null");
    }
    return new Observable_1.Observable(function(subscriber) {
      executeSchedule_1.executeSchedule(subscriber, scheduler, function() {
        var iterator2 = input2[Symbol.asyncIterator]();
        executeSchedule_1.executeSchedule(subscriber, scheduler, function() {
          iterator2.next().then(function(result) {
            if (result.done) {
              subscriber.complete();
            } else {
              subscriber.next(result.value);
            }
          });
        }, 0, true);
      });
    });
  }
  scheduleAsyncIterable.scheduleAsyncIterable = scheduleAsyncIterable$1;
  return scheduleAsyncIterable;
}
var scheduleReadableStreamLike = {};
var hasRequiredScheduleReadableStreamLike;
function requireScheduleReadableStreamLike() {
  if (hasRequiredScheduleReadableStreamLike) return scheduleReadableStreamLike;
  hasRequiredScheduleReadableStreamLike = 1;
  Object.defineProperty(scheduleReadableStreamLike, "__esModule", { value: true });
  scheduleReadableStreamLike.scheduleReadableStreamLike = void 0;
  var scheduleAsyncIterable_1 = /* @__PURE__ */ requireScheduleAsyncIterable();
  var isReadableStreamLike_1 = /* @__PURE__ */ requireIsReadableStreamLike();
  function scheduleReadableStreamLike$1(input2, scheduler) {
    return scheduleAsyncIterable_1.scheduleAsyncIterable(isReadableStreamLike_1.readableStreamLikeToAsyncGenerator(input2), scheduler);
  }
  scheduleReadableStreamLike.scheduleReadableStreamLike = scheduleReadableStreamLike$1;
  return scheduleReadableStreamLike;
}
var hasRequiredScheduled;
function requireScheduled() {
  if (hasRequiredScheduled) return scheduled;
  hasRequiredScheduled = 1;
  Object.defineProperty(scheduled, "__esModule", { value: true });
  scheduled.scheduled = void 0;
  var scheduleObservable_1 = /* @__PURE__ */ requireScheduleObservable();
  var schedulePromise_1 = /* @__PURE__ */ requireSchedulePromise();
  var scheduleArray_1 = /* @__PURE__ */ requireScheduleArray();
  var scheduleIterable_1 = /* @__PURE__ */ requireScheduleIterable();
  var scheduleAsyncIterable_1 = /* @__PURE__ */ requireScheduleAsyncIterable();
  var isInteropObservable_1 = /* @__PURE__ */ requireIsInteropObservable();
  var isPromise_1 = /* @__PURE__ */ requireIsPromise();
  var isArrayLike_1 = /* @__PURE__ */ requireIsArrayLike();
  var isIterable_1 = /* @__PURE__ */ requireIsIterable();
  var isAsyncIterable_1 = /* @__PURE__ */ requireIsAsyncIterable();
  var throwUnobservableError_1 = /* @__PURE__ */ requireThrowUnobservableError();
  var isReadableStreamLike_1 = /* @__PURE__ */ requireIsReadableStreamLike();
  var scheduleReadableStreamLike_1 = /* @__PURE__ */ requireScheduleReadableStreamLike();
  function scheduled$1(input2, scheduler) {
    if (input2 != null) {
      if (isInteropObservable_1.isInteropObservable(input2)) {
        return scheduleObservable_1.scheduleObservable(input2, scheduler);
      }
      if (isArrayLike_1.isArrayLike(input2)) {
        return scheduleArray_1.scheduleArray(input2, scheduler);
      }
      if (isPromise_1.isPromise(input2)) {
        return schedulePromise_1.schedulePromise(input2, scheduler);
      }
      if (isAsyncIterable_1.isAsyncIterable(input2)) {
        return scheduleAsyncIterable_1.scheduleAsyncIterable(input2, scheduler);
      }
      if (isIterable_1.isIterable(input2)) {
        return scheduleIterable_1.scheduleIterable(input2, scheduler);
      }
      if (isReadableStreamLike_1.isReadableStreamLike(input2)) {
        return scheduleReadableStreamLike_1.scheduleReadableStreamLike(input2, scheduler);
      }
    }
    throw throwUnobservableError_1.createInvalidObservableTypeError(input2);
  }
  scheduled.scheduled = scheduled$1;
  return scheduled;
}
var hasRequiredFrom;
function requireFrom() {
  if (hasRequiredFrom) return from;
  hasRequiredFrom = 1;
  Object.defineProperty(from, "__esModule", { value: true });
  from.from = void 0;
  var scheduled_1 = /* @__PURE__ */ requireScheduled();
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  function from$1(input2, scheduler) {
    return scheduler ? scheduled_1.scheduled(input2, scheduler) : innerFrom_1.innerFrom(input2);
  }
  from.from = from$1;
  return from;
}
var hasRequiredOf;
function requireOf() {
  if (hasRequiredOf) return of;
  hasRequiredOf = 1;
  Object.defineProperty(of, "__esModule", { value: true });
  of.of = void 0;
  var args_1 = /* @__PURE__ */ requireArgs();
  var from_1 = /* @__PURE__ */ requireFrom();
  function of$1() {
    var args2 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args2[_i] = arguments[_i];
    }
    var scheduler = args_1.popScheduler(args2);
    return from_1.from(args2, scheduler);
  }
  of.of = of$1;
  return of;
}
var throwError = {};
var hasRequiredThrowError;
function requireThrowError() {
  if (hasRequiredThrowError) return throwError;
  hasRequiredThrowError = 1;
  Object.defineProperty(throwError, "__esModule", { value: true });
  throwError.throwError = void 0;
  var Observable_1 = /* @__PURE__ */ requireObservable();
  var isFunction_1 = /* @__PURE__ */ requireIsFunction();
  function throwError$1(errorOrErrorFactory, scheduler) {
    var errorFactory = isFunction_1.isFunction(errorOrErrorFactory) ? errorOrErrorFactory : function() {
      return errorOrErrorFactory;
    };
    var init = function(subscriber) {
      return subscriber.error(errorFactory());
    };
    return new Observable_1.Observable(scheduler ? function(subscriber) {
      return scheduler.schedule(init, 0, subscriber);
    } : init);
  }
  throwError.throwError = throwError$1;
  return throwError;
}
var hasRequiredNotification;
function requireNotification() {
  if (hasRequiredNotification) return Notification;
  hasRequiredNotification = 1;
  (function(exports2) {
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.observeNotification = exports2.Notification = exports2.NotificationKind = void 0;
    var empty_1 = /* @__PURE__ */ requireEmpty();
    var of_1 = /* @__PURE__ */ requireOf();
    var throwError_1 = /* @__PURE__ */ requireThrowError();
    var isFunction_1 = /* @__PURE__ */ requireIsFunction();
    (function(NotificationKind) {
      NotificationKind["NEXT"] = "N";
      NotificationKind["ERROR"] = "E";
      NotificationKind["COMPLETE"] = "C";
    })(exports2.NotificationKind || (exports2.NotificationKind = {}));
    var Notification2 = function() {
      function Notification3(kind, value, error2) {
        this.kind = kind;
        this.value = value;
        this.error = error2;
        this.hasValue = kind === "N";
      }
      Notification3.prototype.observe = function(observer) {
        return observeNotification(this, observer);
      };
      Notification3.prototype.do = function(nextHandler, errorHandler, completeHandler) {
        var _a = this, kind = _a.kind, value = _a.value, error2 = _a.error;
        return kind === "N" ? nextHandler === null || nextHandler === void 0 ? void 0 : nextHandler(value) : kind === "E" ? errorHandler === null || errorHandler === void 0 ? void 0 : errorHandler(error2) : completeHandler === null || completeHandler === void 0 ? void 0 : completeHandler();
      };
      Notification3.prototype.accept = function(nextOrObserver, error2, complete) {
        var _a;
        return isFunction_1.isFunction((_a = nextOrObserver) === null || _a === void 0 ? void 0 : _a.next) ? this.observe(nextOrObserver) : this.do(nextOrObserver, error2, complete);
      };
      Notification3.prototype.toObservable = function() {
        var _a = this, kind = _a.kind, value = _a.value, error2 = _a.error;
        var result = kind === "N" ? of_1.of(value) : kind === "E" ? throwError_1.throwError(function() {
          return error2;
        }) : kind === "C" ? empty_1.EMPTY : 0;
        if (!result) {
          throw new TypeError("Unexpected notification kind " + kind);
        }
        return result;
      };
      Notification3.createNext = function(value) {
        return new Notification3("N", value);
      };
      Notification3.createError = function(err) {
        return new Notification3("E", void 0, err);
      };
      Notification3.createComplete = function() {
        return Notification3.completeNotification;
      };
      Notification3.completeNotification = new Notification3("C");
      return Notification3;
    }();
    exports2.Notification = Notification2;
    function observeNotification(notification, observer) {
      var _a, _b, _c;
      var _d = notification, kind = _d.kind, value = _d.value, error2 = _d.error;
      if (typeof kind !== "string") {
        throw new TypeError('Invalid notification, missing "kind"');
      }
      kind === "N" ? (_a = observer.next) === null || _a === void 0 ? void 0 : _a.call(observer, value) : kind === "E" ? (_b = observer.error) === null || _b === void 0 ? void 0 : _b.call(observer, error2) : (_c = observer.complete) === null || _c === void 0 ? void 0 : _c.call(observer);
    }
    exports2.observeNotification = observeNotification;
  })(Notification);
  return Notification;
}
var isObservable = {};
var hasRequiredIsObservable;
function requireIsObservable() {
  if (hasRequiredIsObservable) return isObservable;
  hasRequiredIsObservable = 1;
  Object.defineProperty(isObservable, "__esModule", { value: true });
  isObservable.isObservable = void 0;
  var Observable_1 = /* @__PURE__ */ requireObservable();
  var isFunction_1 = /* @__PURE__ */ requireIsFunction();
  function isObservable$1(obj) {
    return !!obj && (obj instanceof Observable_1.Observable || isFunction_1.isFunction(obj.lift) && isFunction_1.isFunction(obj.subscribe));
  }
  isObservable.isObservable = isObservable$1;
  return isObservable;
}
var lastValueFrom = {};
var EmptyError = {};
var hasRequiredEmptyError;
function requireEmptyError() {
  if (hasRequiredEmptyError) return EmptyError;
  hasRequiredEmptyError = 1;
  Object.defineProperty(EmptyError, "__esModule", { value: true });
  EmptyError.EmptyError = void 0;
  var createErrorClass_1 = /* @__PURE__ */ requireCreateErrorClass();
  EmptyError.EmptyError = createErrorClass_1.createErrorClass(function(_super) {
    return function EmptyErrorImpl() {
      _super(this);
      this.name = "EmptyError";
      this.message = "no elements in sequence";
    };
  });
  return EmptyError;
}
var hasRequiredLastValueFrom;
function requireLastValueFrom() {
  if (hasRequiredLastValueFrom) return lastValueFrom;
  hasRequiredLastValueFrom = 1;
  Object.defineProperty(lastValueFrom, "__esModule", { value: true });
  lastValueFrom.lastValueFrom = void 0;
  var EmptyError_1 = /* @__PURE__ */ requireEmptyError();
  function lastValueFrom$1(source, config2) {
    var hasConfig = typeof config2 === "object";
    return new Promise(function(resolve, reject) {
      var _hasValue = false;
      var _value;
      source.subscribe({
        next: function(value) {
          _value = value;
          _hasValue = true;
        },
        error: reject,
        complete: function() {
          if (_hasValue) {
            resolve(_value);
          } else if (hasConfig) {
            resolve(config2.defaultValue);
          } else {
            reject(new EmptyError_1.EmptyError());
          }
        }
      });
    });
  }
  lastValueFrom.lastValueFrom = lastValueFrom$1;
  return lastValueFrom;
}
var firstValueFrom = {};
var hasRequiredFirstValueFrom;
function requireFirstValueFrom() {
  if (hasRequiredFirstValueFrom) return firstValueFrom;
  hasRequiredFirstValueFrom = 1;
  Object.defineProperty(firstValueFrom, "__esModule", { value: true });
  firstValueFrom.firstValueFrom = void 0;
  var EmptyError_1 = /* @__PURE__ */ requireEmptyError();
  var Subscriber_1 = /* @__PURE__ */ requireSubscriber();
  function firstValueFrom$1(source, config2) {
    var hasConfig = typeof config2 === "object";
    return new Promise(function(resolve, reject) {
      var subscriber = new Subscriber_1.SafeSubscriber({
        next: function(value) {
          resolve(value);
          subscriber.unsubscribe();
        },
        error: reject,
        complete: function() {
          if (hasConfig) {
            resolve(config2.defaultValue);
          } else {
            reject(new EmptyError_1.EmptyError());
          }
        }
      });
      source.subscribe(subscriber);
    });
  }
  firstValueFrom.firstValueFrom = firstValueFrom$1;
  return firstValueFrom;
}
var ArgumentOutOfRangeError = {};
var hasRequiredArgumentOutOfRangeError;
function requireArgumentOutOfRangeError() {
  if (hasRequiredArgumentOutOfRangeError) return ArgumentOutOfRangeError;
  hasRequiredArgumentOutOfRangeError = 1;
  Object.defineProperty(ArgumentOutOfRangeError, "__esModule", { value: true });
  ArgumentOutOfRangeError.ArgumentOutOfRangeError = void 0;
  var createErrorClass_1 = /* @__PURE__ */ requireCreateErrorClass();
  ArgumentOutOfRangeError.ArgumentOutOfRangeError = createErrorClass_1.createErrorClass(function(_super) {
    return function ArgumentOutOfRangeErrorImpl() {
      _super(this);
      this.name = "ArgumentOutOfRangeError";
      this.message = "argument out of range";
    };
  });
  return ArgumentOutOfRangeError;
}
var NotFoundError = {};
var hasRequiredNotFoundError;
function requireNotFoundError() {
  if (hasRequiredNotFoundError) return NotFoundError;
  hasRequiredNotFoundError = 1;
  Object.defineProperty(NotFoundError, "__esModule", { value: true });
  NotFoundError.NotFoundError = void 0;
  var createErrorClass_1 = /* @__PURE__ */ requireCreateErrorClass();
  NotFoundError.NotFoundError = createErrorClass_1.createErrorClass(function(_super) {
    return function NotFoundErrorImpl(message) {
      _super(this);
      this.name = "NotFoundError";
      this.message = message;
    };
  });
  return NotFoundError;
}
var SequenceError = {};
var hasRequiredSequenceError;
function requireSequenceError() {
  if (hasRequiredSequenceError) return SequenceError;
  hasRequiredSequenceError = 1;
  Object.defineProperty(SequenceError, "__esModule", { value: true });
  SequenceError.SequenceError = void 0;
  var createErrorClass_1 = /* @__PURE__ */ requireCreateErrorClass();
  SequenceError.SequenceError = createErrorClass_1.createErrorClass(function(_super) {
    return function SequenceErrorImpl(message) {
      _super(this);
      this.name = "SequenceError";
      this.message = message;
    };
  });
  return SequenceError;
}
var timeout = {};
var isDate = {};
var hasRequiredIsDate;
function requireIsDate() {
  if (hasRequiredIsDate) return isDate;
  hasRequiredIsDate = 1;
  Object.defineProperty(isDate, "__esModule", { value: true });
  isDate.isValidDate = void 0;
  function isValidDate(value) {
    return value instanceof Date && !isNaN(value);
  }
  isDate.isValidDate = isValidDate;
  return isDate;
}
var hasRequiredTimeout;
function requireTimeout() {
  if (hasRequiredTimeout) return timeout;
  hasRequiredTimeout = 1;
  (function(exports2) {
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.timeout = exports2.TimeoutError = void 0;
    var async_1 = /* @__PURE__ */ requireAsync();
    var isDate_1 = /* @__PURE__ */ requireIsDate();
    var lift_1 = /* @__PURE__ */ requireLift();
    var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
    var createErrorClass_1 = /* @__PURE__ */ requireCreateErrorClass();
    var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
    var executeSchedule_1 = /* @__PURE__ */ requireExecuteSchedule();
    exports2.TimeoutError = createErrorClass_1.createErrorClass(function(_super) {
      return function TimeoutErrorImpl(info) {
        if (info === void 0) {
          info = null;
        }
        _super(this);
        this.message = "Timeout has occurred";
        this.name = "TimeoutError";
        this.info = info;
      };
    });
    function timeout2(config2, schedulerArg) {
      var _a = isDate_1.isValidDate(config2) ? { first: config2 } : typeof config2 === "number" ? { each: config2 } : config2, first2 = _a.first, each = _a.each, _b = _a.with, _with = _b === void 0 ? timeoutErrorFactory : _b, _c = _a.scheduler, scheduler = _c === void 0 ? schedulerArg !== null && schedulerArg !== void 0 ? schedulerArg : async_1.asyncScheduler : _c, _d = _a.meta, meta = _d === void 0 ? null : _d;
      if (first2 == null && each == null) {
        throw new TypeError("No timeout provided.");
      }
      return lift_1.operate(function(source, subscriber) {
        var originalSourceSubscription;
        var timerSubscription;
        var lastValue = null;
        var seen = 0;
        var startTimer = function(delay2) {
          timerSubscription = executeSchedule_1.executeSchedule(subscriber, scheduler, function() {
            try {
              originalSourceSubscription.unsubscribe();
              innerFrom_1.innerFrom(_with({
                meta,
                lastValue,
                seen
              })).subscribe(subscriber);
            } catch (err) {
              subscriber.error(err);
            }
          }, delay2);
        };
        originalSourceSubscription = source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
          timerSubscription === null || timerSubscription === void 0 ? void 0 : timerSubscription.unsubscribe();
          seen++;
          subscriber.next(lastValue = value);
          each > 0 && startTimer(each);
        }, void 0, void 0, function() {
          if (!(timerSubscription === null || timerSubscription === void 0 ? void 0 : timerSubscription.closed)) {
            timerSubscription === null || timerSubscription === void 0 ? void 0 : timerSubscription.unsubscribe();
          }
          lastValue = null;
        }));
        !seen && startTimer(first2 != null ? typeof first2 === "number" ? first2 : +first2 - scheduler.now() : each);
      });
    }
    exports2.timeout = timeout2;
    function timeoutErrorFactory(info) {
      throw new exports2.TimeoutError(info);
    }
  })(timeout);
  return timeout;
}
var bindCallback = {};
var bindCallbackInternals = {};
var mapOneOrManyArgs = {};
var map = {};
var hasRequiredMap;
function requireMap() {
  if (hasRequiredMap) return map;
  hasRequiredMap = 1;
  Object.defineProperty(map, "__esModule", { value: true });
  map.map = void 0;
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  function map$1(project, thisArg) {
    return lift_1.operate(function(source, subscriber) {
      var index = 0;
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        subscriber.next(project.call(thisArg, value, index++));
      }));
    });
  }
  map.map = map$1;
  return map;
}
var hasRequiredMapOneOrManyArgs;
function requireMapOneOrManyArgs() {
  if (hasRequiredMapOneOrManyArgs) return mapOneOrManyArgs;
  hasRequiredMapOneOrManyArgs = 1;
  var __read = mapOneOrManyArgs && mapOneOrManyArgs.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error2) {
      e = { error: error2 };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray = mapOneOrManyArgs && mapOneOrManyArgs.__spreadArray || function(to, from2) {
    for (var i = 0, il = from2.length, j = to.length; i < il; i++, j++)
      to[j] = from2[i];
    return to;
  };
  Object.defineProperty(mapOneOrManyArgs, "__esModule", { value: true });
  mapOneOrManyArgs.mapOneOrManyArgs = void 0;
  var map_1 = /* @__PURE__ */ requireMap();
  var isArray = Array.isArray;
  function callOrApply(fn, args2) {
    return isArray(args2) ? fn.apply(void 0, __spreadArray([], __read(args2))) : fn(args2);
  }
  function mapOneOrManyArgs$1(fn) {
    return map_1.map(function(args2) {
      return callOrApply(fn, args2);
    });
  }
  mapOneOrManyArgs.mapOneOrManyArgs = mapOneOrManyArgs$1;
  return mapOneOrManyArgs;
}
var hasRequiredBindCallbackInternals;
function requireBindCallbackInternals() {
  if (hasRequiredBindCallbackInternals) return bindCallbackInternals;
  hasRequiredBindCallbackInternals = 1;
  var __read = bindCallbackInternals && bindCallbackInternals.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error2) {
      e = { error: error2 };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray = bindCallbackInternals && bindCallbackInternals.__spreadArray || function(to, from2) {
    for (var i = 0, il = from2.length, j = to.length; i < il; i++, j++)
      to[j] = from2[i];
    return to;
  };
  Object.defineProperty(bindCallbackInternals, "__esModule", { value: true });
  bindCallbackInternals.bindCallbackInternals = void 0;
  var isScheduler_1 = /* @__PURE__ */ requireIsScheduler();
  var Observable_1 = /* @__PURE__ */ requireObservable();
  var subscribeOn_1 = /* @__PURE__ */ requireSubscribeOn();
  var mapOneOrManyArgs_1 = /* @__PURE__ */ requireMapOneOrManyArgs();
  var observeOn_1 = /* @__PURE__ */ requireObserveOn();
  var AsyncSubject_1 = /* @__PURE__ */ requireAsyncSubject();
  function bindCallbackInternals$1(isNodeStyle, callbackFunc, resultSelector, scheduler) {
    if (resultSelector) {
      if (isScheduler_1.isScheduler(resultSelector)) {
        scheduler = resultSelector;
      } else {
        return function() {
          var args2 = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args2[_i] = arguments[_i];
          }
          return bindCallbackInternals$1(isNodeStyle, callbackFunc, scheduler).apply(this, args2).pipe(mapOneOrManyArgs_1.mapOneOrManyArgs(resultSelector));
        };
      }
    }
    if (scheduler) {
      return function() {
        var args2 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args2[_i] = arguments[_i];
        }
        return bindCallbackInternals$1(isNodeStyle, callbackFunc).apply(this, args2).pipe(subscribeOn_1.subscribeOn(scheduler), observeOn_1.observeOn(scheduler));
      };
    }
    return function() {
      var _this = this;
      var args2 = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args2[_i] = arguments[_i];
      }
      var subject = new AsyncSubject_1.AsyncSubject();
      var uninitialized = true;
      return new Observable_1.Observable(function(subscriber) {
        var subs = subject.subscribe(subscriber);
        if (uninitialized) {
          uninitialized = false;
          var isAsync_1 = false;
          var isComplete_1 = false;
          callbackFunc.apply(_this, __spreadArray(__spreadArray([], __read(args2)), [
            function() {
              var results = [];
              for (var _i2 = 0; _i2 < arguments.length; _i2++) {
                results[_i2] = arguments[_i2];
              }
              if (isNodeStyle) {
                var err = results.shift();
                if (err != null) {
                  subject.error(err);
                  return;
                }
              }
              subject.next(1 < results.length ? results : results[0]);
              isComplete_1 = true;
              if (isAsync_1) {
                subject.complete();
              }
            }
          ]));
          if (isComplete_1) {
            subject.complete();
          }
          isAsync_1 = true;
        }
        return subs;
      });
    };
  }
  bindCallbackInternals.bindCallbackInternals = bindCallbackInternals$1;
  return bindCallbackInternals;
}
var hasRequiredBindCallback;
function requireBindCallback() {
  if (hasRequiredBindCallback) return bindCallback;
  hasRequiredBindCallback = 1;
  Object.defineProperty(bindCallback, "__esModule", { value: true });
  bindCallback.bindCallback = void 0;
  var bindCallbackInternals_1 = /* @__PURE__ */ requireBindCallbackInternals();
  function bindCallback$1(callbackFunc, resultSelector, scheduler) {
    return bindCallbackInternals_1.bindCallbackInternals(false, callbackFunc, resultSelector, scheduler);
  }
  bindCallback.bindCallback = bindCallback$1;
  return bindCallback;
}
var bindNodeCallback = {};
var hasRequiredBindNodeCallback;
function requireBindNodeCallback() {
  if (hasRequiredBindNodeCallback) return bindNodeCallback;
  hasRequiredBindNodeCallback = 1;
  Object.defineProperty(bindNodeCallback, "__esModule", { value: true });
  bindNodeCallback.bindNodeCallback = void 0;
  var bindCallbackInternals_1 = /* @__PURE__ */ requireBindCallbackInternals();
  function bindNodeCallback$1(callbackFunc, resultSelector, scheduler) {
    return bindCallbackInternals_1.bindCallbackInternals(true, callbackFunc, resultSelector, scheduler);
  }
  bindNodeCallback.bindNodeCallback = bindNodeCallback$1;
  return bindNodeCallback;
}
var combineLatest$1 = {};
var argsArgArrayOrObject = {};
var hasRequiredArgsArgArrayOrObject;
function requireArgsArgArrayOrObject() {
  if (hasRequiredArgsArgArrayOrObject) return argsArgArrayOrObject;
  hasRequiredArgsArgArrayOrObject = 1;
  Object.defineProperty(argsArgArrayOrObject, "__esModule", { value: true });
  argsArgArrayOrObject.argsArgArrayOrObject = void 0;
  var isArray = Array.isArray;
  var getPrototypeOf = Object.getPrototypeOf, objectProto = Object.prototype, getKeys = Object.keys;
  function argsArgArrayOrObject$1(args2) {
    if (args2.length === 1) {
      var first_1 = args2[0];
      if (isArray(first_1)) {
        return { args: first_1, keys: null };
      }
      if (isPOJO(first_1)) {
        var keys = getKeys(first_1);
        return {
          args: keys.map(function(key) {
            return first_1[key];
          }),
          keys
        };
      }
    }
    return { args: args2, keys: null };
  }
  argsArgArrayOrObject.argsArgArrayOrObject = argsArgArrayOrObject$1;
  function isPOJO(obj) {
    return obj && typeof obj === "object" && getPrototypeOf(obj) === objectProto;
  }
  return argsArgArrayOrObject;
}
var createObject = {};
var hasRequiredCreateObject;
function requireCreateObject() {
  if (hasRequiredCreateObject) return createObject;
  hasRequiredCreateObject = 1;
  Object.defineProperty(createObject, "__esModule", { value: true });
  createObject.createObject = void 0;
  function createObject$1(keys, values) {
    return keys.reduce(function(result, key, i) {
      return result[key] = values[i], result;
    }, {});
  }
  createObject.createObject = createObject$1;
  return createObject;
}
var hasRequiredCombineLatest$1;
function requireCombineLatest$1() {
  if (hasRequiredCombineLatest$1) return combineLatest$1;
  hasRequiredCombineLatest$1 = 1;
  Object.defineProperty(combineLatest$1, "__esModule", { value: true });
  combineLatest$1.combineLatestInit = combineLatest$1.combineLatest = void 0;
  var Observable_1 = /* @__PURE__ */ requireObservable();
  var argsArgArrayOrObject_1 = /* @__PURE__ */ requireArgsArgArrayOrObject();
  var from_1 = /* @__PURE__ */ requireFrom();
  var identity_1 = /* @__PURE__ */ requireIdentity();
  var mapOneOrManyArgs_1 = /* @__PURE__ */ requireMapOneOrManyArgs();
  var args_1 = /* @__PURE__ */ requireArgs();
  var createObject_1 = /* @__PURE__ */ requireCreateObject();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  var executeSchedule_1 = /* @__PURE__ */ requireExecuteSchedule();
  function combineLatest2() {
    var args2 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args2[_i] = arguments[_i];
    }
    var scheduler = args_1.popScheduler(args2);
    var resultSelector = args_1.popResultSelector(args2);
    var _a = argsArgArrayOrObject_1.argsArgArrayOrObject(args2), observables = _a.args, keys = _a.keys;
    if (observables.length === 0) {
      return from_1.from([], scheduler);
    }
    var result = new Observable_1.Observable(combineLatestInit(observables, scheduler, keys ? function(values) {
      return createObject_1.createObject(keys, values);
    } : identity_1.identity));
    return resultSelector ? result.pipe(mapOneOrManyArgs_1.mapOneOrManyArgs(resultSelector)) : result;
  }
  combineLatest$1.combineLatest = combineLatest2;
  function combineLatestInit(observables, scheduler, valueTransform) {
    if (valueTransform === void 0) {
      valueTransform = identity_1.identity;
    }
    return function(subscriber) {
      maybeSchedule(scheduler, function() {
        var length = observables.length;
        var values = new Array(length);
        var active = length;
        var remainingFirstValues = length;
        var _loop_1 = function(i2) {
          maybeSchedule(scheduler, function() {
            var source = from_1.from(observables[i2], scheduler);
            var hasFirstValue = false;
            source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
              values[i2] = value;
              if (!hasFirstValue) {
                hasFirstValue = true;
                remainingFirstValues--;
              }
              if (!remainingFirstValues) {
                subscriber.next(valueTransform(values.slice()));
              }
            }, function() {
              if (!--active) {
                subscriber.complete();
              }
            }));
          }, subscriber);
        };
        for (var i = 0; i < length; i++) {
          _loop_1(i);
        }
      }, subscriber);
    };
  }
  combineLatest$1.combineLatestInit = combineLatestInit;
  function maybeSchedule(scheduler, execute, subscription) {
    if (scheduler) {
      executeSchedule_1.executeSchedule(subscription, scheduler, execute);
    } else {
      execute();
    }
  }
  return combineLatest$1;
}
var concat$1 = {};
var concatAll = {};
var mergeAll = {};
var mergeMap = {};
var mergeInternals = {};
var hasRequiredMergeInternals;
function requireMergeInternals() {
  if (hasRequiredMergeInternals) return mergeInternals;
  hasRequiredMergeInternals = 1;
  Object.defineProperty(mergeInternals, "__esModule", { value: true });
  mergeInternals.mergeInternals = void 0;
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  var executeSchedule_1 = /* @__PURE__ */ requireExecuteSchedule();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  function mergeInternals$1(source, subscriber, project, concurrent, onBeforeNext, expand2, innerSubScheduler, additionalFinalizer) {
    var buffer2 = [];
    var active = 0;
    var index = 0;
    var isComplete = false;
    var checkComplete = function() {
      if (isComplete && !buffer2.length && !active) {
        subscriber.complete();
      }
    };
    var outerNext = function(value) {
      return active < concurrent ? doInnerSub(value) : buffer2.push(value);
    };
    var doInnerSub = function(value) {
      expand2 && subscriber.next(value);
      active++;
      var innerComplete = false;
      innerFrom_1.innerFrom(project(value, index++)).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(innerValue) {
        onBeforeNext === null || onBeforeNext === void 0 ? void 0 : onBeforeNext(innerValue);
        if (expand2) {
          outerNext(innerValue);
        } else {
          subscriber.next(innerValue);
        }
      }, function() {
        innerComplete = true;
      }, void 0, function() {
        if (innerComplete) {
          try {
            active--;
            var _loop_1 = function() {
              var bufferedValue = buffer2.shift();
              if (innerSubScheduler) {
                executeSchedule_1.executeSchedule(subscriber, innerSubScheduler, function() {
                  return doInnerSub(bufferedValue);
                });
              } else {
                doInnerSub(bufferedValue);
              }
            };
            while (buffer2.length && active < concurrent) {
              _loop_1();
            }
            checkComplete();
          } catch (err) {
            subscriber.error(err);
          }
        }
      }));
    };
    source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, outerNext, function() {
      isComplete = true;
      checkComplete();
    }));
    return function() {
      additionalFinalizer === null || additionalFinalizer === void 0 ? void 0 : additionalFinalizer();
    };
  }
  mergeInternals.mergeInternals = mergeInternals$1;
  return mergeInternals;
}
var hasRequiredMergeMap;
function requireMergeMap() {
  if (hasRequiredMergeMap) return mergeMap;
  hasRequiredMergeMap = 1;
  Object.defineProperty(mergeMap, "__esModule", { value: true });
  mergeMap.mergeMap = void 0;
  var map_1 = /* @__PURE__ */ requireMap();
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  var lift_1 = /* @__PURE__ */ requireLift();
  var mergeInternals_1 = /* @__PURE__ */ requireMergeInternals();
  var isFunction_1 = /* @__PURE__ */ requireIsFunction();
  function mergeMap$1(project, resultSelector, concurrent) {
    if (concurrent === void 0) {
      concurrent = Infinity;
    }
    if (isFunction_1.isFunction(resultSelector)) {
      return mergeMap$1(function(a, i) {
        return map_1.map(function(b, ii) {
          return resultSelector(a, b, i, ii);
        })(innerFrom_1.innerFrom(project(a, i)));
      }, concurrent);
    } else if (typeof resultSelector === "number") {
      concurrent = resultSelector;
    }
    return lift_1.operate(function(source, subscriber) {
      return mergeInternals_1.mergeInternals(source, subscriber, project, concurrent);
    });
  }
  mergeMap.mergeMap = mergeMap$1;
  return mergeMap;
}
var hasRequiredMergeAll;
function requireMergeAll() {
  if (hasRequiredMergeAll) return mergeAll;
  hasRequiredMergeAll = 1;
  Object.defineProperty(mergeAll, "__esModule", { value: true });
  mergeAll.mergeAll = void 0;
  var mergeMap_1 = /* @__PURE__ */ requireMergeMap();
  var identity_1 = /* @__PURE__ */ requireIdentity();
  function mergeAll$1(concurrent) {
    if (concurrent === void 0) {
      concurrent = Infinity;
    }
    return mergeMap_1.mergeMap(identity_1.identity, concurrent);
  }
  mergeAll.mergeAll = mergeAll$1;
  return mergeAll;
}
var hasRequiredConcatAll;
function requireConcatAll() {
  if (hasRequiredConcatAll) return concatAll;
  hasRequiredConcatAll = 1;
  Object.defineProperty(concatAll, "__esModule", { value: true });
  concatAll.concatAll = void 0;
  var mergeAll_1 = /* @__PURE__ */ requireMergeAll();
  function concatAll$1() {
    return mergeAll_1.mergeAll(1);
  }
  concatAll.concatAll = concatAll$1;
  return concatAll;
}
var hasRequiredConcat$1;
function requireConcat$1() {
  if (hasRequiredConcat$1) return concat$1;
  hasRequiredConcat$1 = 1;
  Object.defineProperty(concat$1, "__esModule", { value: true });
  concat$1.concat = void 0;
  var concatAll_1 = /* @__PURE__ */ requireConcatAll();
  var args_1 = /* @__PURE__ */ requireArgs();
  var from_1 = /* @__PURE__ */ requireFrom();
  function concat2() {
    var args2 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args2[_i] = arguments[_i];
    }
    return concatAll_1.concatAll()(from_1.from(args2, args_1.popScheduler(args2)));
  }
  concat$1.concat = concat2;
  return concat$1;
}
var connectable = {};
var defer = {};
var hasRequiredDefer;
function requireDefer() {
  if (hasRequiredDefer) return defer;
  hasRequiredDefer = 1;
  Object.defineProperty(defer, "__esModule", { value: true });
  defer.defer = void 0;
  var Observable_1 = /* @__PURE__ */ requireObservable();
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  function defer$1(observableFactory) {
    return new Observable_1.Observable(function(subscriber) {
      innerFrom_1.innerFrom(observableFactory()).subscribe(subscriber);
    });
  }
  defer.defer = defer$1;
  return defer;
}
var hasRequiredConnectable;
function requireConnectable() {
  if (hasRequiredConnectable) return connectable;
  hasRequiredConnectable = 1;
  Object.defineProperty(connectable, "__esModule", { value: true });
  connectable.connectable = void 0;
  var Subject_1 = /* @__PURE__ */ requireSubject();
  var Observable_1 = /* @__PURE__ */ requireObservable();
  var defer_1 = /* @__PURE__ */ requireDefer();
  var DEFAULT_CONFIG = {
    connector: function() {
      return new Subject_1.Subject();
    },
    resetOnDisconnect: true
  };
  function connectable$1(source, config2) {
    if (config2 === void 0) {
      config2 = DEFAULT_CONFIG;
    }
    var connection = null;
    var connector = config2.connector, _a = config2.resetOnDisconnect, resetOnDisconnect = _a === void 0 ? true : _a;
    var subject = connector();
    var result = new Observable_1.Observable(function(subscriber) {
      return subject.subscribe(subscriber);
    });
    result.connect = function() {
      if (!connection || connection.closed) {
        connection = defer_1.defer(function() {
          return source;
        }).subscribe(subject);
        if (resetOnDisconnect) {
          connection.add(function() {
            return subject = connector();
          });
        }
      }
      return connection;
    };
    return result;
  }
  connectable.connectable = connectable$1;
  return connectable;
}
var forkJoin = {};
var hasRequiredForkJoin;
function requireForkJoin() {
  if (hasRequiredForkJoin) return forkJoin;
  hasRequiredForkJoin = 1;
  Object.defineProperty(forkJoin, "__esModule", { value: true });
  forkJoin.forkJoin = void 0;
  var Observable_1 = /* @__PURE__ */ requireObservable();
  var argsArgArrayOrObject_1 = /* @__PURE__ */ requireArgsArgArrayOrObject();
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  var args_1 = /* @__PURE__ */ requireArgs();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  var mapOneOrManyArgs_1 = /* @__PURE__ */ requireMapOneOrManyArgs();
  var createObject_1 = /* @__PURE__ */ requireCreateObject();
  function forkJoin$1() {
    var args2 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args2[_i] = arguments[_i];
    }
    var resultSelector = args_1.popResultSelector(args2);
    var _a = argsArgArrayOrObject_1.argsArgArrayOrObject(args2), sources = _a.args, keys = _a.keys;
    var result = new Observable_1.Observable(function(subscriber) {
      var length = sources.length;
      if (!length) {
        subscriber.complete();
        return;
      }
      var values = new Array(length);
      var remainingCompletions = length;
      var remainingEmissions = length;
      var _loop_1 = function(sourceIndex2) {
        var hasValue = false;
        innerFrom_1.innerFrom(sources[sourceIndex2]).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
          if (!hasValue) {
            hasValue = true;
            remainingEmissions--;
          }
          values[sourceIndex2] = value;
        }, function() {
          return remainingCompletions--;
        }, void 0, function() {
          if (!remainingCompletions || !hasValue) {
            if (!remainingEmissions) {
              subscriber.next(keys ? createObject_1.createObject(keys, values) : values);
            }
            subscriber.complete();
          }
        }));
      };
      for (var sourceIndex = 0; sourceIndex < length; sourceIndex++) {
        _loop_1(sourceIndex);
      }
    });
    return resultSelector ? result.pipe(mapOneOrManyArgs_1.mapOneOrManyArgs(resultSelector)) : result;
  }
  forkJoin.forkJoin = forkJoin$1;
  return forkJoin;
}
var fromEvent = {};
var hasRequiredFromEvent;
function requireFromEvent() {
  if (hasRequiredFromEvent) return fromEvent;
  hasRequiredFromEvent = 1;
  var __read = fromEvent && fromEvent.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error2) {
      e = { error: error2 };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  Object.defineProperty(fromEvent, "__esModule", { value: true });
  fromEvent.fromEvent = void 0;
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  var Observable_1 = /* @__PURE__ */ requireObservable();
  var mergeMap_1 = /* @__PURE__ */ requireMergeMap();
  var isArrayLike_1 = /* @__PURE__ */ requireIsArrayLike();
  var isFunction_1 = /* @__PURE__ */ requireIsFunction();
  var mapOneOrManyArgs_1 = /* @__PURE__ */ requireMapOneOrManyArgs();
  var nodeEventEmitterMethods = ["addListener", "removeListener"];
  var eventTargetMethods = ["addEventListener", "removeEventListener"];
  var jqueryMethods = ["on", "off"];
  function fromEvent$1(target, eventName, options, resultSelector) {
    if (isFunction_1.isFunction(options)) {
      resultSelector = options;
      options = void 0;
    }
    if (resultSelector) {
      return fromEvent$1(target, eventName, options).pipe(mapOneOrManyArgs_1.mapOneOrManyArgs(resultSelector));
    }
    var _a = __read(isEventTarget(target) ? eventTargetMethods.map(function(methodName) {
      return function(handler) {
        return target[methodName](eventName, handler, options);
      };
    }) : isNodeStyleEventEmitter(target) ? nodeEventEmitterMethods.map(toCommonHandlerRegistry(target, eventName)) : isJQueryStyleEventEmitter(target) ? jqueryMethods.map(toCommonHandlerRegistry(target, eventName)) : [], 2), add = _a[0], remove = _a[1];
    if (!add) {
      if (isArrayLike_1.isArrayLike(target)) {
        return mergeMap_1.mergeMap(function(subTarget) {
          return fromEvent$1(subTarget, eventName, options);
        })(innerFrom_1.innerFrom(target));
      }
    }
    if (!add) {
      throw new TypeError("Invalid event target");
    }
    return new Observable_1.Observable(function(subscriber) {
      var handler = function() {
        var args2 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args2[_i] = arguments[_i];
        }
        return subscriber.next(1 < args2.length ? args2 : args2[0]);
      };
      add(handler);
      return function() {
        return remove(handler);
      };
    });
  }
  fromEvent.fromEvent = fromEvent$1;
  function toCommonHandlerRegistry(target, eventName) {
    return function(methodName) {
      return function(handler) {
        return target[methodName](eventName, handler);
      };
    };
  }
  function isNodeStyleEventEmitter(target) {
    return isFunction_1.isFunction(target.addListener) && isFunction_1.isFunction(target.removeListener);
  }
  function isJQueryStyleEventEmitter(target) {
    return isFunction_1.isFunction(target.on) && isFunction_1.isFunction(target.off);
  }
  function isEventTarget(target) {
    return isFunction_1.isFunction(target.addEventListener) && isFunction_1.isFunction(target.removeEventListener);
  }
  return fromEvent;
}
var fromEventPattern = {};
var hasRequiredFromEventPattern;
function requireFromEventPattern() {
  if (hasRequiredFromEventPattern) return fromEventPattern;
  hasRequiredFromEventPattern = 1;
  Object.defineProperty(fromEventPattern, "__esModule", { value: true });
  fromEventPattern.fromEventPattern = void 0;
  var Observable_1 = /* @__PURE__ */ requireObservable();
  var isFunction_1 = /* @__PURE__ */ requireIsFunction();
  var mapOneOrManyArgs_1 = /* @__PURE__ */ requireMapOneOrManyArgs();
  function fromEventPattern$1(addHandler, removeHandler, resultSelector) {
    if (resultSelector) {
      return fromEventPattern$1(addHandler, removeHandler).pipe(mapOneOrManyArgs_1.mapOneOrManyArgs(resultSelector));
    }
    return new Observable_1.Observable(function(subscriber) {
      var handler = function() {
        var e = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          e[_i] = arguments[_i];
        }
        return subscriber.next(e.length === 1 ? e[0] : e);
      };
      var retValue = addHandler(handler);
      return isFunction_1.isFunction(removeHandler) ? function() {
        return removeHandler(handler, retValue);
      } : void 0;
    });
  }
  fromEventPattern.fromEventPattern = fromEventPattern$1;
  return fromEventPattern;
}
var generate = {};
var hasRequiredGenerate;
function requireGenerate() {
  if (hasRequiredGenerate) return generate;
  hasRequiredGenerate = 1;
  var __generator = generate && generate.__generator || function(thisArg, body) {
    var _2 = { label: 0, sent: function() {
      if (t[0] & 1) throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_2) try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _2.label++;
            return { value: op[1], done: false };
          case 5:
            _2.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _2.ops.pop();
            _2.trys.pop();
            continue;
          default:
            if (!(t = _2.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _2 = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _2.label = op[1];
              break;
            }
            if (op[0] === 6 && _2.label < t[1]) {
              _2.label = t[1];
              t = op;
              break;
            }
            if (t && _2.label < t[2]) {
              _2.label = t[2];
              _2.ops.push(op);
              break;
            }
            if (t[2]) _2.ops.pop();
            _2.trys.pop();
            continue;
        }
        op = body.call(thisArg, _2);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  Object.defineProperty(generate, "__esModule", { value: true });
  generate.generate = void 0;
  var identity_1 = /* @__PURE__ */ requireIdentity();
  var isScheduler_1 = /* @__PURE__ */ requireIsScheduler();
  var defer_1 = /* @__PURE__ */ requireDefer();
  var scheduleIterable_1 = /* @__PURE__ */ requireScheduleIterable();
  function generate$1(initialStateOrOptions, condition, iterate, resultSelectorOrScheduler, scheduler) {
    var _a, _b;
    var resultSelector;
    var initialState;
    if (arguments.length === 1) {
      _a = initialStateOrOptions, initialState = _a.initialState, condition = _a.condition, iterate = _a.iterate, _b = _a.resultSelector, resultSelector = _b === void 0 ? identity_1.identity : _b, scheduler = _a.scheduler;
    } else {
      initialState = initialStateOrOptions;
      if (!resultSelectorOrScheduler || isScheduler_1.isScheduler(resultSelectorOrScheduler)) {
        resultSelector = identity_1.identity;
        scheduler = resultSelectorOrScheduler;
      } else {
        resultSelector = resultSelectorOrScheduler;
      }
    }
    function gen() {
      var state;
      return __generator(this, function(_a2) {
        switch (_a2.label) {
          case 0:
            state = initialState;
            _a2.label = 1;
          case 1:
            if (!(!condition || condition(state))) return [3, 4];
            return [4, resultSelector(state)];
          case 2:
            _a2.sent();
            _a2.label = 3;
          case 3:
            state = iterate(state);
            return [3, 1];
          case 4:
            return [2];
        }
      });
    }
    return defer_1.defer(scheduler ? function() {
      return scheduleIterable_1.scheduleIterable(gen(), scheduler);
    } : gen);
  }
  generate.generate = generate$1;
  return generate;
}
var iif = {};
var hasRequiredIif;
function requireIif() {
  if (hasRequiredIif) return iif;
  hasRequiredIif = 1;
  Object.defineProperty(iif, "__esModule", { value: true });
  iif.iif = void 0;
  var defer_1 = /* @__PURE__ */ requireDefer();
  function iif$1(condition, trueResult, falseResult) {
    return defer_1.defer(function() {
      return condition() ? trueResult : falseResult;
    });
  }
  iif.iif = iif$1;
  return iif;
}
var interval = {};
var timer = {};
var hasRequiredTimer;
function requireTimer() {
  if (hasRequiredTimer) return timer;
  hasRequiredTimer = 1;
  Object.defineProperty(timer, "__esModule", { value: true });
  timer.timer = void 0;
  var Observable_1 = /* @__PURE__ */ requireObservable();
  var async_1 = /* @__PURE__ */ requireAsync();
  var isScheduler_1 = /* @__PURE__ */ requireIsScheduler();
  var isDate_1 = /* @__PURE__ */ requireIsDate();
  function timer$1(dueTime, intervalOrScheduler, scheduler) {
    if (dueTime === void 0) {
      dueTime = 0;
    }
    if (scheduler === void 0) {
      scheduler = async_1.async;
    }
    var intervalDuration = -1;
    if (intervalOrScheduler != null) {
      if (isScheduler_1.isScheduler(intervalOrScheduler)) {
        scheduler = intervalOrScheduler;
      } else {
        intervalDuration = intervalOrScheduler;
      }
    }
    return new Observable_1.Observable(function(subscriber) {
      var due = isDate_1.isValidDate(dueTime) ? +dueTime - scheduler.now() : dueTime;
      if (due < 0) {
        due = 0;
      }
      var n = 0;
      return scheduler.schedule(function() {
        if (!subscriber.closed) {
          subscriber.next(n++);
          if (0 <= intervalDuration) {
            this.schedule(void 0, intervalDuration);
          } else {
            subscriber.complete();
          }
        }
      }, due);
    });
  }
  timer.timer = timer$1;
  return timer;
}
var hasRequiredInterval;
function requireInterval() {
  if (hasRequiredInterval) return interval;
  hasRequiredInterval = 1;
  Object.defineProperty(interval, "__esModule", { value: true });
  interval.interval = void 0;
  var async_1 = /* @__PURE__ */ requireAsync();
  var timer_1 = /* @__PURE__ */ requireTimer();
  function interval$1(period, scheduler) {
    if (period === void 0) {
      period = 0;
    }
    if (scheduler === void 0) {
      scheduler = async_1.asyncScheduler;
    }
    if (period < 0) {
      period = 0;
    }
    return timer_1.timer(period, period, scheduler);
  }
  interval.interval = interval$1;
  return interval;
}
var merge$1 = {};
var hasRequiredMerge$1;
function requireMerge$1() {
  if (hasRequiredMerge$1) return merge$1;
  hasRequiredMerge$1 = 1;
  Object.defineProperty(merge$1, "__esModule", { value: true });
  merge$1.merge = void 0;
  var mergeAll_1 = /* @__PURE__ */ requireMergeAll();
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  var empty_1 = /* @__PURE__ */ requireEmpty();
  var args_1 = /* @__PURE__ */ requireArgs();
  var from_1 = /* @__PURE__ */ requireFrom();
  function merge2() {
    var args2 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args2[_i] = arguments[_i];
    }
    var scheduler = args_1.popScheduler(args2);
    var concurrent = args_1.popNumber(args2, Infinity);
    var sources = args2;
    return !sources.length ? empty_1.EMPTY : sources.length === 1 ? innerFrom_1.innerFrom(sources[0]) : mergeAll_1.mergeAll(concurrent)(from_1.from(sources, scheduler));
  }
  merge$1.merge = merge2;
  return merge$1;
}
var never = {};
var hasRequiredNever;
function requireNever() {
  if (hasRequiredNever) return never;
  hasRequiredNever = 1;
  (function(exports2) {
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.never = exports2.NEVER = void 0;
    var Observable_1 = /* @__PURE__ */ requireObservable();
    var noop_1 = /* @__PURE__ */ requireNoop();
    exports2.NEVER = new Observable_1.Observable(noop_1.noop);
    function never2() {
      return exports2.NEVER;
    }
    exports2.never = never2;
  })(never);
  return never;
}
var onErrorResumeNext = {};
var argsOrArgArray = {};
var hasRequiredArgsOrArgArray;
function requireArgsOrArgArray() {
  if (hasRequiredArgsOrArgArray) return argsOrArgArray;
  hasRequiredArgsOrArgArray = 1;
  Object.defineProperty(argsOrArgArray, "__esModule", { value: true });
  argsOrArgArray.argsOrArgArray = void 0;
  var isArray = Array.isArray;
  function argsOrArgArray$1(args2) {
    return args2.length === 1 && isArray(args2[0]) ? args2[0] : args2;
  }
  argsOrArgArray.argsOrArgArray = argsOrArgArray$1;
  return argsOrArgArray;
}
var hasRequiredOnErrorResumeNext;
function requireOnErrorResumeNext() {
  if (hasRequiredOnErrorResumeNext) return onErrorResumeNext;
  hasRequiredOnErrorResumeNext = 1;
  Object.defineProperty(onErrorResumeNext, "__esModule", { value: true });
  onErrorResumeNext.onErrorResumeNext = void 0;
  var Observable_1 = /* @__PURE__ */ requireObservable();
  var argsOrArgArray_1 = /* @__PURE__ */ requireArgsOrArgArray();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  var noop_1 = /* @__PURE__ */ requireNoop();
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  function onErrorResumeNext$1() {
    var sources = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      sources[_i] = arguments[_i];
    }
    var nextSources = argsOrArgArray_1.argsOrArgArray(sources);
    return new Observable_1.Observable(function(subscriber) {
      var sourceIndex = 0;
      var subscribeNext = function() {
        if (sourceIndex < nextSources.length) {
          var nextSource = void 0;
          try {
            nextSource = innerFrom_1.innerFrom(nextSources[sourceIndex++]);
          } catch (err) {
            subscribeNext();
            return;
          }
          var innerSubscriber = new OperatorSubscriber_1.OperatorSubscriber(subscriber, void 0, noop_1.noop, noop_1.noop);
          nextSource.subscribe(innerSubscriber);
          innerSubscriber.add(subscribeNext);
        } else {
          subscriber.complete();
        }
      };
      subscribeNext();
    });
  }
  onErrorResumeNext.onErrorResumeNext = onErrorResumeNext$1;
  return onErrorResumeNext;
}
var pairs = {};
var hasRequiredPairs;
function requirePairs() {
  if (hasRequiredPairs) return pairs;
  hasRequiredPairs = 1;
  Object.defineProperty(pairs, "__esModule", { value: true });
  pairs.pairs = void 0;
  var from_1 = /* @__PURE__ */ requireFrom();
  function pairs$1(obj, scheduler) {
    return from_1.from(Object.entries(obj), scheduler);
  }
  pairs.pairs = pairs$1;
  return pairs;
}
var partition = {};
var not = {};
var hasRequiredNot;
function requireNot() {
  if (hasRequiredNot) return not;
  hasRequiredNot = 1;
  Object.defineProperty(not, "__esModule", { value: true });
  not.not = void 0;
  function not$1(pred, thisArg) {
    return function(value, index) {
      return !pred.call(thisArg, value, index);
    };
  }
  not.not = not$1;
  return not;
}
var filter = {};
var hasRequiredFilter;
function requireFilter() {
  if (hasRequiredFilter) return filter;
  hasRequiredFilter = 1;
  Object.defineProperty(filter, "__esModule", { value: true });
  filter.filter = void 0;
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  function filter$1(predicate, thisArg) {
    return lift_1.operate(function(source, subscriber) {
      var index = 0;
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        return predicate.call(thisArg, value, index++) && subscriber.next(value);
      }));
    });
  }
  filter.filter = filter$1;
  return filter;
}
var hasRequiredPartition;
function requirePartition() {
  if (hasRequiredPartition) return partition;
  hasRequiredPartition = 1;
  Object.defineProperty(partition, "__esModule", { value: true });
  partition.partition = void 0;
  var not_1 = /* @__PURE__ */ requireNot();
  var filter_1 = /* @__PURE__ */ requireFilter();
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  function partition$1(source, predicate, thisArg) {
    return [filter_1.filter(predicate, thisArg)(innerFrom_1.innerFrom(source)), filter_1.filter(not_1.not(predicate, thisArg))(innerFrom_1.innerFrom(source))];
  }
  partition.partition = partition$1;
  return partition;
}
var race = {};
var hasRequiredRace;
function requireRace() {
  if (hasRequiredRace) return race;
  hasRequiredRace = 1;
  Object.defineProperty(race, "__esModule", { value: true });
  race.raceInit = race.race = void 0;
  var Observable_1 = /* @__PURE__ */ requireObservable();
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  var argsOrArgArray_1 = /* @__PURE__ */ requireArgsOrArgArray();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  function race$1() {
    var sources = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      sources[_i] = arguments[_i];
    }
    sources = argsOrArgArray_1.argsOrArgArray(sources);
    return sources.length === 1 ? innerFrom_1.innerFrom(sources[0]) : new Observable_1.Observable(raceInit(sources));
  }
  race.race = race$1;
  function raceInit(sources) {
    return function(subscriber) {
      var subscriptions = [];
      var _loop_1 = function(i2) {
        subscriptions.push(innerFrom_1.innerFrom(sources[i2]).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
          if (subscriptions) {
            for (var s = 0; s < subscriptions.length; s++) {
              s !== i2 && subscriptions[s].unsubscribe();
            }
            subscriptions = null;
          }
          subscriber.next(value);
        })));
      };
      for (var i = 0; subscriptions && !subscriber.closed && i < sources.length; i++) {
        _loop_1(i);
      }
    };
  }
  race.raceInit = raceInit;
  return race;
}
var range$1 = {};
var hasRequiredRange$1;
function requireRange$1() {
  if (hasRequiredRange$1) return range$1;
  hasRequiredRange$1 = 1;
  Object.defineProperty(range$1, "__esModule", { value: true });
  range$1.range = void 0;
  var Observable_1 = /* @__PURE__ */ requireObservable();
  var empty_1 = /* @__PURE__ */ requireEmpty();
  function range2(start, count2, scheduler) {
    if (count2 == null) {
      count2 = start;
      start = 0;
    }
    if (count2 <= 0) {
      return empty_1.EMPTY;
    }
    var end = count2 + start;
    return new Observable_1.Observable(scheduler ? function(subscriber) {
      var n = start;
      return scheduler.schedule(function() {
        if (n < end) {
          subscriber.next(n++);
          this.schedule();
        } else {
          subscriber.complete();
        }
      });
    } : function(subscriber) {
      var n = start;
      while (n < end && !subscriber.closed) {
        subscriber.next(n++);
      }
      subscriber.complete();
    });
  }
  range$1.range = range2;
  return range$1;
}
var using = {};
var hasRequiredUsing;
function requireUsing() {
  if (hasRequiredUsing) return using;
  hasRequiredUsing = 1;
  Object.defineProperty(using, "__esModule", { value: true });
  using.using = void 0;
  var Observable_1 = /* @__PURE__ */ requireObservable();
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  var empty_1 = /* @__PURE__ */ requireEmpty();
  function using$1(resourceFactory, observableFactory) {
    return new Observable_1.Observable(function(subscriber) {
      var resource = resourceFactory();
      var result = observableFactory(resource);
      var source = result ? innerFrom_1.innerFrom(result) : empty_1.EMPTY;
      source.subscribe(subscriber);
      return function() {
        if (resource) {
          resource.unsubscribe();
        }
      };
    });
  }
  using.using = using$1;
  return using;
}
var zip$1 = {};
var hasRequiredZip$1;
function requireZip$1() {
  if (hasRequiredZip$1) return zip$1;
  hasRequiredZip$1 = 1;
  var __read = zip$1 && zip$1.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error2) {
      e = { error: error2 };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray = zip$1 && zip$1.__spreadArray || function(to, from2) {
    for (var i = 0, il = from2.length, j = to.length; i < il; i++, j++)
      to[j] = from2[i];
    return to;
  };
  Object.defineProperty(zip$1, "__esModule", { value: true });
  zip$1.zip = void 0;
  var Observable_1 = /* @__PURE__ */ requireObservable();
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  var argsOrArgArray_1 = /* @__PURE__ */ requireArgsOrArgArray();
  var empty_1 = /* @__PURE__ */ requireEmpty();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  var args_1 = /* @__PURE__ */ requireArgs();
  function zip2() {
    var args2 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args2[_i] = arguments[_i];
    }
    var resultSelector = args_1.popResultSelector(args2);
    var sources = argsOrArgArray_1.argsOrArgArray(args2);
    return sources.length ? new Observable_1.Observable(function(subscriber) {
      var buffers = sources.map(function() {
        return [];
      });
      var completed = sources.map(function() {
        return false;
      });
      subscriber.add(function() {
        buffers = completed = null;
      });
      var _loop_1 = function(sourceIndex2) {
        innerFrom_1.innerFrom(sources[sourceIndex2]).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
          buffers[sourceIndex2].push(value);
          if (buffers.every(function(buffer2) {
            return buffer2.length;
          })) {
            var result = buffers.map(function(buffer2) {
              return buffer2.shift();
            });
            subscriber.next(resultSelector ? resultSelector.apply(void 0, __spreadArray([], __read(result))) : result);
            if (buffers.some(function(buffer2, i) {
              return !buffer2.length && completed[i];
            })) {
              subscriber.complete();
            }
          }
        }, function() {
          completed[sourceIndex2] = true;
          !buffers[sourceIndex2].length && subscriber.complete();
        }));
      };
      for (var sourceIndex = 0; !subscriber.closed && sourceIndex < sources.length; sourceIndex++) {
        _loop_1(sourceIndex);
      }
      return function() {
        buffers = completed = null;
      };
    }) : empty_1.EMPTY;
  }
  zip$1.zip = zip2;
  return zip$1;
}
var types = {};
var hasRequiredTypes;
function requireTypes() {
  if (hasRequiredTypes) return types;
  hasRequiredTypes = 1;
  Object.defineProperty(types, "__esModule", { value: true });
  return types;
}
var audit = {};
var hasRequiredAudit;
function requireAudit() {
  if (hasRequiredAudit) return audit;
  hasRequiredAudit = 1;
  Object.defineProperty(audit, "__esModule", { value: true });
  audit.audit = void 0;
  var lift_1 = /* @__PURE__ */ requireLift();
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  function audit$1(durationSelector) {
    return lift_1.operate(function(source, subscriber) {
      var hasValue = false;
      var lastValue = null;
      var durationSubscriber = null;
      var isComplete = false;
      var endDuration = function() {
        durationSubscriber === null || durationSubscriber === void 0 ? void 0 : durationSubscriber.unsubscribe();
        durationSubscriber = null;
        if (hasValue) {
          hasValue = false;
          var value = lastValue;
          lastValue = null;
          subscriber.next(value);
        }
        isComplete && subscriber.complete();
      };
      var cleanupDuration = function() {
        durationSubscriber = null;
        isComplete && subscriber.complete();
      };
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        hasValue = true;
        lastValue = value;
        if (!durationSubscriber) {
          innerFrom_1.innerFrom(durationSelector(value)).subscribe(durationSubscriber = OperatorSubscriber_1.createOperatorSubscriber(subscriber, endDuration, cleanupDuration));
        }
      }, function() {
        isComplete = true;
        (!hasValue || !durationSubscriber || durationSubscriber.closed) && subscriber.complete();
      }));
    });
  }
  audit.audit = audit$1;
  return audit;
}
var auditTime = {};
var hasRequiredAuditTime;
function requireAuditTime() {
  if (hasRequiredAuditTime) return auditTime;
  hasRequiredAuditTime = 1;
  Object.defineProperty(auditTime, "__esModule", { value: true });
  auditTime.auditTime = void 0;
  var async_1 = /* @__PURE__ */ requireAsync();
  var audit_1 = /* @__PURE__ */ requireAudit();
  var timer_1 = /* @__PURE__ */ requireTimer();
  function auditTime$1(duration, scheduler) {
    if (scheduler === void 0) {
      scheduler = async_1.asyncScheduler;
    }
    return audit_1.audit(function() {
      return timer_1.timer(duration, scheduler);
    });
  }
  auditTime.auditTime = auditTime$1;
  return auditTime;
}
var buffer = {};
var hasRequiredBuffer;
function requireBuffer() {
  if (hasRequiredBuffer) return buffer;
  hasRequiredBuffer = 1;
  Object.defineProperty(buffer, "__esModule", { value: true });
  buffer.buffer = void 0;
  var lift_1 = /* @__PURE__ */ requireLift();
  var noop_1 = /* @__PURE__ */ requireNoop();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  function buffer$1(closingNotifier) {
    return lift_1.operate(function(source, subscriber) {
      var currentBuffer = [];
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        return currentBuffer.push(value);
      }, function() {
        subscriber.next(currentBuffer);
        subscriber.complete();
      }));
      innerFrom_1.innerFrom(closingNotifier).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function() {
        var b = currentBuffer;
        currentBuffer = [];
        subscriber.next(b);
      }, noop_1.noop));
      return function() {
        currentBuffer = null;
      };
    });
  }
  buffer.buffer = buffer$1;
  return buffer;
}
var bufferCount = {};
var hasRequiredBufferCount;
function requireBufferCount() {
  if (hasRequiredBufferCount) return bufferCount;
  hasRequiredBufferCount = 1;
  var __values = bufferCount && bufferCount.__values || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  Object.defineProperty(bufferCount, "__esModule", { value: true });
  bufferCount.bufferCount = void 0;
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  var arrRemove_1 = /* @__PURE__ */ requireArrRemove();
  function bufferCount$1(bufferSize, startBufferEvery) {
    if (startBufferEvery === void 0) {
      startBufferEvery = null;
    }
    startBufferEvery = startBufferEvery !== null && startBufferEvery !== void 0 ? startBufferEvery : bufferSize;
    return lift_1.operate(function(source, subscriber) {
      var buffers = [];
      var count2 = 0;
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        var e_1, _a, e_2, _b;
        var toEmit = null;
        if (count2++ % startBufferEvery === 0) {
          buffers.push([]);
        }
        try {
          for (var buffers_1 = __values(buffers), buffers_1_1 = buffers_1.next(); !buffers_1_1.done; buffers_1_1 = buffers_1.next()) {
            var buffer2 = buffers_1_1.value;
            buffer2.push(value);
            if (bufferSize <= buffer2.length) {
              toEmit = toEmit !== null && toEmit !== void 0 ? toEmit : [];
              toEmit.push(buffer2);
            }
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (buffers_1_1 && !buffers_1_1.done && (_a = buffers_1.return)) _a.call(buffers_1);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
        if (toEmit) {
          try {
            for (var toEmit_1 = __values(toEmit), toEmit_1_1 = toEmit_1.next(); !toEmit_1_1.done; toEmit_1_1 = toEmit_1.next()) {
              var buffer2 = toEmit_1_1.value;
              arrRemove_1.arrRemove(buffers, buffer2);
              subscriber.next(buffer2);
            }
          } catch (e_2_1) {
            e_2 = { error: e_2_1 };
          } finally {
            try {
              if (toEmit_1_1 && !toEmit_1_1.done && (_b = toEmit_1.return)) _b.call(toEmit_1);
            } finally {
              if (e_2) throw e_2.error;
            }
          }
        }
      }, function() {
        var e_3, _a;
        try {
          for (var buffers_2 = __values(buffers), buffers_2_1 = buffers_2.next(); !buffers_2_1.done; buffers_2_1 = buffers_2.next()) {
            var buffer2 = buffers_2_1.value;
            subscriber.next(buffer2);
          }
        } catch (e_3_1) {
          e_3 = { error: e_3_1 };
        } finally {
          try {
            if (buffers_2_1 && !buffers_2_1.done && (_a = buffers_2.return)) _a.call(buffers_2);
          } finally {
            if (e_3) throw e_3.error;
          }
        }
        subscriber.complete();
      }, void 0, function() {
        buffers = null;
      }));
    });
  }
  bufferCount.bufferCount = bufferCount$1;
  return bufferCount;
}
var bufferTime = {};
var hasRequiredBufferTime;
function requireBufferTime() {
  if (hasRequiredBufferTime) return bufferTime;
  hasRequiredBufferTime = 1;
  var __values = bufferTime && bufferTime.__values || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  Object.defineProperty(bufferTime, "__esModule", { value: true });
  bufferTime.bufferTime = void 0;
  var Subscription_1 = /* @__PURE__ */ requireSubscription();
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  var arrRemove_1 = /* @__PURE__ */ requireArrRemove();
  var async_1 = /* @__PURE__ */ requireAsync();
  var args_1 = /* @__PURE__ */ requireArgs();
  var executeSchedule_1 = /* @__PURE__ */ requireExecuteSchedule();
  function bufferTime$1(bufferTimeSpan) {
    var _a, _b;
    var otherArgs = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      otherArgs[_i - 1] = arguments[_i];
    }
    var scheduler = (_a = args_1.popScheduler(otherArgs)) !== null && _a !== void 0 ? _a : async_1.asyncScheduler;
    var bufferCreationInterval = (_b = otherArgs[0]) !== null && _b !== void 0 ? _b : null;
    var maxBufferSize = otherArgs[1] || Infinity;
    return lift_1.operate(function(source, subscriber) {
      var bufferRecords = [];
      var restartOnEmit = false;
      var emit = function(record) {
        var buffer2 = record.buffer, subs = record.subs;
        subs.unsubscribe();
        arrRemove_1.arrRemove(bufferRecords, record);
        subscriber.next(buffer2);
        restartOnEmit && startBuffer();
      };
      var startBuffer = function() {
        if (bufferRecords) {
          var subs = new Subscription_1.Subscription();
          subscriber.add(subs);
          var buffer2 = [];
          var record_1 = {
            buffer: buffer2,
            subs
          };
          bufferRecords.push(record_1);
          executeSchedule_1.executeSchedule(subs, scheduler, function() {
            return emit(record_1);
          }, bufferTimeSpan);
        }
      };
      if (bufferCreationInterval !== null && bufferCreationInterval >= 0) {
        executeSchedule_1.executeSchedule(subscriber, scheduler, startBuffer, bufferCreationInterval, true);
      } else {
        restartOnEmit = true;
      }
      startBuffer();
      var bufferTimeSubscriber = OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        var e_1, _a2;
        var recordsCopy = bufferRecords.slice();
        try {
          for (var recordsCopy_1 = __values(recordsCopy), recordsCopy_1_1 = recordsCopy_1.next(); !recordsCopy_1_1.done; recordsCopy_1_1 = recordsCopy_1.next()) {
            var record = recordsCopy_1_1.value;
            var buffer2 = record.buffer;
            buffer2.push(value);
            maxBufferSize <= buffer2.length && emit(record);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (recordsCopy_1_1 && !recordsCopy_1_1.done && (_a2 = recordsCopy_1.return)) _a2.call(recordsCopy_1);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
      }, function() {
        while (bufferRecords === null || bufferRecords === void 0 ? void 0 : bufferRecords.length) {
          subscriber.next(bufferRecords.shift().buffer);
        }
        bufferTimeSubscriber === null || bufferTimeSubscriber === void 0 ? void 0 : bufferTimeSubscriber.unsubscribe();
        subscriber.complete();
        subscriber.unsubscribe();
      }, void 0, function() {
        return bufferRecords = null;
      });
      source.subscribe(bufferTimeSubscriber);
    });
  }
  bufferTime.bufferTime = bufferTime$1;
  return bufferTime;
}
var bufferToggle = {};
var hasRequiredBufferToggle;
function requireBufferToggle() {
  if (hasRequiredBufferToggle) return bufferToggle;
  hasRequiredBufferToggle = 1;
  var __values = bufferToggle && bufferToggle.__values || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  Object.defineProperty(bufferToggle, "__esModule", { value: true });
  bufferToggle.bufferToggle = void 0;
  var Subscription_1 = /* @__PURE__ */ requireSubscription();
  var lift_1 = /* @__PURE__ */ requireLift();
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  var noop_1 = /* @__PURE__ */ requireNoop();
  var arrRemove_1 = /* @__PURE__ */ requireArrRemove();
  function bufferToggle$1(openings, closingSelector) {
    return lift_1.operate(function(source, subscriber) {
      var buffers = [];
      innerFrom_1.innerFrom(openings).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(openValue) {
        var buffer2 = [];
        buffers.push(buffer2);
        var closingSubscription = new Subscription_1.Subscription();
        var emitBuffer = function() {
          arrRemove_1.arrRemove(buffers, buffer2);
          subscriber.next(buffer2);
          closingSubscription.unsubscribe();
        };
        closingSubscription.add(innerFrom_1.innerFrom(closingSelector(openValue)).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, emitBuffer, noop_1.noop)));
      }, noop_1.noop));
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        var e_1, _a;
        try {
          for (var buffers_1 = __values(buffers), buffers_1_1 = buffers_1.next(); !buffers_1_1.done; buffers_1_1 = buffers_1.next()) {
            var buffer2 = buffers_1_1.value;
            buffer2.push(value);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (buffers_1_1 && !buffers_1_1.done && (_a = buffers_1.return)) _a.call(buffers_1);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
      }, function() {
        while (buffers.length > 0) {
          subscriber.next(buffers.shift());
        }
        subscriber.complete();
      }));
    });
  }
  bufferToggle.bufferToggle = bufferToggle$1;
  return bufferToggle;
}
var bufferWhen = {};
var hasRequiredBufferWhen;
function requireBufferWhen() {
  if (hasRequiredBufferWhen) return bufferWhen;
  hasRequiredBufferWhen = 1;
  Object.defineProperty(bufferWhen, "__esModule", { value: true });
  bufferWhen.bufferWhen = void 0;
  var lift_1 = /* @__PURE__ */ requireLift();
  var noop_1 = /* @__PURE__ */ requireNoop();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  function bufferWhen$1(closingSelector) {
    return lift_1.operate(function(source, subscriber) {
      var buffer2 = null;
      var closingSubscriber = null;
      var openBuffer = function() {
        closingSubscriber === null || closingSubscriber === void 0 ? void 0 : closingSubscriber.unsubscribe();
        var b = buffer2;
        buffer2 = [];
        b && subscriber.next(b);
        innerFrom_1.innerFrom(closingSelector()).subscribe(closingSubscriber = OperatorSubscriber_1.createOperatorSubscriber(subscriber, openBuffer, noop_1.noop));
      };
      openBuffer();
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        return buffer2 === null || buffer2 === void 0 ? void 0 : buffer2.push(value);
      }, function() {
        buffer2 && subscriber.next(buffer2);
        subscriber.complete();
      }, void 0, function() {
        return buffer2 = closingSubscriber = null;
      }));
    });
  }
  bufferWhen.bufferWhen = bufferWhen$1;
  return bufferWhen;
}
var catchError = {};
var hasRequiredCatchError;
function requireCatchError() {
  if (hasRequiredCatchError) return catchError;
  hasRequiredCatchError = 1;
  Object.defineProperty(catchError, "__esModule", { value: true });
  catchError.catchError = void 0;
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  var lift_1 = /* @__PURE__ */ requireLift();
  function catchError$1(selector) {
    return lift_1.operate(function(source, subscriber) {
      var innerSub = null;
      var syncUnsub = false;
      var handledResult;
      innerSub = source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, void 0, void 0, function(err) {
        handledResult = innerFrom_1.innerFrom(selector(err, catchError$1(selector)(source)));
        if (innerSub) {
          innerSub.unsubscribe();
          innerSub = null;
          handledResult.subscribe(subscriber);
        } else {
          syncUnsub = true;
        }
      }));
      if (syncUnsub) {
        innerSub.unsubscribe();
        innerSub = null;
        handledResult.subscribe(subscriber);
      }
    });
  }
  catchError.catchError = catchError$1;
  return catchError;
}
var combineAll = {};
var combineLatestAll = {};
var joinAllInternals = {};
var toArray = {};
var reduce = {};
var scanInternals = {};
var hasRequiredScanInternals;
function requireScanInternals() {
  if (hasRequiredScanInternals) return scanInternals;
  hasRequiredScanInternals = 1;
  Object.defineProperty(scanInternals, "__esModule", { value: true });
  scanInternals.scanInternals = void 0;
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  function scanInternals$1(accumulator, seed, hasSeed, emitOnNext, emitBeforeComplete) {
    return function(source, subscriber) {
      var hasState = hasSeed;
      var state = seed;
      var index = 0;
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        var i = index++;
        state = hasState ? accumulator(state, value, i) : (hasState = true, value);
        emitOnNext && subscriber.next(state);
      }, emitBeforeComplete && function() {
        hasState && subscriber.next(state);
        subscriber.complete();
      }));
    };
  }
  scanInternals.scanInternals = scanInternals$1;
  return scanInternals;
}
var hasRequiredReduce;
function requireReduce() {
  if (hasRequiredReduce) return reduce;
  hasRequiredReduce = 1;
  Object.defineProperty(reduce, "__esModule", { value: true });
  reduce.reduce = void 0;
  var scanInternals_1 = /* @__PURE__ */ requireScanInternals();
  var lift_1 = /* @__PURE__ */ requireLift();
  function reduce$1(accumulator, seed) {
    return lift_1.operate(scanInternals_1.scanInternals(accumulator, seed, arguments.length >= 2, false, true));
  }
  reduce.reduce = reduce$1;
  return reduce;
}
var hasRequiredToArray;
function requireToArray() {
  if (hasRequiredToArray) return toArray;
  hasRequiredToArray = 1;
  Object.defineProperty(toArray, "__esModule", { value: true });
  toArray.toArray = void 0;
  var reduce_1 = /* @__PURE__ */ requireReduce();
  var lift_1 = /* @__PURE__ */ requireLift();
  var arrReducer = function(arr, value) {
    return arr.push(value), arr;
  };
  function toArray$1() {
    return lift_1.operate(function(source, subscriber) {
      reduce_1.reduce(arrReducer, [])(source).subscribe(subscriber);
    });
  }
  toArray.toArray = toArray$1;
  return toArray;
}
var hasRequiredJoinAllInternals;
function requireJoinAllInternals() {
  if (hasRequiredJoinAllInternals) return joinAllInternals;
  hasRequiredJoinAllInternals = 1;
  Object.defineProperty(joinAllInternals, "__esModule", { value: true });
  joinAllInternals.joinAllInternals = void 0;
  var identity_1 = /* @__PURE__ */ requireIdentity();
  var mapOneOrManyArgs_1 = /* @__PURE__ */ requireMapOneOrManyArgs();
  var pipe_1 = /* @__PURE__ */ requirePipe();
  var mergeMap_1 = /* @__PURE__ */ requireMergeMap();
  var toArray_1 = /* @__PURE__ */ requireToArray();
  function joinAllInternals$1(joinFn, project) {
    return pipe_1.pipe(toArray_1.toArray(), mergeMap_1.mergeMap(function(sources) {
      return joinFn(sources);
    }), project ? mapOneOrManyArgs_1.mapOneOrManyArgs(project) : identity_1.identity);
  }
  joinAllInternals.joinAllInternals = joinAllInternals$1;
  return joinAllInternals;
}
var hasRequiredCombineLatestAll;
function requireCombineLatestAll() {
  if (hasRequiredCombineLatestAll) return combineLatestAll;
  hasRequiredCombineLatestAll = 1;
  Object.defineProperty(combineLatestAll, "__esModule", { value: true });
  combineLatestAll.combineLatestAll = void 0;
  var combineLatest_1 = /* @__PURE__ */ requireCombineLatest$1();
  var joinAllInternals_1 = /* @__PURE__ */ requireJoinAllInternals();
  function combineLatestAll$1(project) {
    return joinAllInternals_1.joinAllInternals(combineLatest_1.combineLatest, project);
  }
  combineLatestAll.combineLatestAll = combineLatestAll$1;
  return combineLatestAll;
}
var hasRequiredCombineAll;
function requireCombineAll() {
  if (hasRequiredCombineAll) return combineAll;
  hasRequiredCombineAll = 1;
  Object.defineProperty(combineAll, "__esModule", { value: true });
  combineAll.combineAll = void 0;
  var combineLatestAll_1 = /* @__PURE__ */ requireCombineLatestAll();
  combineAll.combineAll = combineLatestAll_1.combineLatestAll;
  return combineAll;
}
var combineLatestWith = {};
var combineLatest = {};
var hasRequiredCombineLatest;
function requireCombineLatest() {
  if (hasRequiredCombineLatest) return combineLatest;
  hasRequiredCombineLatest = 1;
  var __read = combineLatest && combineLatest.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error2) {
      e = { error: error2 };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray = combineLatest && combineLatest.__spreadArray || function(to, from2) {
    for (var i = 0, il = from2.length, j = to.length; i < il; i++, j++)
      to[j] = from2[i];
    return to;
  };
  Object.defineProperty(combineLatest, "__esModule", { value: true });
  combineLatest.combineLatest = void 0;
  var combineLatest_1 = /* @__PURE__ */ requireCombineLatest$1();
  var lift_1 = /* @__PURE__ */ requireLift();
  var argsOrArgArray_1 = /* @__PURE__ */ requireArgsOrArgArray();
  var mapOneOrManyArgs_1 = /* @__PURE__ */ requireMapOneOrManyArgs();
  var pipe_1 = /* @__PURE__ */ requirePipe();
  var args_1 = /* @__PURE__ */ requireArgs();
  function combineLatest$12() {
    var args2 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args2[_i] = arguments[_i];
    }
    var resultSelector = args_1.popResultSelector(args2);
    return resultSelector ? pipe_1.pipe(combineLatest$12.apply(void 0, __spreadArray([], __read(args2))), mapOneOrManyArgs_1.mapOneOrManyArgs(resultSelector)) : lift_1.operate(function(source, subscriber) {
      combineLatest_1.combineLatestInit(__spreadArray([source], __read(argsOrArgArray_1.argsOrArgArray(args2))))(subscriber);
    });
  }
  combineLatest.combineLatest = combineLatest$12;
  return combineLatest;
}
var hasRequiredCombineLatestWith;
function requireCombineLatestWith() {
  if (hasRequiredCombineLatestWith) return combineLatestWith;
  hasRequiredCombineLatestWith = 1;
  var __read = combineLatestWith && combineLatestWith.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error2) {
      e = { error: error2 };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray = combineLatestWith && combineLatestWith.__spreadArray || function(to, from2) {
    for (var i = 0, il = from2.length, j = to.length; i < il; i++, j++)
      to[j] = from2[i];
    return to;
  };
  Object.defineProperty(combineLatestWith, "__esModule", { value: true });
  combineLatestWith.combineLatestWith = void 0;
  var combineLatest_1 = /* @__PURE__ */ requireCombineLatest();
  function combineLatestWith$1() {
    var otherSources = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      otherSources[_i] = arguments[_i];
    }
    return combineLatest_1.combineLatest.apply(void 0, __spreadArray([], __read(otherSources)));
  }
  combineLatestWith.combineLatestWith = combineLatestWith$1;
  return combineLatestWith;
}
var concatMap = {};
var hasRequiredConcatMap;
function requireConcatMap() {
  if (hasRequiredConcatMap) return concatMap;
  hasRequiredConcatMap = 1;
  Object.defineProperty(concatMap, "__esModule", { value: true });
  concatMap.concatMap = void 0;
  var mergeMap_1 = /* @__PURE__ */ requireMergeMap();
  var isFunction_1 = /* @__PURE__ */ requireIsFunction();
  function concatMap$1(project, resultSelector) {
    return isFunction_1.isFunction(resultSelector) ? mergeMap_1.mergeMap(project, resultSelector, 1) : mergeMap_1.mergeMap(project, 1);
  }
  concatMap.concatMap = concatMap$1;
  return concatMap;
}
var concatMapTo = {};
var hasRequiredConcatMapTo;
function requireConcatMapTo() {
  if (hasRequiredConcatMapTo) return concatMapTo;
  hasRequiredConcatMapTo = 1;
  Object.defineProperty(concatMapTo, "__esModule", { value: true });
  concatMapTo.concatMapTo = void 0;
  var concatMap_1 = /* @__PURE__ */ requireConcatMap();
  var isFunction_1 = /* @__PURE__ */ requireIsFunction();
  function concatMapTo$1(innerObservable, resultSelector) {
    return isFunction_1.isFunction(resultSelector) ? concatMap_1.concatMap(function() {
      return innerObservable;
    }, resultSelector) : concatMap_1.concatMap(function() {
      return innerObservable;
    });
  }
  concatMapTo.concatMapTo = concatMapTo$1;
  return concatMapTo;
}
var concatWith = {};
var concat = {};
var hasRequiredConcat;
function requireConcat() {
  if (hasRequiredConcat) return concat;
  hasRequiredConcat = 1;
  var __read = concat && concat.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error2) {
      e = { error: error2 };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray = concat && concat.__spreadArray || function(to, from2) {
    for (var i = 0, il = from2.length, j = to.length; i < il; i++, j++)
      to[j] = from2[i];
    return to;
  };
  Object.defineProperty(concat, "__esModule", { value: true });
  concat.concat = void 0;
  var lift_1 = /* @__PURE__ */ requireLift();
  var concatAll_1 = /* @__PURE__ */ requireConcatAll();
  var args_1 = /* @__PURE__ */ requireArgs();
  var from_1 = /* @__PURE__ */ requireFrom();
  function concat$12() {
    var args2 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args2[_i] = arguments[_i];
    }
    var scheduler = args_1.popScheduler(args2);
    return lift_1.operate(function(source, subscriber) {
      concatAll_1.concatAll()(from_1.from(__spreadArray([source], __read(args2)), scheduler)).subscribe(subscriber);
    });
  }
  concat.concat = concat$12;
  return concat;
}
var hasRequiredConcatWith;
function requireConcatWith() {
  if (hasRequiredConcatWith) return concatWith;
  hasRequiredConcatWith = 1;
  var __read = concatWith && concatWith.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error2) {
      e = { error: error2 };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray = concatWith && concatWith.__spreadArray || function(to, from2) {
    for (var i = 0, il = from2.length, j = to.length; i < il; i++, j++)
      to[j] = from2[i];
    return to;
  };
  Object.defineProperty(concatWith, "__esModule", { value: true });
  concatWith.concatWith = void 0;
  var concat_1 = /* @__PURE__ */ requireConcat();
  function concatWith$1() {
    var otherSources = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      otherSources[_i] = arguments[_i];
    }
    return concat_1.concat.apply(void 0, __spreadArray([], __read(otherSources)));
  }
  concatWith.concatWith = concatWith$1;
  return concatWith;
}
var connect = {};
var fromSubscribable = {};
var hasRequiredFromSubscribable;
function requireFromSubscribable() {
  if (hasRequiredFromSubscribable) return fromSubscribable;
  hasRequiredFromSubscribable = 1;
  Object.defineProperty(fromSubscribable, "__esModule", { value: true });
  fromSubscribable.fromSubscribable = void 0;
  var Observable_1 = /* @__PURE__ */ requireObservable();
  function fromSubscribable$1(subscribable) {
    return new Observable_1.Observable(function(subscriber) {
      return subscribable.subscribe(subscriber);
    });
  }
  fromSubscribable.fromSubscribable = fromSubscribable$1;
  return fromSubscribable;
}
var hasRequiredConnect;
function requireConnect() {
  if (hasRequiredConnect) return connect;
  hasRequiredConnect = 1;
  Object.defineProperty(connect, "__esModule", { value: true });
  connect.connect = void 0;
  var Subject_1 = /* @__PURE__ */ requireSubject();
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  var lift_1 = /* @__PURE__ */ requireLift();
  var fromSubscribable_1 = /* @__PURE__ */ requireFromSubscribable();
  var DEFAULT_CONFIG = {
    connector: function() {
      return new Subject_1.Subject();
    }
  };
  function connect$1(selector, config2) {
    if (config2 === void 0) {
      config2 = DEFAULT_CONFIG;
    }
    var connector = config2.connector;
    return lift_1.operate(function(source, subscriber) {
      var subject = connector();
      innerFrom_1.innerFrom(selector(fromSubscribable_1.fromSubscribable(subject))).subscribe(subscriber);
      subscriber.add(source.subscribe(subject));
    });
  }
  connect.connect = connect$1;
  return connect;
}
var count = {};
var hasRequiredCount;
function requireCount() {
  if (hasRequiredCount) return count;
  hasRequiredCount = 1;
  Object.defineProperty(count, "__esModule", { value: true });
  count.count = void 0;
  var reduce_1 = /* @__PURE__ */ requireReduce();
  function count$1(predicate) {
    return reduce_1.reduce(function(total, value, i) {
      return !predicate || predicate(value, i) ? total + 1 : total;
    }, 0);
  }
  count.count = count$1;
  return count;
}
var debounce = {};
var hasRequiredDebounce;
function requireDebounce() {
  if (hasRequiredDebounce) return debounce;
  hasRequiredDebounce = 1;
  Object.defineProperty(debounce, "__esModule", { value: true });
  debounce.debounce = void 0;
  var lift_1 = /* @__PURE__ */ requireLift();
  var noop_1 = /* @__PURE__ */ requireNoop();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  function debounce$1(durationSelector) {
    return lift_1.operate(function(source, subscriber) {
      var hasValue = false;
      var lastValue = null;
      var durationSubscriber = null;
      var emit = function() {
        durationSubscriber === null || durationSubscriber === void 0 ? void 0 : durationSubscriber.unsubscribe();
        durationSubscriber = null;
        if (hasValue) {
          hasValue = false;
          var value = lastValue;
          lastValue = null;
          subscriber.next(value);
        }
      };
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        durationSubscriber === null || durationSubscriber === void 0 ? void 0 : durationSubscriber.unsubscribe();
        hasValue = true;
        lastValue = value;
        durationSubscriber = OperatorSubscriber_1.createOperatorSubscriber(subscriber, emit, noop_1.noop);
        innerFrom_1.innerFrom(durationSelector(value)).subscribe(durationSubscriber);
      }, function() {
        emit();
        subscriber.complete();
      }, void 0, function() {
        lastValue = durationSubscriber = null;
      }));
    });
  }
  debounce.debounce = debounce$1;
  return debounce;
}
var debounceTime = {};
var hasRequiredDebounceTime;
function requireDebounceTime() {
  if (hasRequiredDebounceTime) return debounceTime;
  hasRequiredDebounceTime = 1;
  Object.defineProperty(debounceTime, "__esModule", { value: true });
  debounceTime.debounceTime = void 0;
  var async_1 = /* @__PURE__ */ requireAsync();
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  function debounceTime$1(dueTime, scheduler) {
    if (scheduler === void 0) {
      scheduler = async_1.asyncScheduler;
    }
    return lift_1.operate(function(source, subscriber) {
      var activeTask = null;
      var lastValue = null;
      var lastTime = null;
      var emit = function() {
        if (activeTask) {
          activeTask.unsubscribe();
          activeTask = null;
          var value = lastValue;
          lastValue = null;
          subscriber.next(value);
        }
      };
      function emitWhenIdle() {
        var targetTime = lastTime + dueTime;
        var now = scheduler.now();
        if (now < targetTime) {
          activeTask = this.schedule(void 0, targetTime - now);
          subscriber.add(activeTask);
          return;
        }
        emit();
      }
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        lastValue = value;
        lastTime = scheduler.now();
        if (!activeTask) {
          activeTask = scheduler.schedule(emitWhenIdle, dueTime);
          subscriber.add(activeTask);
        }
      }, function() {
        emit();
        subscriber.complete();
      }, void 0, function() {
        lastValue = activeTask = null;
      }));
    });
  }
  debounceTime.debounceTime = debounceTime$1;
  return debounceTime;
}
var defaultIfEmpty = {};
var hasRequiredDefaultIfEmpty;
function requireDefaultIfEmpty() {
  if (hasRequiredDefaultIfEmpty) return defaultIfEmpty;
  hasRequiredDefaultIfEmpty = 1;
  Object.defineProperty(defaultIfEmpty, "__esModule", { value: true });
  defaultIfEmpty.defaultIfEmpty = void 0;
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  function defaultIfEmpty$1(defaultValue) {
    return lift_1.operate(function(source, subscriber) {
      var hasValue = false;
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        hasValue = true;
        subscriber.next(value);
      }, function() {
        if (!hasValue) {
          subscriber.next(defaultValue);
        }
        subscriber.complete();
      }));
    });
  }
  defaultIfEmpty.defaultIfEmpty = defaultIfEmpty$1;
  return defaultIfEmpty;
}
var delay = {};
var delayWhen = {};
var take = {};
var hasRequiredTake;
function requireTake() {
  if (hasRequiredTake) return take;
  hasRequiredTake = 1;
  Object.defineProperty(take, "__esModule", { value: true });
  take.take = void 0;
  var empty_1 = /* @__PURE__ */ requireEmpty();
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  function take$1(count2) {
    return count2 <= 0 ? function() {
      return empty_1.EMPTY;
    } : lift_1.operate(function(source, subscriber) {
      var seen = 0;
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        if (++seen <= count2) {
          subscriber.next(value);
          if (count2 <= seen) {
            subscriber.complete();
          }
        }
      }));
    });
  }
  take.take = take$1;
  return take;
}
var ignoreElements = {};
var hasRequiredIgnoreElements;
function requireIgnoreElements() {
  if (hasRequiredIgnoreElements) return ignoreElements;
  hasRequiredIgnoreElements = 1;
  Object.defineProperty(ignoreElements, "__esModule", { value: true });
  ignoreElements.ignoreElements = void 0;
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  var noop_1 = /* @__PURE__ */ requireNoop();
  function ignoreElements$1() {
    return lift_1.operate(function(source, subscriber) {
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, noop_1.noop));
    });
  }
  ignoreElements.ignoreElements = ignoreElements$1;
  return ignoreElements;
}
var mapTo = {};
var hasRequiredMapTo;
function requireMapTo() {
  if (hasRequiredMapTo) return mapTo;
  hasRequiredMapTo = 1;
  Object.defineProperty(mapTo, "__esModule", { value: true });
  mapTo.mapTo = void 0;
  var map_1 = /* @__PURE__ */ requireMap();
  function mapTo$1(value) {
    return map_1.map(function() {
      return value;
    });
  }
  mapTo.mapTo = mapTo$1;
  return mapTo;
}
var hasRequiredDelayWhen;
function requireDelayWhen() {
  if (hasRequiredDelayWhen) return delayWhen;
  hasRequiredDelayWhen = 1;
  Object.defineProperty(delayWhen, "__esModule", { value: true });
  delayWhen.delayWhen = void 0;
  var concat_1 = /* @__PURE__ */ requireConcat$1();
  var take_1 = /* @__PURE__ */ requireTake();
  var ignoreElements_1 = /* @__PURE__ */ requireIgnoreElements();
  var mapTo_1 = /* @__PURE__ */ requireMapTo();
  var mergeMap_1 = /* @__PURE__ */ requireMergeMap();
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  function delayWhen$1(delayDurationSelector, subscriptionDelay) {
    if (subscriptionDelay) {
      return function(source) {
        return concat_1.concat(subscriptionDelay.pipe(take_1.take(1), ignoreElements_1.ignoreElements()), source.pipe(delayWhen$1(delayDurationSelector)));
      };
    }
    return mergeMap_1.mergeMap(function(value, index) {
      return innerFrom_1.innerFrom(delayDurationSelector(value, index)).pipe(take_1.take(1), mapTo_1.mapTo(value));
    });
  }
  delayWhen.delayWhen = delayWhen$1;
  return delayWhen;
}
var hasRequiredDelay;
function requireDelay() {
  if (hasRequiredDelay) return delay;
  hasRequiredDelay = 1;
  Object.defineProperty(delay, "__esModule", { value: true });
  delay.delay = void 0;
  var async_1 = /* @__PURE__ */ requireAsync();
  var delayWhen_1 = /* @__PURE__ */ requireDelayWhen();
  var timer_1 = /* @__PURE__ */ requireTimer();
  function delay$1(due, scheduler) {
    if (scheduler === void 0) {
      scheduler = async_1.asyncScheduler;
    }
    var duration = timer_1.timer(due, scheduler);
    return delayWhen_1.delayWhen(function() {
      return duration;
    });
  }
  delay.delay = delay$1;
  return delay;
}
var dematerialize = {};
var hasRequiredDematerialize;
function requireDematerialize() {
  if (hasRequiredDematerialize) return dematerialize;
  hasRequiredDematerialize = 1;
  Object.defineProperty(dematerialize, "__esModule", { value: true });
  dematerialize.dematerialize = void 0;
  var Notification_1 = /* @__PURE__ */ requireNotification();
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  function dematerialize$1() {
    return lift_1.operate(function(source, subscriber) {
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(notification) {
        return Notification_1.observeNotification(notification, subscriber);
      }));
    });
  }
  dematerialize.dematerialize = dematerialize$1;
  return dematerialize;
}
var distinct = {};
var hasRequiredDistinct;
function requireDistinct() {
  if (hasRequiredDistinct) return distinct;
  hasRequiredDistinct = 1;
  Object.defineProperty(distinct, "__esModule", { value: true });
  distinct.distinct = void 0;
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  var noop_1 = /* @__PURE__ */ requireNoop();
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  function distinct$1(keySelector, flushes) {
    return lift_1.operate(function(source, subscriber) {
      var distinctKeys = /* @__PURE__ */ new Set();
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        var key = keySelector ? keySelector(value) : value;
        if (!distinctKeys.has(key)) {
          distinctKeys.add(key);
          subscriber.next(value);
        }
      }));
      flushes && innerFrom_1.innerFrom(flushes).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function() {
        return distinctKeys.clear();
      }, noop_1.noop));
    });
  }
  distinct.distinct = distinct$1;
  return distinct;
}
var distinctUntilChanged = {};
var hasRequiredDistinctUntilChanged;
function requireDistinctUntilChanged() {
  if (hasRequiredDistinctUntilChanged) return distinctUntilChanged;
  hasRequiredDistinctUntilChanged = 1;
  Object.defineProperty(distinctUntilChanged, "__esModule", { value: true });
  distinctUntilChanged.distinctUntilChanged = void 0;
  var identity_1 = /* @__PURE__ */ requireIdentity();
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  function distinctUntilChanged$1(comparator2, keySelector) {
    if (keySelector === void 0) {
      keySelector = identity_1.identity;
    }
    comparator2 = comparator2 !== null && comparator2 !== void 0 ? comparator2 : defaultCompare;
    return lift_1.operate(function(source, subscriber) {
      var previousKey;
      var first2 = true;
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        var currentKey = keySelector(value);
        if (first2 || !comparator2(previousKey, currentKey)) {
          first2 = false;
          previousKey = currentKey;
          subscriber.next(value);
        }
      }));
    });
  }
  distinctUntilChanged.distinctUntilChanged = distinctUntilChanged$1;
  function defaultCompare(a, b) {
    return a === b;
  }
  return distinctUntilChanged;
}
var distinctUntilKeyChanged = {};
var hasRequiredDistinctUntilKeyChanged;
function requireDistinctUntilKeyChanged() {
  if (hasRequiredDistinctUntilKeyChanged) return distinctUntilKeyChanged;
  hasRequiredDistinctUntilKeyChanged = 1;
  Object.defineProperty(distinctUntilKeyChanged, "__esModule", { value: true });
  distinctUntilKeyChanged.distinctUntilKeyChanged = void 0;
  var distinctUntilChanged_1 = /* @__PURE__ */ requireDistinctUntilChanged();
  function distinctUntilKeyChanged$1(key, compare) {
    return distinctUntilChanged_1.distinctUntilChanged(function(x, y) {
      return compare ? compare(x[key], y[key]) : x[key] === y[key];
    });
  }
  distinctUntilKeyChanged.distinctUntilKeyChanged = distinctUntilKeyChanged$1;
  return distinctUntilKeyChanged;
}
var elementAt = {};
var throwIfEmpty = {};
var hasRequiredThrowIfEmpty;
function requireThrowIfEmpty() {
  if (hasRequiredThrowIfEmpty) return throwIfEmpty;
  hasRequiredThrowIfEmpty = 1;
  Object.defineProperty(throwIfEmpty, "__esModule", { value: true });
  throwIfEmpty.throwIfEmpty = void 0;
  var EmptyError_1 = /* @__PURE__ */ requireEmptyError();
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  function throwIfEmpty$1(errorFactory) {
    if (errorFactory === void 0) {
      errorFactory = defaultErrorFactory;
    }
    return lift_1.operate(function(source, subscriber) {
      var hasValue = false;
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        hasValue = true;
        subscriber.next(value);
      }, function() {
        return hasValue ? subscriber.complete() : subscriber.error(errorFactory());
      }));
    });
  }
  throwIfEmpty.throwIfEmpty = throwIfEmpty$1;
  function defaultErrorFactory() {
    return new EmptyError_1.EmptyError();
  }
  return throwIfEmpty;
}
var hasRequiredElementAt;
function requireElementAt() {
  if (hasRequiredElementAt) return elementAt;
  hasRequiredElementAt = 1;
  Object.defineProperty(elementAt, "__esModule", { value: true });
  elementAt.elementAt = void 0;
  var ArgumentOutOfRangeError_1 = /* @__PURE__ */ requireArgumentOutOfRangeError();
  var filter_1 = /* @__PURE__ */ requireFilter();
  var throwIfEmpty_1 = /* @__PURE__ */ requireThrowIfEmpty();
  var defaultIfEmpty_1 = /* @__PURE__ */ requireDefaultIfEmpty();
  var take_1 = /* @__PURE__ */ requireTake();
  function elementAt$1(index, defaultValue) {
    if (index < 0) {
      throw new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError();
    }
    var hasDefaultValue = arguments.length >= 2;
    return function(source) {
      return source.pipe(filter_1.filter(function(v, i) {
        return i === index;
      }), take_1.take(1), hasDefaultValue ? defaultIfEmpty_1.defaultIfEmpty(defaultValue) : throwIfEmpty_1.throwIfEmpty(function() {
        return new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError();
      }));
    };
  }
  elementAt.elementAt = elementAt$1;
  return elementAt;
}
var endWith = {};
var hasRequiredEndWith;
function requireEndWith() {
  if (hasRequiredEndWith) return endWith;
  hasRequiredEndWith = 1;
  var __read = endWith && endWith.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error2) {
      e = { error: error2 };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray = endWith && endWith.__spreadArray || function(to, from2) {
    for (var i = 0, il = from2.length, j = to.length; i < il; i++, j++)
      to[j] = from2[i];
    return to;
  };
  Object.defineProperty(endWith, "__esModule", { value: true });
  endWith.endWith = void 0;
  var concat_1 = /* @__PURE__ */ requireConcat$1();
  var of_1 = /* @__PURE__ */ requireOf();
  function endWith$1() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      values[_i] = arguments[_i];
    }
    return function(source) {
      return concat_1.concat(source, of_1.of.apply(void 0, __spreadArray([], __read(values))));
    };
  }
  endWith.endWith = endWith$1;
  return endWith;
}
var every = {};
var hasRequiredEvery;
function requireEvery() {
  if (hasRequiredEvery) return every;
  hasRequiredEvery = 1;
  Object.defineProperty(every, "__esModule", { value: true });
  every.every = void 0;
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  function every$1(predicate, thisArg) {
    return lift_1.operate(function(source, subscriber) {
      var index = 0;
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        if (!predicate.call(thisArg, value, index++, source)) {
          subscriber.next(false);
          subscriber.complete();
        }
      }, function() {
        subscriber.next(true);
        subscriber.complete();
      }));
    });
  }
  every.every = every$1;
  return every;
}
var exhaust = {};
var exhaustAll = {};
var exhaustMap = {};
var hasRequiredExhaustMap;
function requireExhaustMap() {
  if (hasRequiredExhaustMap) return exhaustMap;
  hasRequiredExhaustMap = 1;
  Object.defineProperty(exhaustMap, "__esModule", { value: true });
  exhaustMap.exhaustMap = void 0;
  var map_1 = /* @__PURE__ */ requireMap();
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  function exhaustMap$1(project, resultSelector) {
    if (resultSelector) {
      return function(source) {
        return source.pipe(exhaustMap$1(function(a, i) {
          return innerFrom_1.innerFrom(project(a, i)).pipe(map_1.map(function(b, ii) {
            return resultSelector(a, b, i, ii);
          }));
        }));
      };
    }
    return lift_1.operate(function(source, subscriber) {
      var index = 0;
      var innerSub = null;
      var isComplete = false;
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(outerValue) {
        if (!innerSub) {
          innerSub = OperatorSubscriber_1.createOperatorSubscriber(subscriber, void 0, function() {
            innerSub = null;
            isComplete && subscriber.complete();
          });
          innerFrom_1.innerFrom(project(outerValue, index++)).subscribe(innerSub);
        }
      }, function() {
        isComplete = true;
        !innerSub && subscriber.complete();
      }));
    });
  }
  exhaustMap.exhaustMap = exhaustMap$1;
  return exhaustMap;
}
var hasRequiredExhaustAll;
function requireExhaustAll() {
  if (hasRequiredExhaustAll) return exhaustAll;
  hasRequiredExhaustAll = 1;
  Object.defineProperty(exhaustAll, "__esModule", { value: true });
  exhaustAll.exhaustAll = void 0;
  var exhaustMap_1 = /* @__PURE__ */ requireExhaustMap();
  var identity_1 = /* @__PURE__ */ requireIdentity();
  function exhaustAll$1() {
    return exhaustMap_1.exhaustMap(identity_1.identity);
  }
  exhaustAll.exhaustAll = exhaustAll$1;
  return exhaustAll;
}
var hasRequiredExhaust;
function requireExhaust() {
  if (hasRequiredExhaust) return exhaust;
  hasRequiredExhaust = 1;
  Object.defineProperty(exhaust, "__esModule", { value: true });
  exhaust.exhaust = void 0;
  var exhaustAll_1 = /* @__PURE__ */ requireExhaustAll();
  exhaust.exhaust = exhaustAll_1.exhaustAll;
  return exhaust;
}
var expand = {};
var hasRequiredExpand;
function requireExpand() {
  if (hasRequiredExpand) return expand;
  hasRequiredExpand = 1;
  Object.defineProperty(expand, "__esModule", { value: true });
  expand.expand = void 0;
  var lift_1 = /* @__PURE__ */ requireLift();
  var mergeInternals_1 = /* @__PURE__ */ requireMergeInternals();
  function expand$12(project, concurrent, scheduler) {
    if (concurrent === void 0) {
      concurrent = Infinity;
    }
    concurrent = (concurrent || 0) < 1 ? Infinity : concurrent;
    return lift_1.operate(function(source, subscriber) {
      return mergeInternals_1.mergeInternals(source, subscriber, project, concurrent, void 0, true, scheduler);
    });
  }
  expand.expand = expand$12;
  return expand;
}
var finalize = {};
var hasRequiredFinalize;
function requireFinalize() {
  if (hasRequiredFinalize) return finalize;
  hasRequiredFinalize = 1;
  Object.defineProperty(finalize, "__esModule", { value: true });
  finalize.finalize = void 0;
  var lift_1 = /* @__PURE__ */ requireLift();
  function finalize$1(callback) {
    return lift_1.operate(function(source, subscriber) {
      try {
        source.subscribe(subscriber);
      } finally {
        subscriber.add(callback);
      }
    });
  }
  finalize.finalize = finalize$1;
  return finalize;
}
var find = {};
var hasRequiredFind;
function requireFind() {
  if (hasRequiredFind) return find;
  hasRequiredFind = 1;
  Object.defineProperty(find, "__esModule", { value: true });
  find.createFind = find.find = void 0;
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  function find$1(predicate, thisArg) {
    return lift_1.operate(createFind(predicate, thisArg, "value"));
  }
  find.find = find$1;
  function createFind(predicate, thisArg, emit) {
    var findIndex2 = emit === "index";
    return function(source, subscriber) {
      var index = 0;
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        var i = index++;
        if (predicate.call(thisArg, value, i, source)) {
          subscriber.next(findIndex2 ? i : value);
          subscriber.complete();
        }
      }, function() {
        subscriber.next(findIndex2 ? -1 : void 0);
        subscriber.complete();
      }));
    };
  }
  find.createFind = createFind;
  return find;
}
var findIndex = {};
var hasRequiredFindIndex;
function requireFindIndex() {
  if (hasRequiredFindIndex) return findIndex;
  hasRequiredFindIndex = 1;
  Object.defineProperty(findIndex, "__esModule", { value: true });
  findIndex.findIndex = void 0;
  var lift_1 = /* @__PURE__ */ requireLift();
  var find_1 = /* @__PURE__ */ requireFind();
  function findIndex$1(predicate, thisArg) {
    return lift_1.operate(find_1.createFind(predicate, thisArg, "index"));
  }
  findIndex.findIndex = findIndex$1;
  return findIndex;
}
var first = {};
var hasRequiredFirst;
function requireFirst() {
  if (hasRequiredFirst) return first;
  hasRequiredFirst = 1;
  Object.defineProperty(first, "__esModule", { value: true });
  first.first = void 0;
  var EmptyError_1 = /* @__PURE__ */ requireEmptyError();
  var filter_1 = /* @__PURE__ */ requireFilter();
  var take_1 = /* @__PURE__ */ requireTake();
  var defaultIfEmpty_1 = /* @__PURE__ */ requireDefaultIfEmpty();
  var throwIfEmpty_1 = /* @__PURE__ */ requireThrowIfEmpty();
  var identity_1 = /* @__PURE__ */ requireIdentity();
  function first$1(predicate, defaultValue) {
    var hasDefaultValue = arguments.length >= 2;
    return function(source) {
      return source.pipe(predicate ? filter_1.filter(function(v, i) {
        return predicate(v, i, source);
      }) : identity_1.identity, take_1.take(1), hasDefaultValue ? defaultIfEmpty_1.defaultIfEmpty(defaultValue) : throwIfEmpty_1.throwIfEmpty(function() {
        return new EmptyError_1.EmptyError();
      }));
    };
  }
  first.first = first$1;
  return first;
}
var groupBy = {};
var hasRequiredGroupBy;
function requireGroupBy() {
  if (hasRequiredGroupBy) return groupBy;
  hasRequiredGroupBy = 1;
  Object.defineProperty(groupBy, "__esModule", { value: true });
  groupBy.groupBy = void 0;
  var Observable_1 = /* @__PURE__ */ requireObservable();
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  var Subject_1 = /* @__PURE__ */ requireSubject();
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  function groupBy$1(keySelector, elementOrOptions, duration, connector) {
    return lift_1.operate(function(source, subscriber) {
      var element;
      if (!elementOrOptions || typeof elementOrOptions === "function") {
        element = elementOrOptions;
      } else {
        duration = elementOrOptions.duration, element = elementOrOptions.element, connector = elementOrOptions.connector;
      }
      var groups = /* @__PURE__ */ new Map();
      var notify = function(cb) {
        groups.forEach(cb);
        cb(subscriber);
      };
      var handleError = function(err) {
        return notify(function(consumer) {
          return consumer.error(err);
        });
      };
      var activeGroups = 0;
      var teardownAttempted = false;
      var groupBySourceSubscriber = new OperatorSubscriber_1.OperatorSubscriber(subscriber, function(value) {
        try {
          var key_1 = keySelector(value);
          var group_1 = groups.get(key_1);
          if (!group_1) {
            groups.set(key_1, group_1 = connector ? connector() : new Subject_1.Subject());
            var grouped = createGroupedObservable(key_1, group_1);
            subscriber.next(grouped);
            if (duration) {
              var durationSubscriber_1 = OperatorSubscriber_1.createOperatorSubscriber(group_1, function() {
                group_1.complete();
                durationSubscriber_1 === null || durationSubscriber_1 === void 0 ? void 0 : durationSubscriber_1.unsubscribe();
              }, void 0, void 0, function() {
                return groups.delete(key_1);
              });
              groupBySourceSubscriber.add(innerFrom_1.innerFrom(duration(grouped)).subscribe(durationSubscriber_1));
            }
          }
          group_1.next(element ? element(value) : value);
        } catch (err) {
          handleError(err);
        }
      }, function() {
        return notify(function(consumer) {
          return consumer.complete();
        });
      }, handleError, function() {
        return groups.clear();
      }, function() {
        teardownAttempted = true;
        return activeGroups === 0;
      });
      source.subscribe(groupBySourceSubscriber);
      function createGroupedObservable(key, groupSubject) {
        var result = new Observable_1.Observable(function(groupSubscriber) {
          activeGroups++;
          var innerSub = groupSubject.subscribe(groupSubscriber);
          return function() {
            innerSub.unsubscribe();
            --activeGroups === 0 && teardownAttempted && groupBySourceSubscriber.unsubscribe();
          };
        });
        result.key = key;
        return result;
      }
    });
  }
  groupBy.groupBy = groupBy$1;
  return groupBy;
}
var isEmpty = {};
var hasRequiredIsEmpty;
function requireIsEmpty() {
  if (hasRequiredIsEmpty) return isEmpty;
  hasRequiredIsEmpty = 1;
  Object.defineProperty(isEmpty, "__esModule", { value: true });
  isEmpty.isEmpty = void 0;
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  function isEmpty$1() {
    return lift_1.operate(function(source, subscriber) {
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function() {
        subscriber.next(false);
        subscriber.complete();
      }, function() {
        subscriber.next(true);
        subscriber.complete();
      }));
    });
  }
  isEmpty.isEmpty = isEmpty$1;
  return isEmpty;
}
var last = {};
var takeLast = {};
var hasRequiredTakeLast;
function requireTakeLast() {
  if (hasRequiredTakeLast) return takeLast;
  hasRequiredTakeLast = 1;
  var __values = takeLast && takeLast.__values || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  Object.defineProperty(takeLast, "__esModule", { value: true });
  takeLast.takeLast = void 0;
  var empty_1 = /* @__PURE__ */ requireEmpty();
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  function takeLast$1(count2) {
    return count2 <= 0 ? function() {
      return empty_1.EMPTY;
    } : lift_1.operate(function(source, subscriber) {
      var buffer2 = [];
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        buffer2.push(value);
        count2 < buffer2.length && buffer2.shift();
      }, function() {
        var e_1, _a;
        try {
          for (var buffer_1 = __values(buffer2), buffer_1_1 = buffer_1.next(); !buffer_1_1.done; buffer_1_1 = buffer_1.next()) {
            var value = buffer_1_1.value;
            subscriber.next(value);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (buffer_1_1 && !buffer_1_1.done && (_a = buffer_1.return)) _a.call(buffer_1);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
        subscriber.complete();
      }, void 0, function() {
        buffer2 = null;
      }));
    });
  }
  takeLast.takeLast = takeLast$1;
  return takeLast;
}
var hasRequiredLast;
function requireLast() {
  if (hasRequiredLast) return last;
  hasRequiredLast = 1;
  Object.defineProperty(last, "__esModule", { value: true });
  last.last = void 0;
  var EmptyError_1 = /* @__PURE__ */ requireEmptyError();
  var filter_1 = /* @__PURE__ */ requireFilter();
  var takeLast_1 = /* @__PURE__ */ requireTakeLast();
  var throwIfEmpty_1 = /* @__PURE__ */ requireThrowIfEmpty();
  var defaultIfEmpty_1 = /* @__PURE__ */ requireDefaultIfEmpty();
  var identity_1 = /* @__PURE__ */ requireIdentity();
  function last$1(predicate, defaultValue) {
    var hasDefaultValue = arguments.length >= 2;
    return function(source) {
      return source.pipe(predicate ? filter_1.filter(function(v, i) {
        return predicate(v, i, source);
      }) : identity_1.identity, takeLast_1.takeLast(1), hasDefaultValue ? defaultIfEmpty_1.defaultIfEmpty(defaultValue) : throwIfEmpty_1.throwIfEmpty(function() {
        return new EmptyError_1.EmptyError();
      }));
    };
  }
  last.last = last$1;
  return last;
}
var materialize = {};
var hasRequiredMaterialize;
function requireMaterialize() {
  if (hasRequiredMaterialize) return materialize;
  hasRequiredMaterialize = 1;
  Object.defineProperty(materialize, "__esModule", { value: true });
  materialize.materialize = void 0;
  var Notification_1 = /* @__PURE__ */ requireNotification();
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  function materialize$1() {
    return lift_1.operate(function(source, subscriber) {
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        subscriber.next(Notification_1.Notification.createNext(value));
      }, function() {
        subscriber.next(Notification_1.Notification.createComplete());
        subscriber.complete();
      }, function(err) {
        subscriber.next(Notification_1.Notification.createError(err));
        subscriber.complete();
      }));
    });
  }
  materialize.materialize = materialize$1;
  return materialize;
}
var max = {};
var hasRequiredMax;
function requireMax() {
  if (hasRequiredMax) return max;
  hasRequiredMax = 1;
  Object.defineProperty(max, "__esModule", { value: true });
  max.max = void 0;
  var reduce_1 = /* @__PURE__ */ requireReduce();
  var isFunction_1 = /* @__PURE__ */ requireIsFunction();
  function max$1(comparer) {
    return reduce_1.reduce(isFunction_1.isFunction(comparer) ? function(x, y) {
      return comparer(x, y) > 0 ? x : y;
    } : function(x, y) {
      return x > y ? x : y;
    });
  }
  max.max = max$1;
  return max;
}
var flatMap = {};
var hasRequiredFlatMap;
function requireFlatMap() {
  if (hasRequiredFlatMap) return flatMap;
  hasRequiredFlatMap = 1;
  Object.defineProperty(flatMap, "__esModule", { value: true });
  flatMap.flatMap = void 0;
  var mergeMap_1 = /* @__PURE__ */ requireMergeMap();
  flatMap.flatMap = mergeMap_1.mergeMap;
  return flatMap;
}
var mergeMapTo = {};
var hasRequiredMergeMapTo;
function requireMergeMapTo() {
  if (hasRequiredMergeMapTo) return mergeMapTo;
  hasRequiredMergeMapTo = 1;
  Object.defineProperty(mergeMapTo, "__esModule", { value: true });
  mergeMapTo.mergeMapTo = void 0;
  var mergeMap_1 = /* @__PURE__ */ requireMergeMap();
  var isFunction_1 = /* @__PURE__ */ requireIsFunction();
  function mergeMapTo$1(innerObservable, resultSelector, concurrent) {
    if (concurrent === void 0) {
      concurrent = Infinity;
    }
    if (isFunction_1.isFunction(resultSelector)) {
      return mergeMap_1.mergeMap(function() {
        return innerObservable;
      }, resultSelector, concurrent);
    }
    if (typeof resultSelector === "number") {
      concurrent = resultSelector;
    }
    return mergeMap_1.mergeMap(function() {
      return innerObservable;
    }, concurrent);
  }
  mergeMapTo.mergeMapTo = mergeMapTo$1;
  return mergeMapTo;
}
var mergeScan = {};
var hasRequiredMergeScan;
function requireMergeScan() {
  if (hasRequiredMergeScan) return mergeScan;
  hasRequiredMergeScan = 1;
  Object.defineProperty(mergeScan, "__esModule", { value: true });
  mergeScan.mergeScan = void 0;
  var lift_1 = /* @__PURE__ */ requireLift();
  var mergeInternals_1 = /* @__PURE__ */ requireMergeInternals();
  function mergeScan$1(accumulator, seed, concurrent) {
    if (concurrent === void 0) {
      concurrent = Infinity;
    }
    return lift_1.operate(function(source, subscriber) {
      var state = seed;
      return mergeInternals_1.mergeInternals(source, subscriber, function(value, index) {
        return accumulator(state, value, index);
      }, concurrent, function(value) {
        state = value;
      }, false, void 0, function() {
        return state = null;
      });
    });
  }
  mergeScan.mergeScan = mergeScan$1;
  return mergeScan;
}
var mergeWith = {};
var merge = {};
var hasRequiredMerge;
function requireMerge() {
  if (hasRequiredMerge) return merge;
  hasRequiredMerge = 1;
  var __read = merge && merge.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error2) {
      e = { error: error2 };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray = merge && merge.__spreadArray || function(to, from2) {
    for (var i = 0, il = from2.length, j = to.length; i < il; i++, j++)
      to[j] = from2[i];
    return to;
  };
  Object.defineProperty(merge, "__esModule", { value: true });
  merge.merge = void 0;
  var lift_1 = /* @__PURE__ */ requireLift();
  var mergeAll_1 = /* @__PURE__ */ requireMergeAll();
  var args_1 = /* @__PURE__ */ requireArgs();
  var from_1 = /* @__PURE__ */ requireFrom();
  function merge$12() {
    var args2 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args2[_i] = arguments[_i];
    }
    var scheduler = args_1.popScheduler(args2);
    var concurrent = args_1.popNumber(args2, Infinity);
    return lift_1.operate(function(source, subscriber) {
      mergeAll_1.mergeAll(concurrent)(from_1.from(__spreadArray([source], __read(args2)), scheduler)).subscribe(subscriber);
    });
  }
  merge.merge = merge$12;
  return merge;
}
var hasRequiredMergeWith;
function requireMergeWith() {
  if (hasRequiredMergeWith) return mergeWith;
  hasRequiredMergeWith = 1;
  var __read = mergeWith && mergeWith.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error2) {
      e = { error: error2 };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray = mergeWith && mergeWith.__spreadArray || function(to, from2) {
    for (var i = 0, il = from2.length, j = to.length; i < il; i++, j++)
      to[j] = from2[i];
    return to;
  };
  Object.defineProperty(mergeWith, "__esModule", { value: true });
  mergeWith.mergeWith = void 0;
  var merge_1 = /* @__PURE__ */ requireMerge();
  function mergeWith$1() {
    var otherSources = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      otherSources[_i] = arguments[_i];
    }
    return merge_1.merge.apply(void 0, __spreadArray([], __read(otherSources)));
  }
  mergeWith.mergeWith = mergeWith$1;
  return mergeWith;
}
var min = {};
var hasRequiredMin;
function requireMin() {
  if (hasRequiredMin) return min;
  hasRequiredMin = 1;
  Object.defineProperty(min, "__esModule", { value: true });
  min.min = void 0;
  var reduce_1 = /* @__PURE__ */ requireReduce();
  var isFunction_1 = /* @__PURE__ */ requireIsFunction();
  function min$1(comparer) {
    return reduce_1.reduce(isFunction_1.isFunction(comparer) ? function(x, y) {
      return comparer(x, y) < 0 ? x : y;
    } : function(x, y) {
      return x < y ? x : y;
    });
  }
  min.min = min$1;
  return min;
}
var multicast = {};
var hasRequiredMulticast;
function requireMulticast() {
  if (hasRequiredMulticast) return multicast;
  hasRequiredMulticast = 1;
  Object.defineProperty(multicast, "__esModule", { value: true });
  multicast.multicast = void 0;
  var ConnectableObservable_1 = /* @__PURE__ */ requireConnectableObservable();
  var isFunction_1 = /* @__PURE__ */ requireIsFunction();
  var connect_1 = /* @__PURE__ */ requireConnect();
  function multicast$1(subjectOrSubjectFactory, selector) {
    var subjectFactory = isFunction_1.isFunction(subjectOrSubjectFactory) ? subjectOrSubjectFactory : function() {
      return subjectOrSubjectFactory;
    };
    if (isFunction_1.isFunction(selector)) {
      return connect_1.connect(selector, {
        connector: subjectFactory
      });
    }
    return function(source) {
      return new ConnectableObservable_1.ConnectableObservable(source, subjectFactory);
    };
  }
  multicast.multicast = multicast$1;
  return multicast;
}
var onErrorResumeNextWith = {};
var hasRequiredOnErrorResumeNextWith;
function requireOnErrorResumeNextWith() {
  if (hasRequiredOnErrorResumeNextWith) return onErrorResumeNextWith;
  hasRequiredOnErrorResumeNextWith = 1;
  var __read = onErrorResumeNextWith && onErrorResumeNextWith.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error2) {
      e = { error: error2 };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray = onErrorResumeNextWith && onErrorResumeNextWith.__spreadArray || function(to, from2) {
    for (var i = 0, il = from2.length, j = to.length; i < il; i++, j++)
      to[j] = from2[i];
    return to;
  };
  Object.defineProperty(onErrorResumeNextWith, "__esModule", { value: true });
  onErrorResumeNextWith.onErrorResumeNext = onErrorResumeNextWith.onErrorResumeNextWith = void 0;
  var argsOrArgArray_1 = /* @__PURE__ */ requireArgsOrArgArray();
  var onErrorResumeNext_1 = /* @__PURE__ */ requireOnErrorResumeNext();
  function onErrorResumeNextWith$1() {
    var sources = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      sources[_i] = arguments[_i];
    }
    var nextSources = argsOrArgArray_1.argsOrArgArray(sources);
    return function(source) {
      return onErrorResumeNext_1.onErrorResumeNext.apply(void 0, __spreadArray([source], __read(nextSources)));
    };
  }
  onErrorResumeNextWith.onErrorResumeNextWith = onErrorResumeNextWith$1;
  onErrorResumeNextWith.onErrorResumeNext = onErrorResumeNextWith$1;
  return onErrorResumeNextWith;
}
var pairwise = {};
var hasRequiredPairwise;
function requirePairwise() {
  if (hasRequiredPairwise) return pairwise;
  hasRequiredPairwise = 1;
  Object.defineProperty(pairwise, "__esModule", { value: true });
  pairwise.pairwise = void 0;
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  function pairwise$1() {
    return lift_1.operate(function(source, subscriber) {
      var prev;
      var hasPrev = false;
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        var p = prev;
        prev = value;
        hasPrev && subscriber.next([p, value]);
        hasPrev = true;
      }));
    });
  }
  pairwise.pairwise = pairwise$1;
  return pairwise;
}
var pluck = {};
var hasRequiredPluck;
function requirePluck() {
  if (hasRequiredPluck) return pluck;
  hasRequiredPluck = 1;
  Object.defineProperty(pluck, "__esModule", { value: true });
  pluck.pluck = void 0;
  var map_1 = /* @__PURE__ */ requireMap();
  function pluck$1() {
    var properties = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      properties[_i] = arguments[_i];
    }
    var length = properties.length;
    if (length === 0) {
      throw new Error("list of properties cannot be empty.");
    }
    return map_1.map(function(x) {
      var currentProp = x;
      for (var i = 0; i < length; i++) {
        var p = currentProp === null || currentProp === void 0 ? void 0 : currentProp[properties[i]];
        if (typeof p !== "undefined") {
          currentProp = p;
        } else {
          return void 0;
        }
      }
      return currentProp;
    });
  }
  pluck.pluck = pluck$1;
  return pluck;
}
var publish = {};
var hasRequiredPublish;
function requirePublish() {
  if (hasRequiredPublish) return publish;
  hasRequiredPublish = 1;
  Object.defineProperty(publish, "__esModule", { value: true });
  publish.publish = void 0;
  var Subject_1 = /* @__PURE__ */ requireSubject();
  var multicast_1 = /* @__PURE__ */ requireMulticast();
  var connect_1 = /* @__PURE__ */ requireConnect();
  function publish$1(selector) {
    return selector ? function(source) {
      return connect_1.connect(selector)(source);
    } : function(source) {
      return multicast_1.multicast(new Subject_1.Subject())(source);
    };
  }
  publish.publish = publish$1;
  return publish;
}
var publishBehavior = {};
var hasRequiredPublishBehavior;
function requirePublishBehavior() {
  if (hasRequiredPublishBehavior) return publishBehavior;
  hasRequiredPublishBehavior = 1;
  Object.defineProperty(publishBehavior, "__esModule", { value: true });
  publishBehavior.publishBehavior = void 0;
  var BehaviorSubject_1 = /* @__PURE__ */ requireBehaviorSubject();
  var ConnectableObservable_1 = /* @__PURE__ */ requireConnectableObservable();
  function publishBehavior$1(initialValue) {
    return function(source) {
      var subject = new BehaviorSubject_1.BehaviorSubject(initialValue);
      return new ConnectableObservable_1.ConnectableObservable(source, function() {
        return subject;
      });
    };
  }
  publishBehavior.publishBehavior = publishBehavior$1;
  return publishBehavior;
}
var publishLast = {};
var hasRequiredPublishLast;
function requirePublishLast() {
  if (hasRequiredPublishLast) return publishLast;
  hasRequiredPublishLast = 1;
  Object.defineProperty(publishLast, "__esModule", { value: true });
  publishLast.publishLast = void 0;
  var AsyncSubject_1 = /* @__PURE__ */ requireAsyncSubject();
  var ConnectableObservable_1 = /* @__PURE__ */ requireConnectableObservable();
  function publishLast$1() {
    return function(source) {
      var subject = new AsyncSubject_1.AsyncSubject();
      return new ConnectableObservable_1.ConnectableObservable(source, function() {
        return subject;
      });
    };
  }
  publishLast.publishLast = publishLast$1;
  return publishLast;
}
var publishReplay = {};
var hasRequiredPublishReplay;
function requirePublishReplay() {
  if (hasRequiredPublishReplay) return publishReplay;
  hasRequiredPublishReplay = 1;
  Object.defineProperty(publishReplay, "__esModule", { value: true });
  publishReplay.publishReplay = void 0;
  var ReplaySubject_1 = /* @__PURE__ */ requireReplaySubject();
  var multicast_1 = /* @__PURE__ */ requireMulticast();
  var isFunction_1 = /* @__PURE__ */ requireIsFunction();
  function publishReplay$1(bufferSize, windowTime2, selectorOrScheduler, timestampProvider) {
    if (selectorOrScheduler && !isFunction_1.isFunction(selectorOrScheduler)) {
      timestampProvider = selectorOrScheduler;
    }
    var selector = isFunction_1.isFunction(selectorOrScheduler) ? selectorOrScheduler : void 0;
    return function(source) {
      return multicast_1.multicast(new ReplaySubject_1.ReplaySubject(bufferSize, windowTime2, timestampProvider), selector)(source);
    };
  }
  publishReplay.publishReplay = publishReplay$1;
  return publishReplay;
}
var raceWith = {};
var hasRequiredRaceWith;
function requireRaceWith() {
  if (hasRequiredRaceWith) return raceWith;
  hasRequiredRaceWith = 1;
  var __read = raceWith && raceWith.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error2) {
      e = { error: error2 };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray = raceWith && raceWith.__spreadArray || function(to, from2) {
    for (var i = 0, il = from2.length, j = to.length; i < il; i++, j++)
      to[j] = from2[i];
    return to;
  };
  Object.defineProperty(raceWith, "__esModule", { value: true });
  raceWith.raceWith = void 0;
  var race_1 = /* @__PURE__ */ requireRace();
  var lift_1 = /* @__PURE__ */ requireLift();
  var identity_1 = /* @__PURE__ */ requireIdentity();
  function raceWith$1() {
    var otherSources = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      otherSources[_i] = arguments[_i];
    }
    return !otherSources.length ? identity_1.identity : lift_1.operate(function(source, subscriber) {
      race_1.raceInit(__spreadArray([source], __read(otherSources)))(subscriber);
    });
  }
  raceWith.raceWith = raceWith$1;
  return raceWith;
}
var repeat = {};
var hasRequiredRepeat;
function requireRepeat() {
  if (hasRequiredRepeat) return repeat;
  hasRequiredRepeat = 1;
  Object.defineProperty(repeat, "__esModule", { value: true });
  repeat.repeat = void 0;
  var empty_1 = /* @__PURE__ */ requireEmpty();
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  var timer_1 = /* @__PURE__ */ requireTimer();
  function repeat$1(countOrConfig) {
    var _a;
    var count2 = Infinity;
    var delay2;
    if (countOrConfig != null) {
      if (typeof countOrConfig === "object") {
        _a = countOrConfig.count, count2 = _a === void 0 ? Infinity : _a, delay2 = countOrConfig.delay;
      } else {
        count2 = countOrConfig;
      }
    }
    return count2 <= 0 ? function() {
      return empty_1.EMPTY;
    } : lift_1.operate(function(source, subscriber) {
      var soFar = 0;
      var sourceSub;
      var resubscribe = function() {
        sourceSub === null || sourceSub === void 0 ? void 0 : sourceSub.unsubscribe();
        sourceSub = null;
        if (delay2 != null) {
          var notifier = typeof delay2 === "number" ? timer_1.timer(delay2) : innerFrom_1.innerFrom(delay2(soFar));
          var notifierSubscriber_1 = OperatorSubscriber_1.createOperatorSubscriber(subscriber, function() {
            notifierSubscriber_1.unsubscribe();
            subscribeToSource();
          });
          notifier.subscribe(notifierSubscriber_1);
        } else {
          subscribeToSource();
        }
      };
      var subscribeToSource = function() {
        var syncUnsub = false;
        sourceSub = source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, void 0, function() {
          if (++soFar < count2) {
            if (sourceSub) {
              resubscribe();
            } else {
              syncUnsub = true;
            }
          } else {
            subscriber.complete();
          }
        }));
        if (syncUnsub) {
          resubscribe();
        }
      };
      subscribeToSource();
    });
  }
  repeat.repeat = repeat$1;
  return repeat;
}
var repeatWhen = {};
var hasRequiredRepeatWhen;
function requireRepeatWhen() {
  if (hasRequiredRepeatWhen) return repeatWhen;
  hasRequiredRepeatWhen = 1;
  Object.defineProperty(repeatWhen, "__esModule", { value: true });
  repeatWhen.repeatWhen = void 0;
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  var Subject_1 = /* @__PURE__ */ requireSubject();
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  function repeatWhen$1(notifier) {
    return lift_1.operate(function(source, subscriber) {
      var innerSub;
      var syncResub = false;
      var completions$;
      var isNotifierComplete = false;
      var isMainComplete = false;
      var checkComplete = function() {
        return isMainComplete && isNotifierComplete && (subscriber.complete(), true);
      };
      var getCompletionSubject = function() {
        if (!completions$) {
          completions$ = new Subject_1.Subject();
          innerFrom_1.innerFrom(notifier(completions$)).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function() {
            if (innerSub) {
              subscribeForRepeatWhen();
            } else {
              syncResub = true;
            }
          }, function() {
            isNotifierComplete = true;
            checkComplete();
          }));
        }
        return completions$;
      };
      var subscribeForRepeatWhen = function() {
        isMainComplete = false;
        innerSub = source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, void 0, function() {
          isMainComplete = true;
          !checkComplete() && getCompletionSubject().next();
        }));
        if (syncResub) {
          innerSub.unsubscribe();
          innerSub = null;
          syncResub = false;
          subscribeForRepeatWhen();
        }
      };
      subscribeForRepeatWhen();
    });
  }
  repeatWhen.repeatWhen = repeatWhen$1;
  return repeatWhen;
}
var retry = {};
var hasRequiredRetry;
function requireRetry() {
  if (hasRequiredRetry) return retry;
  hasRequiredRetry = 1;
  Object.defineProperty(retry, "__esModule", { value: true });
  retry.retry = void 0;
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  var identity_1 = /* @__PURE__ */ requireIdentity();
  var timer_1 = /* @__PURE__ */ requireTimer();
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  function retry$1(configOrCount) {
    if (configOrCount === void 0) {
      configOrCount = Infinity;
    }
    var config2;
    if (configOrCount && typeof configOrCount === "object") {
      config2 = configOrCount;
    } else {
      config2 = {
        count: configOrCount
      };
    }
    var _a = config2.count, count2 = _a === void 0 ? Infinity : _a, delay2 = config2.delay, _b = config2.resetOnSuccess, resetOnSuccess = _b === void 0 ? false : _b;
    return count2 <= 0 ? identity_1.identity : lift_1.operate(function(source, subscriber) {
      var soFar = 0;
      var innerSub;
      var subscribeForRetry = function() {
        var syncUnsub = false;
        innerSub = source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
          if (resetOnSuccess) {
            soFar = 0;
          }
          subscriber.next(value);
        }, void 0, function(err) {
          if (soFar++ < count2) {
            var resub_1 = function() {
              if (innerSub) {
                innerSub.unsubscribe();
                innerSub = null;
                subscribeForRetry();
              } else {
                syncUnsub = true;
              }
            };
            if (delay2 != null) {
              var notifier = typeof delay2 === "number" ? timer_1.timer(delay2) : innerFrom_1.innerFrom(delay2(err, soFar));
              var notifierSubscriber_1 = OperatorSubscriber_1.createOperatorSubscriber(subscriber, function() {
                notifierSubscriber_1.unsubscribe();
                resub_1();
              }, function() {
                subscriber.complete();
              });
              notifier.subscribe(notifierSubscriber_1);
            } else {
              resub_1();
            }
          } else {
            subscriber.error(err);
          }
        }));
        if (syncUnsub) {
          innerSub.unsubscribe();
          innerSub = null;
          subscribeForRetry();
        }
      };
      subscribeForRetry();
    });
  }
  retry.retry = retry$1;
  return retry;
}
var retryWhen = {};
var hasRequiredRetryWhen;
function requireRetryWhen() {
  if (hasRequiredRetryWhen) return retryWhen;
  hasRequiredRetryWhen = 1;
  Object.defineProperty(retryWhen, "__esModule", { value: true });
  retryWhen.retryWhen = void 0;
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  var Subject_1 = /* @__PURE__ */ requireSubject();
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  function retryWhen$1(notifier) {
    return lift_1.operate(function(source, subscriber) {
      var innerSub;
      var syncResub = false;
      var errors$;
      var subscribeForRetryWhen = function() {
        innerSub = source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, void 0, void 0, function(err) {
          if (!errors$) {
            errors$ = new Subject_1.Subject();
            innerFrom_1.innerFrom(notifier(errors$)).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function() {
              return innerSub ? subscribeForRetryWhen() : syncResub = true;
            }));
          }
          if (errors$) {
            errors$.next(err);
          }
        }));
        if (syncResub) {
          innerSub.unsubscribe();
          innerSub = null;
          syncResub = false;
          subscribeForRetryWhen();
        }
      };
      subscribeForRetryWhen();
    });
  }
  retryWhen.retryWhen = retryWhen$1;
  return retryWhen;
}
var sample$1 = {};
var hasRequiredSample;
function requireSample() {
  if (hasRequiredSample) return sample$1;
  hasRequiredSample = 1;
  Object.defineProperty(sample$1, "__esModule", { value: true });
  sample$1.sample = void 0;
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  var lift_1 = /* @__PURE__ */ requireLift();
  var noop_1 = /* @__PURE__ */ requireNoop();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  function sample2(notifier) {
    return lift_1.operate(function(source, subscriber) {
      var hasValue = false;
      var lastValue = null;
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        hasValue = true;
        lastValue = value;
      }));
      innerFrom_1.innerFrom(notifier).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function() {
        if (hasValue) {
          hasValue = false;
          var value = lastValue;
          lastValue = null;
          subscriber.next(value);
        }
      }, noop_1.noop));
    });
  }
  sample$1.sample = sample2;
  return sample$1;
}
var sampleTime = {};
var hasRequiredSampleTime;
function requireSampleTime() {
  if (hasRequiredSampleTime) return sampleTime;
  hasRequiredSampleTime = 1;
  Object.defineProperty(sampleTime, "__esModule", { value: true });
  sampleTime.sampleTime = void 0;
  var async_1 = /* @__PURE__ */ requireAsync();
  var sample_1 = /* @__PURE__ */ requireSample();
  var interval_1 = /* @__PURE__ */ requireInterval();
  function sampleTime$1(period, scheduler) {
    if (scheduler === void 0) {
      scheduler = async_1.asyncScheduler;
    }
    return sample_1.sample(interval_1.interval(period, scheduler));
  }
  sampleTime.sampleTime = sampleTime$1;
  return sampleTime;
}
var scan = {};
var hasRequiredScan;
function requireScan() {
  if (hasRequiredScan) return scan;
  hasRequiredScan = 1;
  Object.defineProperty(scan, "__esModule", { value: true });
  scan.scan = void 0;
  var lift_1 = /* @__PURE__ */ requireLift();
  var scanInternals_1 = /* @__PURE__ */ requireScanInternals();
  function scan$1(accumulator, seed) {
    return lift_1.operate(scanInternals_1.scanInternals(accumulator, seed, arguments.length >= 2, true));
  }
  scan.scan = scan$1;
  return scan;
}
var sequenceEqual = {};
var hasRequiredSequenceEqual;
function requireSequenceEqual() {
  if (hasRequiredSequenceEqual) return sequenceEqual;
  hasRequiredSequenceEqual = 1;
  Object.defineProperty(sequenceEqual, "__esModule", { value: true });
  sequenceEqual.sequenceEqual = void 0;
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  function sequenceEqual$1(compareTo, comparator2) {
    if (comparator2 === void 0) {
      comparator2 = function(a, b) {
        return a === b;
      };
    }
    return lift_1.operate(function(source, subscriber) {
      var aState = createState();
      var bState = createState();
      var emit = function(isEqual) {
        subscriber.next(isEqual);
        subscriber.complete();
      };
      var createSubscriber = function(selfState, otherState) {
        var sequenceEqualSubscriber = OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(a) {
          var buffer2 = otherState.buffer, complete = otherState.complete;
          if (buffer2.length === 0) {
            complete ? emit(false) : selfState.buffer.push(a);
          } else {
            !comparator2(a, buffer2.shift()) && emit(false);
          }
        }, function() {
          selfState.complete = true;
          var complete = otherState.complete, buffer2 = otherState.buffer;
          complete && emit(buffer2.length === 0);
          sequenceEqualSubscriber === null || sequenceEqualSubscriber === void 0 ? void 0 : sequenceEqualSubscriber.unsubscribe();
        });
        return sequenceEqualSubscriber;
      };
      source.subscribe(createSubscriber(aState, bState));
      innerFrom_1.innerFrom(compareTo).subscribe(createSubscriber(bState, aState));
    });
  }
  sequenceEqual.sequenceEqual = sequenceEqual$1;
  function createState() {
    return {
      buffer: [],
      complete: false
    };
  }
  return sequenceEqual;
}
var share = {};
var hasRequiredShare;
function requireShare() {
  if (hasRequiredShare) return share;
  hasRequiredShare = 1;
  var __read = share && share.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error2) {
      e = { error: error2 };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray = share && share.__spreadArray || function(to, from2) {
    for (var i = 0, il = from2.length, j = to.length; i < il; i++, j++)
      to[j] = from2[i];
    return to;
  };
  Object.defineProperty(share, "__esModule", { value: true });
  share.share = void 0;
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  var Subject_1 = /* @__PURE__ */ requireSubject();
  var Subscriber_1 = /* @__PURE__ */ requireSubscriber();
  var lift_1 = /* @__PURE__ */ requireLift();
  function share$1(options) {
    if (options === void 0) {
      options = {};
    }
    var _a = options.connector, connector = _a === void 0 ? function() {
      return new Subject_1.Subject();
    } : _a, _b = options.resetOnError, resetOnError = _b === void 0 ? true : _b, _c = options.resetOnComplete, resetOnComplete = _c === void 0 ? true : _c, _d = options.resetOnRefCountZero, resetOnRefCountZero = _d === void 0 ? true : _d;
    return function(wrapperSource) {
      var connection;
      var resetConnection;
      var subject;
      var refCount2 = 0;
      var hasCompleted = false;
      var hasErrored = false;
      var cancelReset = function() {
        resetConnection === null || resetConnection === void 0 ? void 0 : resetConnection.unsubscribe();
        resetConnection = void 0;
      };
      var reset = function() {
        cancelReset();
        connection = subject = void 0;
        hasCompleted = hasErrored = false;
      };
      var resetAndUnsubscribe = function() {
        var conn = connection;
        reset();
        conn === null || conn === void 0 ? void 0 : conn.unsubscribe();
      };
      return lift_1.operate(function(source, subscriber) {
        refCount2++;
        if (!hasErrored && !hasCompleted) {
          cancelReset();
        }
        var dest = subject = subject !== null && subject !== void 0 ? subject : connector();
        subscriber.add(function() {
          refCount2--;
          if (refCount2 === 0 && !hasErrored && !hasCompleted) {
            resetConnection = handleReset(resetAndUnsubscribe, resetOnRefCountZero);
          }
        });
        dest.subscribe(subscriber);
        if (!connection && refCount2 > 0) {
          connection = new Subscriber_1.SafeSubscriber({
            next: function(value) {
              return dest.next(value);
            },
            error: function(err) {
              hasErrored = true;
              cancelReset();
              resetConnection = handleReset(reset, resetOnError, err);
              dest.error(err);
            },
            complete: function() {
              hasCompleted = true;
              cancelReset();
              resetConnection = handleReset(reset, resetOnComplete);
              dest.complete();
            }
          });
          innerFrom_1.innerFrom(source).subscribe(connection);
        }
      })(wrapperSource);
    };
  }
  share.share = share$1;
  function handleReset(reset, on) {
    var args2 = [];
    for (var _i = 2; _i < arguments.length; _i++) {
      args2[_i - 2] = arguments[_i];
    }
    if (on === true) {
      reset();
      return;
    }
    if (on === false) {
      return;
    }
    var onSubscriber = new Subscriber_1.SafeSubscriber({
      next: function() {
        onSubscriber.unsubscribe();
        reset();
      }
    });
    return innerFrom_1.innerFrom(on.apply(void 0, __spreadArray([], __read(args2)))).subscribe(onSubscriber);
  }
  return share;
}
var shareReplay = {};
var hasRequiredShareReplay;
function requireShareReplay() {
  if (hasRequiredShareReplay) return shareReplay;
  hasRequiredShareReplay = 1;
  Object.defineProperty(shareReplay, "__esModule", { value: true });
  shareReplay.shareReplay = void 0;
  var ReplaySubject_1 = /* @__PURE__ */ requireReplaySubject();
  var share_1 = /* @__PURE__ */ requireShare();
  function shareReplay$1(configOrBufferSize, windowTime2, scheduler) {
    var _a, _b, _c;
    var bufferSize;
    var refCount2 = false;
    if (configOrBufferSize && typeof configOrBufferSize === "object") {
      _a = configOrBufferSize.bufferSize, bufferSize = _a === void 0 ? Infinity : _a, _b = configOrBufferSize.windowTime, windowTime2 = _b === void 0 ? Infinity : _b, _c = configOrBufferSize.refCount, refCount2 = _c === void 0 ? false : _c, scheduler = configOrBufferSize.scheduler;
    } else {
      bufferSize = configOrBufferSize !== null && configOrBufferSize !== void 0 ? configOrBufferSize : Infinity;
    }
    return share_1.share({
      connector: function() {
        return new ReplaySubject_1.ReplaySubject(bufferSize, windowTime2, scheduler);
      },
      resetOnError: true,
      resetOnComplete: false,
      resetOnRefCountZero: refCount2
    });
  }
  shareReplay.shareReplay = shareReplay$1;
  return shareReplay;
}
var single = {};
var hasRequiredSingle;
function requireSingle() {
  if (hasRequiredSingle) return single;
  hasRequiredSingle = 1;
  Object.defineProperty(single, "__esModule", { value: true });
  single.single = void 0;
  var EmptyError_1 = /* @__PURE__ */ requireEmptyError();
  var SequenceError_1 = /* @__PURE__ */ requireSequenceError();
  var NotFoundError_1 = /* @__PURE__ */ requireNotFoundError();
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  function single$1(predicate) {
    return lift_1.operate(function(source, subscriber) {
      var hasValue = false;
      var singleValue;
      var seenValue = false;
      var index = 0;
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        seenValue = true;
        if (!predicate || predicate(value, index++, source)) {
          hasValue && subscriber.error(new SequenceError_1.SequenceError("Too many matching values"));
          hasValue = true;
          singleValue = value;
        }
      }, function() {
        if (hasValue) {
          subscriber.next(singleValue);
          subscriber.complete();
        } else {
          subscriber.error(seenValue ? new NotFoundError_1.NotFoundError("No matching values") : new EmptyError_1.EmptyError());
        }
      }));
    });
  }
  single.single = single$1;
  return single;
}
var skip = {};
var hasRequiredSkip;
function requireSkip() {
  if (hasRequiredSkip) return skip;
  hasRequiredSkip = 1;
  Object.defineProperty(skip, "__esModule", { value: true });
  skip.skip = void 0;
  var filter_1 = /* @__PURE__ */ requireFilter();
  function skip$1(count2) {
    return filter_1.filter(function(_2, index) {
      return count2 <= index;
    });
  }
  skip.skip = skip$1;
  return skip;
}
var skipLast = {};
var hasRequiredSkipLast;
function requireSkipLast() {
  if (hasRequiredSkipLast) return skipLast;
  hasRequiredSkipLast = 1;
  Object.defineProperty(skipLast, "__esModule", { value: true });
  skipLast.skipLast = void 0;
  var identity_1 = /* @__PURE__ */ requireIdentity();
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  function skipLast$1(skipCount) {
    return skipCount <= 0 ? identity_1.identity : lift_1.operate(function(source, subscriber) {
      var ring = new Array(skipCount);
      var seen = 0;
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        var valueIndex = seen++;
        if (valueIndex < skipCount) {
          ring[valueIndex] = value;
        } else {
          var index = valueIndex % skipCount;
          var oldValue = ring[index];
          ring[index] = value;
          subscriber.next(oldValue);
        }
      }));
      return function() {
        ring = null;
      };
    });
  }
  skipLast.skipLast = skipLast$1;
  return skipLast;
}
var skipUntil = {};
var hasRequiredSkipUntil;
function requireSkipUntil() {
  if (hasRequiredSkipUntil) return skipUntil;
  hasRequiredSkipUntil = 1;
  Object.defineProperty(skipUntil, "__esModule", { value: true });
  skipUntil.skipUntil = void 0;
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  var noop_1 = /* @__PURE__ */ requireNoop();
  function skipUntil$1(notifier) {
    return lift_1.operate(function(source, subscriber) {
      var taking = false;
      var skipSubscriber = OperatorSubscriber_1.createOperatorSubscriber(subscriber, function() {
        skipSubscriber === null || skipSubscriber === void 0 ? void 0 : skipSubscriber.unsubscribe();
        taking = true;
      }, noop_1.noop);
      innerFrom_1.innerFrom(notifier).subscribe(skipSubscriber);
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        return taking && subscriber.next(value);
      }));
    });
  }
  skipUntil.skipUntil = skipUntil$1;
  return skipUntil;
}
var skipWhile = {};
var hasRequiredSkipWhile;
function requireSkipWhile() {
  if (hasRequiredSkipWhile) return skipWhile;
  hasRequiredSkipWhile = 1;
  Object.defineProperty(skipWhile, "__esModule", { value: true });
  skipWhile.skipWhile = void 0;
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  function skipWhile$1(predicate) {
    return lift_1.operate(function(source, subscriber) {
      var taking = false;
      var index = 0;
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        return (taking || (taking = !predicate(value, index++))) && subscriber.next(value);
      }));
    });
  }
  skipWhile.skipWhile = skipWhile$1;
  return skipWhile;
}
var startWith = {};
var hasRequiredStartWith;
function requireStartWith() {
  if (hasRequiredStartWith) return startWith;
  hasRequiredStartWith = 1;
  Object.defineProperty(startWith, "__esModule", { value: true });
  startWith.startWith = void 0;
  var concat_1 = /* @__PURE__ */ requireConcat$1();
  var args_1 = /* @__PURE__ */ requireArgs();
  var lift_1 = /* @__PURE__ */ requireLift();
  function startWith$1() {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      values[_i] = arguments[_i];
    }
    var scheduler = args_1.popScheduler(values);
    return lift_1.operate(function(source, subscriber) {
      (scheduler ? concat_1.concat(values, source, scheduler) : concat_1.concat(values, source)).subscribe(subscriber);
    });
  }
  startWith.startWith = startWith$1;
  return startWith;
}
var switchAll = {};
var switchMap = {};
var hasRequiredSwitchMap;
function requireSwitchMap() {
  if (hasRequiredSwitchMap) return switchMap;
  hasRequiredSwitchMap = 1;
  Object.defineProperty(switchMap, "__esModule", { value: true });
  switchMap.switchMap = void 0;
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  function switchMap$1(project, resultSelector) {
    return lift_1.operate(function(source, subscriber) {
      var innerSubscriber = null;
      var index = 0;
      var isComplete = false;
      var checkComplete = function() {
        return isComplete && !innerSubscriber && subscriber.complete();
      };
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        innerSubscriber === null || innerSubscriber === void 0 ? void 0 : innerSubscriber.unsubscribe();
        var innerIndex = 0;
        var outerIndex = index++;
        innerFrom_1.innerFrom(project(value, outerIndex)).subscribe(innerSubscriber = OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(innerValue) {
          return subscriber.next(resultSelector ? resultSelector(value, innerValue, outerIndex, innerIndex++) : innerValue);
        }, function() {
          innerSubscriber = null;
          checkComplete();
        }));
      }, function() {
        isComplete = true;
        checkComplete();
      }));
    });
  }
  switchMap.switchMap = switchMap$1;
  return switchMap;
}
var hasRequiredSwitchAll;
function requireSwitchAll() {
  if (hasRequiredSwitchAll) return switchAll;
  hasRequiredSwitchAll = 1;
  Object.defineProperty(switchAll, "__esModule", { value: true });
  switchAll.switchAll = void 0;
  var switchMap_1 = /* @__PURE__ */ requireSwitchMap();
  var identity_1 = /* @__PURE__ */ requireIdentity();
  function switchAll$1() {
    return switchMap_1.switchMap(identity_1.identity);
  }
  switchAll.switchAll = switchAll$1;
  return switchAll;
}
var switchMapTo = {};
var hasRequiredSwitchMapTo;
function requireSwitchMapTo() {
  if (hasRequiredSwitchMapTo) return switchMapTo;
  hasRequiredSwitchMapTo = 1;
  Object.defineProperty(switchMapTo, "__esModule", { value: true });
  switchMapTo.switchMapTo = void 0;
  var switchMap_1 = /* @__PURE__ */ requireSwitchMap();
  var isFunction_1 = /* @__PURE__ */ requireIsFunction();
  function switchMapTo$1(innerObservable, resultSelector) {
    return isFunction_1.isFunction(resultSelector) ? switchMap_1.switchMap(function() {
      return innerObservable;
    }, resultSelector) : switchMap_1.switchMap(function() {
      return innerObservable;
    });
  }
  switchMapTo.switchMapTo = switchMapTo$1;
  return switchMapTo;
}
var switchScan = {};
var hasRequiredSwitchScan;
function requireSwitchScan() {
  if (hasRequiredSwitchScan) return switchScan;
  hasRequiredSwitchScan = 1;
  Object.defineProperty(switchScan, "__esModule", { value: true });
  switchScan.switchScan = void 0;
  var switchMap_1 = /* @__PURE__ */ requireSwitchMap();
  var lift_1 = /* @__PURE__ */ requireLift();
  function switchScan$1(accumulator, seed) {
    return lift_1.operate(function(source, subscriber) {
      var state = seed;
      switchMap_1.switchMap(function(value, index) {
        return accumulator(state, value, index);
      }, function(_2, innerValue) {
        return state = innerValue, innerValue;
      })(source).subscribe(subscriber);
      return function() {
        state = null;
      };
    });
  }
  switchScan.switchScan = switchScan$1;
  return switchScan;
}
var takeUntil = {};
var hasRequiredTakeUntil;
function requireTakeUntil() {
  if (hasRequiredTakeUntil) return takeUntil;
  hasRequiredTakeUntil = 1;
  Object.defineProperty(takeUntil, "__esModule", { value: true });
  takeUntil.takeUntil = void 0;
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  var noop_1 = /* @__PURE__ */ requireNoop();
  function takeUntil$1(notifier) {
    return lift_1.operate(function(source, subscriber) {
      innerFrom_1.innerFrom(notifier).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function() {
        return subscriber.complete();
      }, noop_1.noop));
      !subscriber.closed && source.subscribe(subscriber);
    });
  }
  takeUntil.takeUntil = takeUntil$1;
  return takeUntil;
}
var takeWhile = {};
var hasRequiredTakeWhile;
function requireTakeWhile() {
  if (hasRequiredTakeWhile) return takeWhile;
  hasRequiredTakeWhile = 1;
  Object.defineProperty(takeWhile, "__esModule", { value: true });
  takeWhile.takeWhile = void 0;
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  function takeWhile$1(predicate, inclusive) {
    if (inclusive === void 0) {
      inclusive = false;
    }
    return lift_1.operate(function(source, subscriber) {
      var index = 0;
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        var result = predicate(value, index++);
        (result || inclusive) && subscriber.next(value);
        !result && subscriber.complete();
      }));
    });
  }
  takeWhile.takeWhile = takeWhile$1;
  return takeWhile;
}
var tap = {};
var hasRequiredTap;
function requireTap() {
  if (hasRequiredTap) return tap;
  hasRequiredTap = 1;
  Object.defineProperty(tap, "__esModule", { value: true });
  tap.tap = void 0;
  var isFunction_1 = /* @__PURE__ */ requireIsFunction();
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  var identity_1 = /* @__PURE__ */ requireIdentity();
  function tap$1(observerOrNext, error2, complete) {
    var tapObserver = isFunction_1.isFunction(observerOrNext) || error2 || complete ? { next: observerOrNext, error: error2, complete } : observerOrNext;
    return tapObserver ? lift_1.operate(function(source, subscriber) {
      var _a;
      (_a = tapObserver.subscribe) === null || _a === void 0 ? void 0 : _a.call(tapObserver);
      var isUnsub = true;
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        var _a2;
        (_a2 = tapObserver.next) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver, value);
        subscriber.next(value);
      }, function() {
        var _a2;
        isUnsub = false;
        (_a2 = tapObserver.complete) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver);
        subscriber.complete();
      }, function(err) {
        var _a2;
        isUnsub = false;
        (_a2 = tapObserver.error) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver, err);
        subscriber.error(err);
      }, function() {
        var _a2, _b;
        if (isUnsub) {
          (_a2 = tapObserver.unsubscribe) === null || _a2 === void 0 ? void 0 : _a2.call(tapObserver);
        }
        (_b = tapObserver.finalize) === null || _b === void 0 ? void 0 : _b.call(tapObserver);
      }));
    }) : identity_1.identity;
  }
  tap.tap = tap$1;
  return tap;
}
var throttle = {};
var hasRequiredThrottle;
function requireThrottle() {
  if (hasRequiredThrottle) return throttle;
  hasRequiredThrottle = 1;
  Object.defineProperty(throttle, "__esModule", { value: true });
  throttle.throttle = void 0;
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  function throttle$1(durationSelector, config2) {
    return lift_1.operate(function(source, subscriber) {
      var _a = config2 !== null && config2 !== void 0 ? config2 : {}, _b = _a.leading, leading = _b === void 0 ? true : _b, _c = _a.trailing, trailing = _c === void 0 ? false : _c;
      var hasValue = false;
      var sendValue = null;
      var throttled = null;
      var isComplete = false;
      var endThrottling = function() {
        throttled === null || throttled === void 0 ? void 0 : throttled.unsubscribe();
        throttled = null;
        if (trailing) {
          send();
          isComplete && subscriber.complete();
        }
      };
      var cleanupThrottling = function() {
        throttled = null;
        isComplete && subscriber.complete();
      };
      var startThrottle = function(value) {
        return throttled = innerFrom_1.innerFrom(durationSelector(value)).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, endThrottling, cleanupThrottling));
      };
      var send = function() {
        if (hasValue) {
          hasValue = false;
          var value = sendValue;
          sendValue = null;
          subscriber.next(value);
          !isComplete && startThrottle(value);
        }
      };
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        hasValue = true;
        sendValue = value;
        !(throttled && !throttled.closed) && (leading ? send() : startThrottle(value));
      }, function() {
        isComplete = true;
        !(trailing && hasValue && throttled && !throttled.closed) && subscriber.complete();
      }));
    });
  }
  throttle.throttle = throttle$1;
  return throttle;
}
var throttleTime = {};
var hasRequiredThrottleTime;
function requireThrottleTime() {
  if (hasRequiredThrottleTime) return throttleTime;
  hasRequiredThrottleTime = 1;
  Object.defineProperty(throttleTime, "__esModule", { value: true });
  throttleTime.throttleTime = void 0;
  var async_1 = /* @__PURE__ */ requireAsync();
  var throttle_1 = /* @__PURE__ */ requireThrottle();
  var timer_1 = /* @__PURE__ */ requireTimer();
  function throttleTime$1(duration, scheduler, config2) {
    if (scheduler === void 0) {
      scheduler = async_1.asyncScheduler;
    }
    var duration$ = timer_1.timer(duration, scheduler);
    return throttle_1.throttle(function() {
      return duration$;
    }, config2);
  }
  throttleTime.throttleTime = throttleTime$1;
  return throttleTime;
}
var timeInterval = {};
var hasRequiredTimeInterval;
function requireTimeInterval() {
  if (hasRequiredTimeInterval) return timeInterval;
  hasRequiredTimeInterval = 1;
  Object.defineProperty(timeInterval, "__esModule", { value: true });
  timeInterval.TimeInterval = timeInterval.timeInterval = void 0;
  var async_1 = /* @__PURE__ */ requireAsync();
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  function timeInterval$1(scheduler) {
    if (scheduler === void 0) {
      scheduler = async_1.asyncScheduler;
    }
    return lift_1.operate(function(source, subscriber) {
      var last2 = scheduler.now();
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        var now = scheduler.now();
        var interval2 = now - last2;
        last2 = now;
        subscriber.next(new TimeInterval(value, interval2));
      }));
    });
  }
  timeInterval.timeInterval = timeInterval$1;
  var TimeInterval = /* @__PURE__ */ function() {
    function TimeInterval2(value, interval2) {
      this.value = value;
      this.interval = interval2;
    }
    return TimeInterval2;
  }();
  timeInterval.TimeInterval = TimeInterval;
  return timeInterval;
}
var timeoutWith = {};
var hasRequiredTimeoutWith;
function requireTimeoutWith() {
  if (hasRequiredTimeoutWith) return timeoutWith;
  hasRequiredTimeoutWith = 1;
  Object.defineProperty(timeoutWith, "__esModule", { value: true });
  timeoutWith.timeoutWith = void 0;
  var async_1 = /* @__PURE__ */ requireAsync();
  var isDate_1 = /* @__PURE__ */ requireIsDate();
  var timeout_1 = /* @__PURE__ */ requireTimeout();
  function timeoutWith$1(due, withObservable, scheduler) {
    var first2;
    var each;
    var _with;
    scheduler = scheduler !== null && scheduler !== void 0 ? scheduler : async_1.async;
    if (isDate_1.isValidDate(due)) {
      first2 = due;
    } else if (typeof due === "number") {
      each = due;
    }
    if (withObservable) {
      _with = function() {
        return withObservable;
      };
    } else {
      throw new TypeError("No observable provided to switch to");
    }
    if (first2 == null && each == null) {
      throw new TypeError("No timeout provided.");
    }
    return timeout_1.timeout({
      first: first2,
      each,
      scheduler,
      with: _with
    });
  }
  timeoutWith.timeoutWith = timeoutWith$1;
  return timeoutWith;
}
var timestamp = {};
var hasRequiredTimestamp;
function requireTimestamp() {
  if (hasRequiredTimestamp) return timestamp;
  hasRequiredTimestamp = 1;
  Object.defineProperty(timestamp, "__esModule", { value: true });
  timestamp.timestamp = void 0;
  var dateTimestampProvider_1 = /* @__PURE__ */ requireDateTimestampProvider();
  var map_1 = /* @__PURE__ */ requireMap();
  function timestamp$1(timestampProvider) {
    if (timestampProvider === void 0) {
      timestampProvider = dateTimestampProvider_1.dateTimestampProvider;
    }
    return map_1.map(function(value) {
      return { value, timestamp: timestampProvider.now() };
    });
  }
  timestamp.timestamp = timestamp$1;
  return timestamp;
}
var window$1 = {};
var hasRequiredWindow;
function requireWindow() {
  if (hasRequiredWindow) return window$1;
  hasRequiredWindow = 1;
  Object.defineProperty(window$1, "__esModule", { value: true });
  window$1.window = void 0;
  var Subject_1 = /* @__PURE__ */ requireSubject();
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  var noop_1 = /* @__PURE__ */ requireNoop();
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  function window2(windowBoundaries) {
    return lift_1.operate(function(source, subscriber) {
      var windowSubject = new Subject_1.Subject();
      subscriber.next(windowSubject.asObservable());
      var errorHandler = function(err) {
        windowSubject.error(err);
        subscriber.error(err);
      };
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        return windowSubject === null || windowSubject === void 0 ? void 0 : windowSubject.next(value);
      }, function() {
        windowSubject.complete();
        subscriber.complete();
      }, errorHandler));
      innerFrom_1.innerFrom(windowBoundaries).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function() {
        windowSubject.complete();
        subscriber.next(windowSubject = new Subject_1.Subject());
      }, noop_1.noop, errorHandler));
      return function() {
        windowSubject === null || windowSubject === void 0 ? void 0 : windowSubject.unsubscribe();
        windowSubject = null;
      };
    });
  }
  window$1.window = window2;
  return window$1;
}
var windowCount = {};
var hasRequiredWindowCount;
function requireWindowCount() {
  if (hasRequiredWindowCount) return windowCount;
  hasRequiredWindowCount = 1;
  var __values = windowCount && windowCount.__values || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  Object.defineProperty(windowCount, "__esModule", { value: true });
  windowCount.windowCount = void 0;
  var Subject_1 = /* @__PURE__ */ requireSubject();
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  function windowCount$1(windowSize, startWindowEvery) {
    if (startWindowEvery === void 0) {
      startWindowEvery = 0;
    }
    var startEvery = startWindowEvery > 0 ? startWindowEvery : windowSize;
    return lift_1.operate(function(source, subscriber) {
      var windows = [new Subject_1.Subject()];
      var count2 = 0;
      subscriber.next(windows[0].asObservable());
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        var e_1, _a;
        try {
          for (var windows_1 = __values(windows), windows_1_1 = windows_1.next(); !windows_1_1.done; windows_1_1 = windows_1.next()) {
            var window_1 = windows_1_1.value;
            window_1.next(value);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (windows_1_1 && !windows_1_1.done && (_a = windows_1.return)) _a.call(windows_1);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
        var c = count2 - windowSize + 1;
        if (c >= 0 && c % startEvery === 0) {
          windows.shift().complete();
        }
        if (++count2 % startEvery === 0) {
          var window_2 = new Subject_1.Subject();
          windows.push(window_2);
          subscriber.next(window_2.asObservable());
        }
      }, function() {
        while (windows.length > 0) {
          windows.shift().complete();
        }
        subscriber.complete();
      }, function(err) {
        while (windows.length > 0) {
          windows.shift().error(err);
        }
        subscriber.error(err);
      }, function() {
        windows = null;
      }));
    });
  }
  windowCount.windowCount = windowCount$1;
  return windowCount;
}
var windowTime = {};
var hasRequiredWindowTime;
function requireWindowTime() {
  if (hasRequiredWindowTime) return windowTime;
  hasRequiredWindowTime = 1;
  Object.defineProperty(windowTime, "__esModule", { value: true });
  windowTime.windowTime = void 0;
  var Subject_1 = /* @__PURE__ */ requireSubject();
  var async_1 = /* @__PURE__ */ requireAsync();
  var Subscription_1 = /* @__PURE__ */ requireSubscription();
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  var arrRemove_1 = /* @__PURE__ */ requireArrRemove();
  var args_1 = /* @__PURE__ */ requireArgs();
  var executeSchedule_1 = /* @__PURE__ */ requireExecuteSchedule();
  function windowTime$1(windowTimeSpan) {
    var _a, _b;
    var otherArgs = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      otherArgs[_i - 1] = arguments[_i];
    }
    var scheduler = (_a = args_1.popScheduler(otherArgs)) !== null && _a !== void 0 ? _a : async_1.asyncScheduler;
    var windowCreationInterval = (_b = otherArgs[0]) !== null && _b !== void 0 ? _b : null;
    var maxWindowSize = otherArgs[1] || Infinity;
    return lift_1.operate(function(source, subscriber) {
      var windowRecords = [];
      var restartOnClose = false;
      var closeWindow = function(record) {
        var window2 = record.window, subs = record.subs;
        window2.complete();
        subs.unsubscribe();
        arrRemove_1.arrRemove(windowRecords, record);
        restartOnClose && startWindow();
      };
      var startWindow = function() {
        if (windowRecords) {
          var subs = new Subscription_1.Subscription();
          subscriber.add(subs);
          var window_1 = new Subject_1.Subject();
          var record_1 = {
            window: window_1,
            subs,
            seen: 0
          };
          windowRecords.push(record_1);
          subscriber.next(window_1.asObservable());
          executeSchedule_1.executeSchedule(subs, scheduler, function() {
            return closeWindow(record_1);
          }, windowTimeSpan);
        }
      };
      if (windowCreationInterval !== null && windowCreationInterval >= 0) {
        executeSchedule_1.executeSchedule(subscriber, scheduler, startWindow, windowCreationInterval, true);
      } else {
        restartOnClose = true;
      }
      startWindow();
      var loop = function(cb) {
        return windowRecords.slice().forEach(cb);
      };
      var terminate = function(cb) {
        loop(function(_a2) {
          var window2 = _a2.window;
          return cb(window2);
        });
        cb(subscriber);
        subscriber.unsubscribe();
      };
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        loop(function(record) {
          record.window.next(value);
          maxWindowSize <= ++record.seen && closeWindow(record);
        });
      }, function() {
        return terminate(function(consumer) {
          return consumer.complete();
        });
      }, function(err) {
        return terminate(function(consumer) {
          return consumer.error(err);
        });
      }));
      return function() {
        windowRecords = null;
      };
    });
  }
  windowTime.windowTime = windowTime$1;
  return windowTime;
}
var windowToggle = {};
var hasRequiredWindowToggle;
function requireWindowToggle() {
  if (hasRequiredWindowToggle) return windowToggle;
  hasRequiredWindowToggle = 1;
  var __values = windowToggle && windowToggle.__values || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  };
  Object.defineProperty(windowToggle, "__esModule", { value: true });
  windowToggle.windowToggle = void 0;
  var Subject_1 = /* @__PURE__ */ requireSubject();
  var Subscription_1 = /* @__PURE__ */ requireSubscription();
  var lift_1 = /* @__PURE__ */ requireLift();
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  var noop_1 = /* @__PURE__ */ requireNoop();
  var arrRemove_1 = /* @__PURE__ */ requireArrRemove();
  function windowToggle$1(openings, closingSelector) {
    return lift_1.operate(function(source, subscriber) {
      var windows = [];
      var handleError = function(err) {
        while (0 < windows.length) {
          windows.shift().error(err);
        }
        subscriber.error(err);
      };
      innerFrom_1.innerFrom(openings).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(openValue) {
        var window2 = new Subject_1.Subject();
        windows.push(window2);
        var closingSubscription = new Subscription_1.Subscription();
        var closeWindow = function() {
          arrRemove_1.arrRemove(windows, window2);
          window2.complete();
          closingSubscription.unsubscribe();
        };
        var closingNotifier;
        try {
          closingNotifier = innerFrom_1.innerFrom(closingSelector(openValue));
        } catch (err) {
          handleError(err);
          return;
        }
        subscriber.next(window2.asObservable());
        closingSubscription.add(closingNotifier.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, closeWindow, noop_1.noop, handleError)));
      }, noop_1.noop));
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        var e_1, _a;
        var windowsCopy = windows.slice();
        try {
          for (var windowsCopy_1 = __values(windowsCopy), windowsCopy_1_1 = windowsCopy_1.next(); !windowsCopy_1_1.done; windowsCopy_1_1 = windowsCopy_1.next()) {
            var window_1 = windowsCopy_1_1.value;
            window_1.next(value);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (windowsCopy_1_1 && !windowsCopy_1_1.done && (_a = windowsCopy_1.return)) _a.call(windowsCopy_1);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
      }, function() {
        while (0 < windows.length) {
          windows.shift().complete();
        }
        subscriber.complete();
      }, handleError, function() {
        while (0 < windows.length) {
          windows.shift().unsubscribe();
        }
      }));
    });
  }
  windowToggle.windowToggle = windowToggle$1;
  return windowToggle;
}
var windowWhen = {};
var hasRequiredWindowWhen;
function requireWindowWhen() {
  if (hasRequiredWindowWhen) return windowWhen;
  hasRequiredWindowWhen = 1;
  Object.defineProperty(windowWhen, "__esModule", { value: true });
  windowWhen.windowWhen = void 0;
  var Subject_1 = /* @__PURE__ */ requireSubject();
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  function windowWhen$1(closingSelector) {
    return lift_1.operate(function(source, subscriber) {
      var window2;
      var closingSubscriber;
      var handleError = function(err) {
        window2.error(err);
        subscriber.error(err);
      };
      var openWindow = function() {
        closingSubscriber === null || closingSubscriber === void 0 ? void 0 : closingSubscriber.unsubscribe();
        window2 === null || window2 === void 0 ? void 0 : window2.complete();
        window2 = new Subject_1.Subject();
        subscriber.next(window2.asObservable());
        var closingNotifier;
        try {
          closingNotifier = innerFrom_1.innerFrom(closingSelector());
        } catch (err) {
          handleError(err);
          return;
        }
        closingNotifier.subscribe(closingSubscriber = OperatorSubscriber_1.createOperatorSubscriber(subscriber, openWindow, openWindow, handleError));
      };
      openWindow();
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        return window2.next(value);
      }, function() {
        window2.complete();
        subscriber.complete();
      }, handleError, function() {
        closingSubscriber === null || closingSubscriber === void 0 ? void 0 : closingSubscriber.unsubscribe();
        window2 = null;
      }));
    });
  }
  windowWhen.windowWhen = windowWhen$1;
  return windowWhen;
}
var withLatestFrom = {};
var hasRequiredWithLatestFrom;
function requireWithLatestFrom() {
  if (hasRequiredWithLatestFrom) return withLatestFrom;
  hasRequiredWithLatestFrom = 1;
  var __read = withLatestFrom && withLatestFrom.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error2) {
      e = { error: error2 };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray = withLatestFrom && withLatestFrom.__spreadArray || function(to, from2) {
    for (var i = 0, il = from2.length, j = to.length; i < il; i++, j++)
      to[j] = from2[i];
    return to;
  };
  Object.defineProperty(withLatestFrom, "__esModule", { value: true });
  withLatestFrom.withLatestFrom = void 0;
  var lift_1 = /* @__PURE__ */ requireLift();
  var OperatorSubscriber_1 = /* @__PURE__ */ requireOperatorSubscriber();
  var innerFrom_1 = /* @__PURE__ */ requireInnerFrom();
  var identity_1 = /* @__PURE__ */ requireIdentity();
  var noop_1 = /* @__PURE__ */ requireNoop();
  var args_1 = /* @__PURE__ */ requireArgs();
  function withLatestFrom$1() {
    var inputs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      inputs[_i] = arguments[_i];
    }
    var project = args_1.popResultSelector(inputs);
    return lift_1.operate(function(source, subscriber) {
      var len = inputs.length;
      var otherValues = new Array(len);
      var hasValue = inputs.map(function() {
        return false;
      });
      var ready = false;
      var _loop_1 = function(i2) {
        innerFrom_1.innerFrom(inputs[i2]).subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
          otherValues[i2] = value;
          if (!ready && !hasValue[i2]) {
            hasValue[i2] = true;
            (ready = hasValue.every(identity_1.identity)) && (hasValue = null);
          }
        }, noop_1.noop));
      };
      for (var i = 0; i < len; i++) {
        _loop_1(i);
      }
      source.subscribe(OperatorSubscriber_1.createOperatorSubscriber(subscriber, function(value) {
        if (ready) {
          var values = __spreadArray([value], __read(otherValues));
          subscriber.next(project ? project.apply(void 0, __spreadArray([], __read(values))) : values);
        }
      }));
    });
  }
  withLatestFrom.withLatestFrom = withLatestFrom$1;
  return withLatestFrom;
}
var zipAll = {};
var hasRequiredZipAll;
function requireZipAll() {
  if (hasRequiredZipAll) return zipAll;
  hasRequiredZipAll = 1;
  Object.defineProperty(zipAll, "__esModule", { value: true });
  zipAll.zipAll = void 0;
  var zip_1 = /* @__PURE__ */ requireZip$1();
  var joinAllInternals_1 = /* @__PURE__ */ requireJoinAllInternals();
  function zipAll$1(project) {
    return joinAllInternals_1.joinAllInternals(zip_1.zip, project);
  }
  zipAll.zipAll = zipAll$1;
  return zipAll;
}
var zipWith = {};
var zip = {};
var hasRequiredZip;
function requireZip() {
  if (hasRequiredZip) return zip;
  hasRequiredZip = 1;
  var __read = zip && zip.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error2) {
      e = { error: error2 };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray = zip && zip.__spreadArray || function(to, from2) {
    for (var i = 0, il = from2.length, j = to.length; i < il; i++, j++)
      to[j] = from2[i];
    return to;
  };
  Object.defineProperty(zip, "__esModule", { value: true });
  zip.zip = void 0;
  var zip_1 = /* @__PURE__ */ requireZip$1();
  var lift_1 = /* @__PURE__ */ requireLift();
  function zip$12() {
    var sources = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      sources[_i] = arguments[_i];
    }
    return lift_1.operate(function(source, subscriber) {
      zip_1.zip.apply(void 0, __spreadArray([source], __read(sources))).subscribe(subscriber);
    });
  }
  zip.zip = zip$12;
  return zip;
}
var hasRequiredZipWith;
function requireZipWith() {
  if (hasRequiredZipWith) return zipWith;
  hasRequiredZipWith = 1;
  var __read = zipWith && zipWith.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error2) {
      e = { error: error2 };
    } finally {
      try {
        if (r && !r.done && (m = i["return"])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
  var __spreadArray = zipWith && zipWith.__spreadArray || function(to, from2) {
    for (var i = 0, il = from2.length, j = to.length; i < il; i++, j++)
      to[j] = from2[i];
    return to;
  };
  Object.defineProperty(zipWith, "__esModule", { value: true });
  zipWith.zipWith = void 0;
  var zip_1 = /* @__PURE__ */ requireZip();
  function zipWith$1() {
    var otherInputs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      otherInputs[_i] = arguments[_i];
    }
    return zip_1.zip.apply(void 0, __spreadArray([], __read(otherInputs)));
  }
  zipWith.zipWith = zipWith$1;
  return zipWith;
}
var hasRequiredCjs;
function requireCjs() {
  if (hasRequiredCjs) return cjs;
  hasRequiredCjs = 1;
  (function(exports2) {
    var __createBinding = cjs && cjs.__createBinding || (Object.create ? function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o, k2, { enumerable: true, get: function() {
        return m[k];
      } });
    } : function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    var __exportStar = cjs && cjs.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.interval = exports2.iif = exports2.generate = exports2.fromEventPattern = exports2.fromEvent = exports2.from = exports2.forkJoin = exports2.empty = exports2.defer = exports2.connectable = exports2.concat = exports2.combineLatest = exports2.bindNodeCallback = exports2.bindCallback = exports2.UnsubscriptionError = exports2.TimeoutError = exports2.SequenceError = exports2.ObjectUnsubscribedError = exports2.NotFoundError = exports2.EmptyError = exports2.ArgumentOutOfRangeError = exports2.firstValueFrom = exports2.lastValueFrom = exports2.isObservable = exports2.identity = exports2.noop = exports2.pipe = exports2.NotificationKind = exports2.Notification = exports2.Subscriber = exports2.Subscription = exports2.Scheduler = exports2.VirtualAction = exports2.VirtualTimeScheduler = exports2.animationFrameScheduler = exports2.animationFrame = exports2.queueScheduler = exports2.queue = exports2.asyncScheduler = exports2.async = exports2.asapScheduler = exports2.asap = exports2.AsyncSubject = exports2.ReplaySubject = exports2.BehaviorSubject = exports2.Subject = exports2.animationFrames = exports2.observable = exports2.ConnectableObservable = exports2.Observable = void 0;
    exports2.filter = exports2.expand = exports2.exhaustMap = exports2.exhaustAll = exports2.exhaust = exports2.every = exports2.endWith = exports2.elementAt = exports2.distinctUntilKeyChanged = exports2.distinctUntilChanged = exports2.distinct = exports2.dematerialize = exports2.delayWhen = exports2.delay = exports2.defaultIfEmpty = exports2.debounceTime = exports2.debounce = exports2.count = exports2.connect = exports2.concatWith = exports2.concatMapTo = exports2.concatMap = exports2.concatAll = exports2.combineLatestWith = exports2.combineLatestAll = exports2.combineAll = exports2.catchError = exports2.bufferWhen = exports2.bufferToggle = exports2.bufferTime = exports2.bufferCount = exports2.buffer = exports2.auditTime = exports2.audit = exports2.config = exports2.NEVER = exports2.EMPTY = exports2.scheduled = exports2.zip = exports2.using = exports2.timer = exports2.throwError = exports2.range = exports2.race = exports2.partition = exports2.pairs = exports2.onErrorResumeNext = exports2.of = exports2.never = exports2.merge = void 0;
    exports2.switchMap = exports2.switchAll = exports2.subscribeOn = exports2.startWith = exports2.skipWhile = exports2.skipUntil = exports2.skipLast = exports2.skip = exports2.single = exports2.shareReplay = exports2.share = exports2.sequenceEqual = exports2.scan = exports2.sampleTime = exports2.sample = exports2.refCount = exports2.retryWhen = exports2.retry = exports2.repeatWhen = exports2.repeat = exports2.reduce = exports2.raceWith = exports2.publishReplay = exports2.publishLast = exports2.publishBehavior = exports2.publish = exports2.pluck = exports2.pairwise = exports2.onErrorResumeNextWith = exports2.observeOn = exports2.multicast = exports2.min = exports2.mergeWith = exports2.mergeScan = exports2.mergeMapTo = exports2.mergeMap = exports2.flatMap = exports2.mergeAll = exports2.max = exports2.materialize = exports2.mapTo = exports2.map = exports2.last = exports2.isEmpty = exports2.ignoreElements = exports2.groupBy = exports2.first = exports2.findIndex = exports2.find = exports2.finalize = void 0;
    exports2.zipWith = exports2.zipAll = exports2.withLatestFrom = exports2.windowWhen = exports2.windowToggle = exports2.windowTime = exports2.windowCount = exports2.window = exports2.toArray = exports2.timestamp = exports2.timeoutWith = exports2.timeout = exports2.timeInterval = exports2.throwIfEmpty = exports2.throttleTime = exports2.throttle = exports2.tap = exports2.takeWhile = exports2.takeUntil = exports2.takeLast = exports2.take = exports2.switchScan = exports2.switchMapTo = void 0;
    var Observable_1 = /* @__PURE__ */ requireObservable();
    Object.defineProperty(exports2, "Observable", { enumerable: true, get: function() {
      return Observable_1.Observable;
    } });
    var ConnectableObservable_1 = /* @__PURE__ */ requireConnectableObservable();
    Object.defineProperty(exports2, "ConnectableObservable", { enumerable: true, get: function() {
      return ConnectableObservable_1.ConnectableObservable;
    } });
    var observable_1 = /* @__PURE__ */ requireObservable$1();
    Object.defineProperty(exports2, "observable", { enumerable: true, get: function() {
      return observable_1.observable;
    } });
    var animationFrames_1 = /* @__PURE__ */ requireAnimationFrames();
    Object.defineProperty(exports2, "animationFrames", { enumerable: true, get: function() {
      return animationFrames_1.animationFrames;
    } });
    var Subject_1 = /* @__PURE__ */ requireSubject();
    Object.defineProperty(exports2, "Subject", { enumerable: true, get: function() {
      return Subject_1.Subject;
    } });
    var BehaviorSubject_1 = /* @__PURE__ */ requireBehaviorSubject();
    Object.defineProperty(exports2, "BehaviorSubject", { enumerable: true, get: function() {
      return BehaviorSubject_1.BehaviorSubject;
    } });
    var ReplaySubject_1 = /* @__PURE__ */ requireReplaySubject();
    Object.defineProperty(exports2, "ReplaySubject", { enumerable: true, get: function() {
      return ReplaySubject_1.ReplaySubject;
    } });
    var AsyncSubject_1 = /* @__PURE__ */ requireAsyncSubject();
    Object.defineProperty(exports2, "AsyncSubject", { enumerable: true, get: function() {
      return AsyncSubject_1.AsyncSubject;
    } });
    var asap_1 = /* @__PURE__ */ requireAsap();
    Object.defineProperty(exports2, "asap", { enumerable: true, get: function() {
      return asap_1.asap;
    } });
    Object.defineProperty(exports2, "asapScheduler", { enumerable: true, get: function() {
      return asap_1.asapScheduler;
    } });
    var async_1 = /* @__PURE__ */ requireAsync();
    Object.defineProperty(exports2, "async", { enumerable: true, get: function() {
      return async_1.async;
    } });
    Object.defineProperty(exports2, "asyncScheduler", { enumerable: true, get: function() {
      return async_1.asyncScheduler;
    } });
    var queue_1 = /* @__PURE__ */ requireQueue();
    Object.defineProperty(exports2, "queue", { enumerable: true, get: function() {
      return queue_1.queue;
    } });
    Object.defineProperty(exports2, "queueScheduler", { enumerable: true, get: function() {
      return queue_1.queueScheduler;
    } });
    var animationFrame_1 = /* @__PURE__ */ requireAnimationFrame();
    Object.defineProperty(exports2, "animationFrame", { enumerable: true, get: function() {
      return animationFrame_1.animationFrame;
    } });
    Object.defineProperty(exports2, "animationFrameScheduler", { enumerable: true, get: function() {
      return animationFrame_1.animationFrameScheduler;
    } });
    var VirtualTimeScheduler_1 = /* @__PURE__ */ requireVirtualTimeScheduler();
    Object.defineProperty(exports2, "VirtualTimeScheduler", { enumerable: true, get: function() {
      return VirtualTimeScheduler_1.VirtualTimeScheduler;
    } });
    Object.defineProperty(exports2, "VirtualAction", { enumerable: true, get: function() {
      return VirtualTimeScheduler_1.VirtualAction;
    } });
    var Scheduler_1 = /* @__PURE__ */ requireScheduler();
    Object.defineProperty(exports2, "Scheduler", { enumerable: true, get: function() {
      return Scheduler_1.Scheduler;
    } });
    var Subscription_1 = /* @__PURE__ */ requireSubscription();
    Object.defineProperty(exports2, "Subscription", { enumerable: true, get: function() {
      return Subscription_1.Subscription;
    } });
    var Subscriber_1 = /* @__PURE__ */ requireSubscriber();
    Object.defineProperty(exports2, "Subscriber", { enumerable: true, get: function() {
      return Subscriber_1.Subscriber;
    } });
    var Notification_1 = /* @__PURE__ */ requireNotification();
    Object.defineProperty(exports2, "Notification", { enumerable: true, get: function() {
      return Notification_1.Notification;
    } });
    Object.defineProperty(exports2, "NotificationKind", { enumerable: true, get: function() {
      return Notification_1.NotificationKind;
    } });
    var pipe_1 = /* @__PURE__ */ requirePipe();
    Object.defineProperty(exports2, "pipe", { enumerable: true, get: function() {
      return pipe_1.pipe;
    } });
    var noop_1 = /* @__PURE__ */ requireNoop();
    Object.defineProperty(exports2, "noop", { enumerable: true, get: function() {
      return noop_1.noop;
    } });
    var identity_1 = /* @__PURE__ */ requireIdentity();
    Object.defineProperty(exports2, "identity", { enumerable: true, get: function() {
      return identity_1.identity;
    } });
    var isObservable_1 = /* @__PURE__ */ requireIsObservable();
    Object.defineProperty(exports2, "isObservable", { enumerable: true, get: function() {
      return isObservable_1.isObservable;
    } });
    var lastValueFrom_1 = /* @__PURE__ */ requireLastValueFrom();
    Object.defineProperty(exports2, "lastValueFrom", { enumerable: true, get: function() {
      return lastValueFrom_1.lastValueFrom;
    } });
    var firstValueFrom_1 = /* @__PURE__ */ requireFirstValueFrom();
    Object.defineProperty(exports2, "firstValueFrom", { enumerable: true, get: function() {
      return firstValueFrom_1.firstValueFrom;
    } });
    var ArgumentOutOfRangeError_1 = /* @__PURE__ */ requireArgumentOutOfRangeError();
    Object.defineProperty(exports2, "ArgumentOutOfRangeError", { enumerable: true, get: function() {
      return ArgumentOutOfRangeError_1.ArgumentOutOfRangeError;
    } });
    var EmptyError_1 = /* @__PURE__ */ requireEmptyError();
    Object.defineProperty(exports2, "EmptyError", { enumerable: true, get: function() {
      return EmptyError_1.EmptyError;
    } });
    var NotFoundError_1 = /* @__PURE__ */ requireNotFoundError();
    Object.defineProperty(exports2, "NotFoundError", { enumerable: true, get: function() {
      return NotFoundError_1.NotFoundError;
    } });
    var ObjectUnsubscribedError_1 = /* @__PURE__ */ requireObjectUnsubscribedError();
    Object.defineProperty(exports2, "ObjectUnsubscribedError", { enumerable: true, get: function() {
      return ObjectUnsubscribedError_1.ObjectUnsubscribedError;
    } });
    var SequenceError_1 = /* @__PURE__ */ requireSequenceError();
    Object.defineProperty(exports2, "SequenceError", { enumerable: true, get: function() {
      return SequenceError_1.SequenceError;
    } });
    var timeout_1 = /* @__PURE__ */ requireTimeout();
    Object.defineProperty(exports2, "TimeoutError", { enumerable: true, get: function() {
      return timeout_1.TimeoutError;
    } });
    var UnsubscriptionError_1 = /* @__PURE__ */ requireUnsubscriptionError();
    Object.defineProperty(exports2, "UnsubscriptionError", { enumerable: true, get: function() {
      return UnsubscriptionError_1.UnsubscriptionError;
    } });
    var bindCallback_1 = /* @__PURE__ */ requireBindCallback();
    Object.defineProperty(exports2, "bindCallback", { enumerable: true, get: function() {
      return bindCallback_1.bindCallback;
    } });
    var bindNodeCallback_1 = /* @__PURE__ */ requireBindNodeCallback();
    Object.defineProperty(exports2, "bindNodeCallback", { enumerable: true, get: function() {
      return bindNodeCallback_1.bindNodeCallback;
    } });
    var combineLatest_1 = /* @__PURE__ */ requireCombineLatest$1();
    Object.defineProperty(exports2, "combineLatest", { enumerable: true, get: function() {
      return combineLatest_1.combineLatest;
    } });
    var concat_1 = /* @__PURE__ */ requireConcat$1();
    Object.defineProperty(exports2, "concat", { enumerable: true, get: function() {
      return concat_1.concat;
    } });
    var connectable_1 = /* @__PURE__ */ requireConnectable();
    Object.defineProperty(exports2, "connectable", { enumerable: true, get: function() {
      return connectable_1.connectable;
    } });
    var defer_1 = /* @__PURE__ */ requireDefer();
    Object.defineProperty(exports2, "defer", { enumerable: true, get: function() {
      return defer_1.defer;
    } });
    var empty_1 = /* @__PURE__ */ requireEmpty();
    Object.defineProperty(exports2, "empty", { enumerable: true, get: function() {
      return empty_1.empty;
    } });
    var forkJoin_1 = /* @__PURE__ */ requireForkJoin();
    Object.defineProperty(exports2, "forkJoin", { enumerable: true, get: function() {
      return forkJoin_1.forkJoin;
    } });
    var from_1 = /* @__PURE__ */ requireFrom();
    Object.defineProperty(exports2, "from", { enumerable: true, get: function() {
      return from_1.from;
    } });
    var fromEvent_1 = /* @__PURE__ */ requireFromEvent();
    Object.defineProperty(exports2, "fromEvent", { enumerable: true, get: function() {
      return fromEvent_1.fromEvent;
    } });
    var fromEventPattern_1 = /* @__PURE__ */ requireFromEventPattern();
    Object.defineProperty(exports2, "fromEventPattern", { enumerable: true, get: function() {
      return fromEventPattern_1.fromEventPattern;
    } });
    var generate_1 = /* @__PURE__ */ requireGenerate();
    Object.defineProperty(exports2, "generate", { enumerable: true, get: function() {
      return generate_1.generate;
    } });
    var iif_1 = /* @__PURE__ */ requireIif();
    Object.defineProperty(exports2, "iif", { enumerable: true, get: function() {
      return iif_1.iif;
    } });
    var interval_1 = /* @__PURE__ */ requireInterval();
    Object.defineProperty(exports2, "interval", { enumerable: true, get: function() {
      return interval_1.interval;
    } });
    var merge_1 = /* @__PURE__ */ requireMerge$1();
    Object.defineProperty(exports2, "merge", { enumerable: true, get: function() {
      return merge_1.merge;
    } });
    var never_1 = /* @__PURE__ */ requireNever();
    Object.defineProperty(exports2, "never", { enumerable: true, get: function() {
      return never_1.never;
    } });
    var of_1 = /* @__PURE__ */ requireOf();
    Object.defineProperty(exports2, "of", { enumerable: true, get: function() {
      return of_1.of;
    } });
    var onErrorResumeNext_1 = /* @__PURE__ */ requireOnErrorResumeNext();
    Object.defineProperty(exports2, "onErrorResumeNext", { enumerable: true, get: function() {
      return onErrorResumeNext_1.onErrorResumeNext;
    } });
    var pairs_1 = /* @__PURE__ */ requirePairs();
    Object.defineProperty(exports2, "pairs", { enumerable: true, get: function() {
      return pairs_1.pairs;
    } });
    var partition_1 = /* @__PURE__ */ requirePartition();
    Object.defineProperty(exports2, "partition", { enumerable: true, get: function() {
      return partition_1.partition;
    } });
    var race_1 = /* @__PURE__ */ requireRace();
    Object.defineProperty(exports2, "race", { enumerable: true, get: function() {
      return race_1.race;
    } });
    var range_1 = /* @__PURE__ */ requireRange$1();
    Object.defineProperty(exports2, "range", { enumerable: true, get: function() {
      return range_1.range;
    } });
    var throwError_1 = /* @__PURE__ */ requireThrowError();
    Object.defineProperty(exports2, "throwError", { enumerable: true, get: function() {
      return throwError_1.throwError;
    } });
    var timer_1 = /* @__PURE__ */ requireTimer();
    Object.defineProperty(exports2, "timer", { enumerable: true, get: function() {
      return timer_1.timer;
    } });
    var using_1 = /* @__PURE__ */ requireUsing();
    Object.defineProperty(exports2, "using", { enumerable: true, get: function() {
      return using_1.using;
    } });
    var zip_1 = /* @__PURE__ */ requireZip$1();
    Object.defineProperty(exports2, "zip", { enumerable: true, get: function() {
      return zip_1.zip;
    } });
    var scheduled_1 = /* @__PURE__ */ requireScheduled();
    Object.defineProperty(exports2, "scheduled", { enumerable: true, get: function() {
      return scheduled_1.scheduled;
    } });
    var empty_2 = /* @__PURE__ */ requireEmpty();
    Object.defineProperty(exports2, "EMPTY", { enumerable: true, get: function() {
      return empty_2.EMPTY;
    } });
    var never_2 = /* @__PURE__ */ requireNever();
    Object.defineProperty(exports2, "NEVER", { enumerable: true, get: function() {
      return never_2.NEVER;
    } });
    __exportStar(/* @__PURE__ */ requireTypes(), exports2);
    var config_1 = /* @__PURE__ */ requireConfig();
    Object.defineProperty(exports2, "config", { enumerable: true, get: function() {
      return config_1.config;
    } });
    var audit_1 = /* @__PURE__ */ requireAudit();
    Object.defineProperty(exports2, "audit", { enumerable: true, get: function() {
      return audit_1.audit;
    } });
    var auditTime_1 = /* @__PURE__ */ requireAuditTime();
    Object.defineProperty(exports2, "auditTime", { enumerable: true, get: function() {
      return auditTime_1.auditTime;
    } });
    var buffer_1 = /* @__PURE__ */ requireBuffer();
    Object.defineProperty(exports2, "buffer", { enumerable: true, get: function() {
      return buffer_1.buffer;
    } });
    var bufferCount_1 = /* @__PURE__ */ requireBufferCount();
    Object.defineProperty(exports2, "bufferCount", { enumerable: true, get: function() {
      return bufferCount_1.bufferCount;
    } });
    var bufferTime_1 = /* @__PURE__ */ requireBufferTime();
    Object.defineProperty(exports2, "bufferTime", { enumerable: true, get: function() {
      return bufferTime_1.bufferTime;
    } });
    var bufferToggle_1 = /* @__PURE__ */ requireBufferToggle();
    Object.defineProperty(exports2, "bufferToggle", { enumerable: true, get: function() {
      return bufferToggle_1.bufferToggle;
    } });
    var bufferWhen_1 = /* @__PURE__ */ requireBufferWhen();
    Object.defineProperty(exports2, "bufferWhen", { enumerable: true, get: function() {
      return bufferWhen_1.bufferWhen;
    } });
    var catchError_1 = /* @__PURE__ */ requireCatchError();
    Object.defineProperty(exports2, "catchError", { enumerable: true, get: function() {
      return catchError_1.catchError;
    } });
    var combineAll_1 = /* @__PURE__ */ requireCombineAll();
    Object.defineProperty(exports2, "combineAll", { enumerable: true, get: function() {
      return combineAll_1.combineAll;
    } });
    var combineLatestAll_1 = /* @__PURE__ */ requireCombineLatestAll();
    Object.defineProperty(exports2, "combineLatestAll", { enumerable: true, get: function() {
      return combineLatestAll_1.combineLatestAll;
    } });
    var combineLatestWith_1 = /* @__PURE__ */ requireCombineLatestWith();
    Object.defineProperty(exports2, "combineLatestWith", { enumerable: true, get: function() {
      return combineLatestWith_1.combineLatestWith;
    } });
    var concatAll_1 = /* @__PURE__ */ requireConcatAll();
    Object.defineProperty(exports2, "concatAll", { enumerable: true, get: function() {
      return concatAll_1.concatAll;
    } });
    var concatMap_1 = /* @__PURE__ */ requireConcatMap();
    Object.defineProperty(exports2, "concatMap", { enumerable: true, get: function() {
      return concatMap_1.concatMap;
    } });
    var concatMapTo_1 = /* @__PURE__ */ requireConcatMapTo();
    Object.defineProperty(exports2, "concatMapTo", { enumerable: true, get: function() {
      return concatMapTo_1.concatMapTo;
    } });
    var concatWith_1 = /* @__PURE__ */ requireConcatWith();
    Object.defineProperty(exports2, "concatWith", { enumerable: true, get: function() {
      return concatWith_1.concatWith;
    } });
    var connect_1 = /* @__PURE__ */ requireConnect();
    Object.defineProperty(exports2, "connect", { enumerable: true, get: function() {
      return connect_1.connect;
    } });
    var count_1 = /* @__PURE__ */ requireCount();
    Object.defineProperty(exports2, "count", { enumerable: true, get: function() {
      return count_1.count;
    } });
    var debounce_1 = /* @__PURE__ */ requireDebounce();
    Object.defineProperty(exports2, "debounce", { enumerable: true, get: function() {
      return debounce_1.debounce;
    } });
    var debounceTime_1 = /* @__PURE__ */ requireDebounceTime();
    Object.defineProperty(exports2, "debounceTime", { enumerable: true, get: function() {
      return debounceTime_1.debounceTime;
    } });
    var defaultIfEmpty_1 = /* @__PURE__ */ requireDefaultIfEmpty();
    Object.defineProperty(exports2, "defaultIfEmpty", { enumerable: true, get: function() {
      return defaultIfEmpty_1.defaultIfEmpty;
    } });
    var delay_1 = /* @__PURE__ */ requireDelay();
    Object.defineProperty(exports2, "delay", { enumerable: true, get: function() {
      return delay_1.delay;
    } });
    var delayWhen_1 = /* @__PURE__ */ requireDelayWhen();
    Object.defineProperty(exports2, "delayWhen", { enumerable: true, get: function() {
      return delayWhen_1.delayWhen;
    } });
    var dematerialize_1 = /* @__PURE__ */ requireDematerialize();
    Object.defineProperty(exports2, "dematerialize", { enumerable: true, get: function() {
      return dematerialize_1.dematerialize;
    } });
    var distinct_1 = /* @__PURE__ */ requireDistinct();
    Object.defineProperty(exports2, "distinct", { enumerable: true, get: function() {
      return distinct_1.distinct;
    } });
    var distinctUntilChanged_1 = /* @__PURE__ */ requireDistinctUntilChanged();
    Object.defineProperty(exports2, "distinctUntilChanged", { enumerable: true, get: function() {
      return distinctUntilChanged_1.distinctUntilChanged;
    } });
    var distinctUntilKeyChanged_1 = /* @__PURE__ */ requireDistinctUntilKeyChanged();
    Object.defineProperty(exports2, "distinctUntilKeyChanged", { enumerable: true, get: function() {
      return distinctUntilKeyChanged_1.distinctUntilKeyChanged;
    } });
    var elementAt_1 = /* @__PURE__ */ requireElementAt();
    Object.defineProperty(exports2, "elementAt", { enumerable: true, get: function() {
      return elementAt_1.elementAt;
    } });
    var endWith_1 = /* @__PURE__ */ requireEndWith();
    Object.defineProperty(exports2, "endWith", { enumerable: true, get: function() {
      return endWith_1.endWith;
    } });
    var every_1 = /* @__PURE__ */ requireEvery();
    Object.defineProperty(exports2, "every", { enumerable: true, get: function() {
      return every_1.every;
    } });
    var exhaust_1 = /* @__PURE__ */ requireExhaust();
    Object.defineProperty(exports2, "exhaust", { enumerable: true, get: function() {
      return exhaust_1.exhaust;
    } });
    var exhaustAll_1 = /* @__PURE__ */ requireExhaustAll();
    Object.defineProperty(exports2, "exhaustAll", { enumerable: true, get: function() {
      return exhaustAll_1.exhaustAll;
    } });
    var exhaustMap_1 = /* @__PURE__ */ requireExhaustMap();
    Object.defineProperty(exports2, "exhaustMap", { enumerable: true, get: function() {
      return exhaustMap_1.exhaustMap;
    } });
    var expand_1 = /* @__PURE__ */ requireExpand();
    Object.defineProperty(exports2, "expand", { enumerable: true, get: function() {
      return expand_1.expand;
    } });
    var filter_1 = /* @__PURE__ */ requireFilter();
    Object.defineProperty(exports2, "filter", { enumerable: true, get: function() {
      return filter_1.filter;
    } });
    var finalize_1 = /* @__PURE__ */ requireFinalize();
    Object.defineProperty(exports2, "finalize", { enumerable: true, get: function() {
      return finalize_1.finalize;
    } });
    var find_1 = /* @__PURE__ */ requireFind();
    Object.defineProperty(exports2, "find", { enumerable: true, get: function() {
      return find_1.find;
    } });
    var findIndex_1 = /* @__PURE__ */ requireFindIndex();
    Object.defineProperty(exports2, "findIndex", { enumerable: true, get: function() {
      return findIndex_1.findIndex;
    } });
    var first_1 = /* @__PURE__ */ requireFirst();
    Object.defineProperty(exports2, "first", { enumerable: true, get: function() {
      return first_1.first;
    } });
    var groupBy_1 = /* @__PURE__ */ requireGroupBy();
    Object.defineProperty(exports2, "groupBy", { enumerable: true, get: function() {
      return groupBy_1.groupBy;
    } });
    var ignoreElements_1 = /* @__PURE__ */ requireIgnoreElements();
    Object.defineProperty(exports2, "ignoreElements", { enumerable: true, get: function() {
      return ignoreElements_1.ignoreElements;
    } });
    var isEmpty_1 = /* @__PURE__ */ requireIsEmpty();
    Object.defineProperty(exports2, "isEmpty", { enumerable: true, get: function() {
      return isEmpty_1.isEmpty;
    } });
    var last_1 = /* @__PURE__ */ requireLast();
    Object.defineProperty(exports2, "last", { enumerable: true, get: function() {
      return last_1.last;
    } });
    var map_1 = /* @__PURE__ */ requireMap();
    Object.defineProperty(exports2, "map", { enumerable: true, get: function() {
      return map_1.map;
    } });
    var mapTo_1 = /* @__PURE__ */ requireMapTo();
    Object.defineProperty(exports2, "mapTo", { enumerable: true, get: function() {
      return mapTo_1.mapTo;
    } });
    var materialize_1 = /* @__PURE__ */ requireMaterialize();
    Object.defineProperty(exports2, "materialize", { enumerable: true, get: function() {
      return materialize_1.materialize;
    } });
    var max_1 = /* @__PURE__ */ requireMax();
    Object.defineProperty(exports2, "max", { enumerable: true, get: function() {
      return max_1.max;
    } });
    var mergeAll_1 = /* @__PURE__ */ requireMergeAll();
    Object.defineProperty(exports2, "mergeAll", { enumerable: true, get: function() {
      return mergeAll_1.mergeAll;
    } });
    var flatMap_1 = /* @__PURE__ */ requireFlatMap();
    Object.defineProperty(exports2, "flatMap", { enumerable: true, get: function() {
      return flatMap_1.flatMap;
    } });
    var mergeMap_1 = /* @__PURE__ */ requireMergeMap();
    Object.defineProperty(exports2, "mergeMap", { enumerable: true, get: function() {
      return mergeMap_1.mergeMap;
    } });
    var mergeMapTo_1 = /* @__PURE__ */ requireMergeMapTo();
    Object.defineProperty(exports2, "mergeMapTo", { enumerable: true, get: function() {
      return mergeMapTo_1.mergeMapTo;
    } });
    var mergeScan_1 = /* @__PURE__ */ requireMergeScan();
    Object.defineProperty(exports2, "mergeScan", { enumerable: true, get: function() {
      return mergeScan_1.mergeScan;
    } });
    var mergeWith_1 = /* @__PURE__ */ requireMergeWith();
    Object.defineProperty(exports2, "mergeWith", { enumerable: true, get: function() {
      return mergeWith_1.mergeWith;
    } });
    var min_1 = /* @__PURE__ */ requireMin();
    Object.defineProperty(exports2, "min", { enumerable: true, get: function() {
      return min_1.min;
    } });
    var multicast_1 = /* @__PURE__ */ requireMulticast();
    Object.defineProperty(exports2, "multicast", { enumerable: true, get: function() {
      return multicast_1.multicast;
    } });
    var observeOn_1 = /* @__PURE__ */ requireObserveOn();
    Object.defineProperty(exports2, "observeOn", { enumerable: true, get: function() {
      return observeOn_1.observeOn;
    } });
    var onErrorResumeNextWith_1 = /* @__PURE__ */ requireOnErrorResumeNextWith();
    Object.defineProperty(exports2, "onErrorResumeNextWith", { enumerable: true, get: function() {
      return onErrorResumeNextWith_1.onErrorResumeNextWith;
    } });
    var pairwise_1 = /* @__PURE__ */ requirePairwise();
    Object.defineProperty(exports2, "pairwise", { enumerable: true, get: function() {
      return pairwise_1.pairwise;
    } });
    var pluck_1 = /* @__PURE__ */ requirePluck();
    Object.defineProperty(exports2, "pluck", { enumerable: true, get: function() {
      return pluck_1.pluck;
    } });
    var publish_1 = /* @__PURE__ */ requirePublish();
    Object.defineProperty(exports2, "publish", { enumerable: true, get: function() {
      return publish_1.publish;
    } });
    var publishBehavior_1 = /* @__PURE__ */ requirePublishBehavior();
    Object.defineProperty(exports2, "publishBehavior", { enumerable: true, get: function() {
      return publishBehavior_1.publishBehavior;
    } });
    var publishLast_1 = /* @__PURE__ */ requirePublishLast();
    Object.defineProperty(exports2, "publishLast", { enumerable: true, get: function() {
      return publishLast_1.publishLast;
    } });
    var publishReplay_1 = /* @__PURE__ */ requirePublishReplay();
    Object.defineProperty(exports2, "publishReplay", { enumerable: true, get: function() {
      return publishReplay_1.publishReplay;
    } });
    var raceWith_1 = /* @__PURE__ */ requireRaceWith();
    Object.defineProperty(exports2, "raceWith", { enumerable: true, get: function() {
      return raceWith_1.raceWith;
    } });
    var reduce_1 = /* @__PURE__ */ requireReduce();
    Object.defineProperty(exports2, "reduce", { enumerable: true, get: function() {
      return reduce_1.reduce;
    } });
    var repeat_1 = /* @__PURE__ */ requireRepeat();
    Object.defineProperty(exports2, "repeat", { enumerable: true, get: function() {
      return repeat_1.repeat;
    } });
    var repeatWhen_1 = /* @__PURE__ */ requireRepeatWhen();
    Object.defineProperty(exports2, "repeatWhen", { enumerable: true, get: function() {
      return repeatWhen_1.repeatWhen;
    } });
    var retry_1 = /* @__PURE__ */ requireRetry();
    Object.defineProperty(exports2, "retry", { enumerable: true, get: function() {
      return retry_1.retry;
    } });
    var retryWhen_1 = /* @__PURE__ */ requireRetryWhen();
    Object.defineProperty(exports2, "retryWhen", { enumerable: true, get: function() {
      return retryWhen_1.retryWhen;
    } });
    var refCount_1 = /* @__PURE__ */ requireRefCount();
    Object.defineProperty(exports2, "refCount", { enumerable: true, get: function() {
      return refCount_1.refCount;
    } });
    var sample_1 = /* @__PURE__ */ requireSample();
    Object.defineProperty(exports2, "sample", { enumerable: true, get: function() {
      return sample_1.sample;
    } });
    var sampleTime_1 = /* @__PURE__ */ requireSampleTime();
    Object.defineProperty(exports2, "sampleTime", { enumerable: true, get: function() {
      return sampleTime_1.sampleTime;
    } });
    var scan_1 = /* @__PURE__ */ requireScan();
    Object.defineProperty(exports2, "scan", { enumerable: true, get: function() {
      return scan_1.scan;
    } });
    var sequenceEqual_1 = /* @__PURE__ */ requireSequenceEqual();
    Object.defineProperty(exports2, "sequenceEqual", { enumerable: true, get: function() {
      return sequenceEqual_1.sequenceEqual;
    } });
    var share_1 = /* @__PURE__ */ requireShare();
    Object.defineProperty(exports2, "share", { enumerable: true, get: function() {
      return share_1.share;
    } });
    var shareReplay_1 = /* @__PURE__ */ requireShareReplay();
    Object.defineProperty(exports2, "shareReplay", { enumerable: true, get: function() {
      return shareReplay_1.shareReplay;
    } });
    var single_1 = /* @__PURE__ */ requireSingle();
    Object.defineProperty(exports2, "single", { enumerable: true, get: function() {
      return single_1.single;
    } });
    var skip_1 = /* @__PURE__ */ requireSkip();
    Object.defineProperty(exports2, "skip", { enumerable: true, get: function() {
      return skip_1.skip;
    } });
    var skipLast_1 = /* @__PURE__ */ requireSkipLast();
    Object.defineProperty(exports2, "skipLast", { enumerable: true, get: function() {
      return skipLast_1.skipLast;
    } });
    var skipUntil_1 = /* @__PURE__ */ requireSkipUntil();
    Object.defineProperty(exports2, "skipUntil", { enumerable: true, get: function() {
      return skipUntil_1.skipUntil;
    } });
    var skipWhile_1 = /* @__PURE__ */ requireSkipWhile();
    Object.defineProperty(exports2, "skipWhile", { enumerable: true, get: function() {
      return skipWhile_1.skipWhile;
    } });
    var startWith_1 = /* @__PURE__ */ requireStartWith();
    Object.defineProperty(exports2, "startWith", { enumerable: true, get: function() {
      return startWith_1.startWith;
    } });
    var subscribeOn_1 = /* @__PURE__ */ requireSubscribeOn();
    Object.defineProperty(exports2, "subscribeOn", { enumerable: true, get: function() {
      return subscribeOn_1.subscribeOn;
    } });
    var switchAll_1 = /* @__PURE__ */ requireSwitchAll();
    Object.defineProperty(exports2, "switchAll", { enumerable: true, get: function() {
      return switchAll_1.switchAll;
    } });
    var switchMap_1 = /* @__PURE__ */ requireSwitchMap();
    Object.defineProperty(exports2, "switchMap", { enumerable: true, get: function() {
      return switchMap_1.switchMap;
    } });
    var switchMapTo_1 = /* @__PURE__ */ requireSwitchMapTo();
    Object.defineProperty(exports2, "switchMapTo", { enumerable: true, get: function() {
      return switchMapTo_1.switchMapTo;
    } });
    var switchScan_1 = /* @__PURE__ */ requireSwitchScan();
    Object.defineProperty(exports2, "switchScan", { enumerable: true, get: function() {
      return switchScan_1.switchScan;
    } });
    var take_1 = /* @__PURE__ */ requireTake();
    Object.defineProperty(exports2, "take", { enumerable: true, get: function() {
      return take_1.take;
    } });
    var takeLast_1 = /* @__PURE__ */ requireTakeLast();
    Object.defineProperty(exports2, "takeLast", { enumerable: true, get: function() {
      return takeLast_1.takeLast;
    } });
    var takeUntil_1 = /* @__PURE__ */ requireTakeUntil();
    Object.defineProperty(exports2, "takeUntil", { enumerable: true, get: function() {
      return takeUntil_1.takeUntil;
    } });
    var takeWhile_1 = /* @__PURE__ */ requireTakeWhile();
    Object.defineProperty(exports2, "takeWhile", { enumerable: true, get: function() {
      return takeWhile_1.takeWhile;
    } });
    var tap_1 = /* @__PURE__ */ requireTap();
    Object.defineProperty(exports2, "tap", { enumerable: true, get: function() {
      return tap_1.tap;
    } });
    var throttle_1 = /* @__PURE__ */ requireThrottle();
    Object.defineProperty(exports2, "throttle", { enumerable: true, get: function() {
      return throttle_1.throttle;
    } });
    var throttleTime_1 = /* @__PURE__ */ requireThrottleTime();
    Object.defineProperty(exports2, "throttleTime", { enumerable: true, get: function() {
      return throttleTime_1.throttleTime;
    } });
    var throwIfEmpty_1 = /* @__PURE__ */ requireThrowIfEmpty();
    Object.defineProperty(exports2, "throwIfEmpty", { enumerable: true, get: function() {
      return throwIfEmpty_1.throwIfEmpty;
    } });
    var timeInterval_1 = /* @__PURE__ */ requireTimeInterval();
    Object.defineProperty(exports2, "timeInterval", { enumerable: true, get: function() {
      return timeInterval_1.timeInterval;
    } });
    var timeout_2 = /* @__PURE__ */ requireTimeout();
    Object.defineProperty(exports2, "timeout", { enumerable: true, get: function() {
      return timeout_2.timeout;
    } });
    var timeoutWith_1 = /* @__PURE__ */ requireTimeoutWith();
    Object.defineProperty(exports2, "timeoutWith", { enumerable: true, get: function() {
      return timeoutWith_1.timeoutWith;
    } });
    var timestamp_1 = /* @__PURE__ */ requireTimestamp();
    Object.defineProperty(exports2, "timestamp", { enumerable: true, get: function() {
      return timestamp_1.timestamp;
    } });
    var toArray_1 = /* @__PURE__ */ requireToArray();
    Object.defineProperty(exports2, "toArray", { enumerable: true, get: function() {
      return toArray_1.toArray;
    } });
    var window_1 = /* @__PURE__ */ requireWindow();
    Object.defineProperty(exports2, "window", { enumerable: true, get: function() {
      return window_1.window;
    } });
    var windowCount_1 = /* @__PURE__ */ requireWindowCount();
    Object.defineProperty(exports2, "windowCount", { enumerable: true, get: function() {
      return windowCount_1.windowCount;
    } });
    var windowTime_1 = /* @__PURE__ */ requireWindowTime();
    Object.defineProperty(exports2, "windowTime", { enumerable: true, get: function() {
      return windowTime_1.windowTime;
    } });
    var windowToggle_1 = /* @__PURE__ */ requireWindowToggle();
    Object.defineProperty(exports2, "windowToggle", { enumerable: true, get: function() {
      return windowToggle_1.windowToggle;
    } });
    var windowWhen_1 = /* @__PURE__ */ requireWindowWhen();
    Object.defineProperty(exports2, "windowWhen", { enumerable: true, get: function() {
      return windowWhen_1.windowWhen;
    } });
    var withLatestFrom_1 = /* @__PURE__ */ requireWithLatestFrom();
    Object.defineProperty(exports2, "withLatestFrom", { enumerable: true, get: function() {
      return withLatestFrom_1.withLatestFrom;
    } });
    var zipAll_1 = /* @__PURE__ */ requireZipAll();
    Object.defineProperty(exports2, "zipAll", { enumerable: true, get: function() {
      return zipAll_1.zipAll;
    } });
    var zipWith_1 = /* @__PURE__ */ requireZipWith();
    Object.defineProperty(exports2, "zipWith", { enumerable: true, get: function() {
      return zipWith_1.zipWith;
    } });
  })(cjs);
  return cjs;
}
var cjsExports = /* @__PURE__ */ requireCjs();
var runAsync$1 = { exports: {} };
var hasRequiredRunAsync;
function requireRunAsync() {
  if (hasRequiredRunAsync) return runAsync$1.exports;
  hasRequiredRunAsync = 1;
  function isPromise2(obj) {
    return !!obj && (typeof obj === "object" || typeof obj === "function") && typeof obj.then === "function";
  }
  var runAsync2 = runAsync$1.exports = function(func, cb, proxyProperty = "async") {
    if (typeof cb === "string") {
      proxyProperty = cb;
      cb = void 0;
    }
    cb = cb || function() {
    };
    return function() {
      var args2 = arguments;
      var originalThis = this;
      var promise = new Promise(function(resolve, reject) {
        var resolved = false;
        const wrappedResolve = function(value) {
          if (resolved) {
            console.warn("Run-async promise already resolved.");
          }
          resolved = true;
          resolve(value);
        };
        var rejected = false;
        const wrappedReject = function(value) {
          if (rejected) {
            console.warn("Run-async promise already rejected.");
          }
          rejected = true;
          reject(value);
        };
        var usingCallback = false;
        var callbackConflict = false;
        var contextEnded = false;
        var doneFactory = function() {
          if (contextEnded) {
            console.warn("Run-async async() called outside a valid run-async context, callback will be ignored.");
            return function() {
            };
          }
          if (callbackConflict) {
            console.warn("Run-async wrapped function (async) returned a promise.\nCalls to async() callback can have unexpected results.");
          }
          usingCallback = true;
          return function(err, value) {
            if (err) {
              wrappedReject(err);
            } else {
              wrappedResolve(value);
            }
          };
        };
        var _this;
        if (originalThis && proxyProperty && Proxy) {
          _this = new Proxy(originalThis, {
            get(_target, prop) {
              if (prop === proxyProperty) {
                if (prop in _target) {
                  console.warn(`${proxyProperty} property is been shadowed by run-sync`);
                }
                return doneFactory;
              }
              return Reflect.get(...arguments);
            }
          });
        } else {
          _this = { [proxyProperty]: doneFactory };
        }
        var answer = func.apply(_this, Array.prototype.slice.call(args2));
        if (usingCallback) {
          if (isPromise2(answer)) {
            console.warn("Run-async wrapped function (sync) returned a promise but async() callback must be executed to resolve.");
          }
        } else {
          if (isPromise2(answer)) {
            callbackConflict = true;
            answer.then(wrappedResolve, wrappedReject);
          } else {
            wrappedResolve(answer);
          }
        }
        contextEnded = true;
      });
      promise.then(cb.bind(null, null), cb);
      return promise;
    };
  };
  runAsync2.cb = function(func, cb) {
    return runAsync2(function() {
      var args2 = Array.prototype.slice.call(arguments);
      if (args2.length === func.length - 1) {
        args2.push(this.async());
      }
      return func.apply(this, args2);
    }, cb);
  };
  return runAsync$1.exports;
}
var runAsyncExports = requireRunAsync();
const runAsync = /* @__PURE__ */ getDefaultExportFromCjs(runAsyncExports);
const _ = {
  set: (obj, path2 = "", value) => {
    let pointer = obj;
    path2.split(".").forEach((key, index, arr) => {
      if (key === "__proto__" || key === "constructor")
        return;
      if (index === arr.length - 1) {
        pointer[key] = value;
      } else if (!(key in pointer) || typeof pointer[key] !== "object") {
        pointer[key] = {};
      }
      pointer = pointer[key];
    });
  },
  get: (obj, path2 = "", defaultValue) => {
    const travel = (regexp) => String.prototype.split.call(path2, regexp).filter(Boolean).reduce(
      // @ts-expect-error implicit any on res[key]
      (res, key) => res == null ? res : res[key],
      obj
    );
    const result = travel(/[,[\]]+?/) || travel(/[,.[\]]+?/);
    return result === void 0 || result === obj ? defaultValue : result;
  }
};
async function fetchAsyncQuestionProperty(question, prop, answers) {
  const propGetter = question[prop];
  if (typeof propGetter === "function") {
    return runAsync(propGetter)(answers);
  }
  return propGetter;
}
class TTYError extends Error {
  constructor() {
    super(...arguments);
    __publicField(this, "name", "TTYError");
    __publicField(this, "isTtyError", true);
  }
}
function setupReadlineOptions(opt) {
  opt.skipTTYChecks = opt.skipTTYChecks === void 0 ? true : opt.skipTTYChecks;
  const input2 = opt.input || process.stdin;
  if (!opt.skipTTYChecks && !input2.isTTY) {
    throw new TTYError("Prompts can not be meaningfully rendered in non-TTY environments");
  }
  const ms = new MuteStream();
  ms.pipe(opt.output || process.stdout);
  const output = ms;
  return {
    terminal: true,
    ...opt,
    input: input2,
    output
  };
}
function isQuestionArray(questions) {
  return Array.isArray(questions);
}
function isQuestionMap(questions) {
  return Object.values(questions).every((maybeQuestion) => typeof maybeQuestion === "object" && !Array.isArray(maybeQuestion) && maybeQuestion != null);
}
function isPromptConstructor(prompt2) {
  return Boolean(prompt2.prototype && "run" in prompt2.prototype && // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  typeof prompt2.prototype.run === "function");
}
class PromptsRunner {
  constructor(prompts, opt = {}) {
    __publicField(this, "prompts");
    __publicField(this, "answers", {});
    __publicField(this, "process", cjsExports.EMPTY);
    __publicField(this, "abortController", new AbortController());
    __publicField(this, "opt");
    __publicField(this, "prepareQuestion", async (question) => {
      const [message, defaultValue, resolvedChoices] = await Promise.all([
        fetchAsyncQuestionProperty(question, "message", this.answers),
        fetchAsyncQuestionProperty(question, "default", this.answers),
        fetchAsyncQuestionProperty(question, "choices", this.answers)
      ]);
      let choices;
      if (Array.isArray(resolvedChoices)) {
        choices = resolvedChoices.map((choice) => {
          const choiceObj = typeof choice !== "object" || choice == null ? { name: choice, value: choice } : {
            ...choice,
            value: "value" in choice ? choice.value : "name" in choice ? choice.name : void 0
          };
          if ("value" in choiceObj && Array.isArray(defaultValue)) {
            return {
              checked: defaultValue.includes(choiceObj.value),
              ...choiceObj
            };
          }
          return choiceObj;
        });
      }
      return Object.assign({}, question, {
        message,
        default: defaultValue,
        choices,
        type: question.type in this.prompts ? question.type : "input"
      });
    });
    __publicField(this, "fetchAnswer", async (rawQuestion) => {
      const question = await this.prepareQuestion(rawQuestion);
      const prompt2 = this.prompts[question.type];
      if (prompt2 == null) {
        throw new Error(`Prompt for type ${question.type} not found`);
      }
      let cleanupSignal;
      const promptFn = isPromptConstructor(prompt2) ? (q, opt) => new Promise((resolve, reject) => {
        const { signal: signal2 } = opt;
        if (signal2.aborted) {
          reject(new AbortPromptError({ cause: signal2.reason }));
          return;
        }
        const rl = readline$1.createInterface(setupReadlineOptions(opt));
        const onForceClose = () => {
          this.close();
          process.kill(process.pid, "SIGINT");
          console.log("");
        };
        const onClose = () => {
          process.removeListener("exit", onForceClose);
          rl.removeListener("SIGINT", onForceClose);
          rl.setPrompt("");
          rl.output.unmute();
          rl.output.write(ansiEscapes.cursorShow);
          rl.output.end();
          rl.close();
        };
        process.on("exit", onForceClose);
        rl.on("SIGINT", onForceClose);
        const activePrompt = new prompt2(q, rl, this.answers);
        const cleanup = () => {
          onClose();
          cleanupSignal?.();
        };
        const abort = () => {
          reject(new AbortPromptError({ cause: signal2.reason }));
          cleanup();
        };
        signal2.addEventListener("abort", abort);
        cleanupSignal = () => {
          signal2.removeEventListener("abort", abort);
          cleanupSignal = void 0;
        };
        activePrompt.run().then(resolve, reject).finally(cleanup);
      }) : prompt2;
      let cleanupModuleSignal;
      const { signal: moduleSignal } = this.opt;
      if (moduleSignal?.aborted) {
        this.abortController.abort(moduleSignal.reason);
      } else if (moduleSignal) {
        const abort = () => this.abortController.abort(moduleSignal.reason);
        moduleSignal.addEventListener("abort", abort);
        cleanupModuleSignal = () => {
          moduleSignal.removeEventListener("abort", abort);
        };
      }
      const { filter: filter2 = (value) => value } = question;
      const { signal } = this.abortController;
      return promptFn(question, { ...this.opt, signal }).then((answer) => ({
        name: question.name,
        answer: filter2(answer, this.answers)
      })).finally(() => {
        cleanupSignal?.();
        cleanupModuleSignal?.();
      });
    });
    /**
     * Close the interface and cleanup listeners
     */
    __publicField(this, "close", () => {
      this.abortController.abort();
    });
    __publicField(this, "shouldRun", async (question) => {
      if (question.askAnswered !== true && _.get(this.answers, question.name) !== void 0) {
        return false;
      }
      const { when } = question;
      if (typeof when === "function") {
        const shouldRun = await runAsync(when)(this.answers);
        return Boolean(shouldRun);
      }
      return when !== false;
    });
    this.opt = opt;
    this.prompts = prompts;
  }
  async run(questions, answers) {
    this.abortController = new AbortController();
    this.answers = typeof answers === "object" ? { ...answers } : {};
    let obs;
    if (isQuestionArray(questions)) {
      obs = cjsExports.from(questions);
    } else if (cjsExports.isObservable(questions)) {
      obs = questions;
    } else if (isQuestionMap(questions)) {
      obs = cjsExports.from(Object.entries(questions).map(([name, question]) => {
        return Object.assign({}, question, { name });
      }));
    } else {
      obs = cjsExports.from([questions]);
    }
    this.process = obs.pipe(cjsExports.concatMap((question) => cjsExports.of(question).pipe(cjsExports.concatMap((question2) => cjsExports.from(this.shouldRun(question2).then((shouldRun) => {
      if (shouldRun) {
        return question2;
      }
      return;
    })).pipe(cjsExports.filter((val) => val != null))), cjsExports.concatMap((question2) => cjsExports.defer(() => cjsExports.from(this.fetchAnswer(question2)))))));
    return cjsExports.lastValueFrom(this.process.pipe(cjsExports.reduce((answersObj, answer) => {
      _.set(answersObj, answer.name, answer.answer);
      return answersObj;
    }, this.answers))).then(() => this.answers).finally(() => this.close());
  }
}
const builtInPrompts = {
  input,
  select,
  /** @deprecated `list` is now named `select` */
  list: select,
  number,
  confirm,
  rawlist,
  expand: expand$1,
  checkbox,
  password,
  editor,
  search
};
function createPromptModule(opt) {
  function promptModule(questions, answers) {
    const runner = new PromptsRunner(promptModule.prompts, opt);
    const promptPromise = runner.run(questions, answers);
    return Object.assign(promptPromise, { ui: runner });
  }
  promptModule.prompts = { ...builtInPrompts };
  promptModule.registerPrompt = function(name, prompt2) {
    promptModule.prompts[name] = prompt2;
    return this;
  };
  promptModule.restoreDefaultPrompts = function() {
    promptModule.prompts = { ...builtInPrompts };
  };
  return promptModule;
}
const prompt = createPromptModule();
function registerPrompt(name, newPrompt) {
  prompt.registerPrompt(name, newPrompt);
}
function restoreDefaultPrompts() {
  prompt.restoreDefaultPrompts();
}
const inquirer = {
  prompt,
  ui: {
    Prompt: PromptsRunner
  },
  createPromptModule,
  registerPrompt,
  restoreDefaultPrompts,
  Separator
};
var re = { exports: {} };
var constants;
var hasRequiredConstants;
function requireConstants() {
  if (hasRequiredConstants) return constants;
  hasRequiredConstants = 1;
  const SEMVER_SPEC_VERSION = "2.0.0";
  const MAX_LENGTH = 256;
  const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
  9007199254740991;
  const MAX_SAFE_COMPONENT_LENGTH = 16;
  const MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
  const RELEASE_TYPES = [
    "major",
    "premajor",
    "minor",
    "preminor",
    "patch",
    "prepatch",
    "prerelease"
  ];
  constants = {
    MAX_LENGTH,
    MAX_SAFE_COMPONENT_LENGTH,
    MAX_SAFE_BUILD_LENGTH,
    MAX_SAFE_INTEGER,
    RELEASE_TYPES,
    SEMVER_SPEC_VERSION,
    FLAG_INCLUDE_PRERELEASE: 1,
    FLAG_LOOSE: 2
  };
  return constants;
}
var debug_1;
var hasRequiredDebug;
function requireDebug() {
  if (hasRequiredDebug) return debug_1;
  hasRequiredDebug = 1;
  const debug = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args2) => console.error("SEMVER", ...args2) : () => {
  };
  debug_1 = debug;
  return debug_1;
}
var hasRequiredRe;
function requireRe() {
  if (hasRequiredRe) return re.exports;
  hasRequiredRe = 1;
  (function(module2, exports2) {
    const {
      MAX_SAFE_COMPONENT_LENGTH,
      MAX_SAFE_BUILD_LENGTH,
      MAX_LENGTH
    } = requireConstants();
    const debug = requireDebug();
    exports2 = module2.exports = {};
    const re2 = exports2.re = [];
    const safeRe = exports2.safeRe = [];
    const src = exports2.src = [];
    const safeSrc = exports2.safeSrc = [];
    const t = exports2.t = {};
    let R = 0;
    const LETTERDASHNUMBER = "[a-zA-Z0-9-]";
    const safeRegexReplacements = [
      ["\\s", 1],
      ["\\d", MAX_LENGTH],
      [LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]
    ];
    const makeSafeRegex = (value) => {
      for (const [token, max2] of safeRegexReplacements) {
        value = value.split(`${token}*`).join(`${token}{0,${max2}}`).split(`${token}+`).join(`${token}{1,${max2}}`);
      }
      return value;
    };
    const createToken = (name, value, isGlobal) => {
      const safe = makeSafeRegex(value);
      const index = R++;
      debug(name, index, value);
      t[name] = index;
      src[index] = value;
      safeSrc[index] = safe;
      re2[index] = new RegExp(value, isGlobal ? "g" : void 0);
      safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
    };
    createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
    createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
    createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
    createToken("MAINVERSION", `(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})`);
    createToken("MAINVERSIONLOOSE", `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})`);
    createToken("PRERELEASEIDENTIFIER", `(?:${src[t.NUMERICIDENTIFIER]}|${src[t.NONNUMERICIDENTIFIER]})`);
    createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t.NUMERICIDENTIFIERLOOSE]}|${src[t.NONNUMERICIDENTIFIER]})`);
    createToken("PRERELEASE", `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
    createToken("PRERELEASELOOSE", `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
    createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
    createToken("BUILD", `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
    createToken("FULLPLAIN", `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
    createToken("FULL", `^${src[t.FULLPLAIN]}$`);
    createToken("LOOSEPLAIN", `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
    createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`);
    createToken("GTLT", "((?:<|>)?=?)");
    createToken("XRANGEIDENTIFIERLOOSE", `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
    createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
    createToken("XRANGEPLAIN", `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?)?)?`);
    createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
    createToken("XRANGELOOSE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COERCEPLAIN", `${"(^|[^\\d])(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
    createToken("COERCE", `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
    createToken("COERCEFULL", src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?(?:${src[t.BUILD]})?(?:$|[^\\d])`);
    createToken("COERCERTL", src[t.COERCE], true);
    createToken("COERCERTLFULL", src[t.COERCEFULL], true);
    createToken("LONETILDE", "(?:~>?)");
    createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true);
    exports2.tildeTrimReplace = "$1~";
    createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
    createToken("TILDELOOSE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("LONECARET", "(?:\\^)");
    createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true);
    exports2.caretTrimReplace = "$1^";
    createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
    createToken("CARETLOOSE", `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
    createToken("COMPARATORLOOSE", `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
    createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
    createToken("COMPARATORTRIM", `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
    exports2.comparatorTrimReplace = "$1$2$3";
    createToken("HYPHENRANGE", `^\\s*(${src[t.XRANGEPLAIN]})\\s+-\\s+(${src[t.XRANGEPLAIN]})\\s*$`);
    createToken("HYPHENRANGELOOSE", `^\\s*(${src[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t.XRANGEPLAINLOOSE]})\\s*$`);
    createToken("STAR", "(<|>)?=?\\s*\\*");
    createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
    createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
  })(re, re.exports);
  return re.exports;
}
var parseOptions_1;
var hasRequiredParseOptions;
function requireParseOptions() {
  if (hasRequiredParseOptions) return parseOptions_1;
  hasRequiredParseOptions = 1;
  const looseOption = Object.freeze({ loose: true });
  const emptyOpts = Object.freeze({});
  const parseOptions = (options) => {
    if (!options) {
      return emptyOpts;
    }
    if (typeof options !== "object") {
      return looseOption;
    }
    return options;
  };
  parseOptions_1 = parseOptions;
  return parseOptions_1;
}
var identifiers;
var hasRequiredIdentifiers;
function requireIdentifiers() {
  if (hasRequiredIdentifiers) return identifiers;
  hasRequiredIdentifiers = 1;
  const numeric = /^[0-9]+$/;
  const compareIdentifiers = (a, b) => {
    const anum = numeric.test(a);
    const bnum = numeric.test(b);
    if (anum && bnum) {
      a = +a;
      b = +b;
    }
    return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
  };
  const rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);
  identifiers = {
    compareIdentifiers,
    rcompareIdentifiers
  };
  return identifiers;
}
var semver$2;
var hasRequiredSemver$1;
function requireSemver$1() {
  if (hasRequiredSemver$1) return semver$2;
  hasRequiredSemver$1 = 1;
  const debug = requireDebug();
  const { MAX_LENGTH, MAX_SAFE_INTEGER } = requireConstants();
  const { safeRe: re2, safeSrc: src, t } = requireRe();
  const parseOptions = requireParseOptions();
  const { compareIdentifiers } = requireIdentifiers();
  class SemVer {
    constructor(version2, options) {
      options = parseOptions(options);
      if (version2 instanceof SemVer) {
        if (version2.loose === !!options.loose && version2.includePrerelease === !!options.includePrerelease) {
          return version2;
        } else {
          version2 = version2.version;
        }
      } else if (typeof version2 !== "string") {
        throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version2}".`);
      }
      if (version2.length > MAX_LENGTH) {
        throw new TypeError(
          `version is longer than ${MAX_LENGTH} characters`
        );
      }
      debug("SemVer", version2, options);
      this.options = options;
      this.loose = !!options.loose;
      this.includePrerelease = !!options.includePrerelease;
      const m = version2.trim().match(options.loose ? re2[t.LOOSE] : re2[t.FULL]);
      if (!m) {
        throw new TypeError(`Invalid Version: ${version2}`);
      }
      this.raw = version2;
      this.major = +m[1];
      this.minor = +m[2];
      this.patch = +m[3];
      if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
        throw new TypeError("Invalid major version");
      }
      if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
        throw new TypeError("Invalid minor version");
      }
      if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
        throw new TypeError("Invalid patch version");
      }
      if (!m[4]) {
        this.prerelease = [];
      } else {
        this.prerelease = m[4].split(".").map((id) => {
          if (/^[0-9]+$/.test(id)) {
            const num = +id;
            if (num >= 0 && num < MAX_SAFE_INTEGER) {
              return num;
            }
          }
          return id;
        });
      }
      this.build = m[5] ? m[5].split(".") : [];
      this.format();
    }
    format() {
      this.version = `${this.major}.${this.minor}.${this.patch}`;
      if (this.prerelease.length) {
        this.version += `-${this.prerelease.join(".")}`;
      }
      return this.version;
    }
    toString() {
      return this.version;
    }
    compare(other) {
      debug("SemVer.compare", this.version, this.options, other);
      if (!(other instanceof SemVer)) {
        if (typeof other === "string" && other === this.version) {
          return 0;
        }
        other = new SemVer(other, this.options);
      }
      if (other.version === this.version) {
        return 0;
      }
      return this.compareMain(other) || this.comparePre(other);
    }
    compareMain(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }
      return compareIdentifiers(this.major, other.major) || compareIdentifiers(this.minor, other.minor) || compareIdentifiers(this.patch, other.patch);
    }
    comparePre(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }
      if (this.prerelease.length && !other.prerelease.length) {
        return -1;
      } else if (!this.prerelease.length && other.prerelease.length) {
        return 1;
      } else if (!this.prerelease.length && !other.prerelease.length) {
        return 0;
      }
      let i = 0;
      do {
        const a = this.prerelease[i];
        const b = other.prerelease[i];
        debug("prerelease compare", i, a, b);
        if (a === void 0 && b === void 0) {
          return 0;
        } else if (b === void 0) {
          return 1;
        } else if (a === void 0) {
          return -1;
        } else if (a === b) {
          continue;
        } else {
          return compareIdentifiers(a, b);
        }
      } while (++i);
    }
    compareBuild(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options);
      }
      let i = 0;
      do {
        const a = this.build[i];
        const b = other.build[i];
        debug("build compare", i, a, b);
        if (a === void 0 && b === void 0) {
          return 0;
        } else if (b === void 0) {
          return 1;
        } else if (a === void 0) {
          return -1;
        } else if (a === b) {
          continue;
        } else {
          return compareIdentifiers(a, b);
        }
      } while (++i);
    }
    // preminor will bump the version up to the next minor release, and immediately
    // down to pre-release. premajor and prepatch work the same way.
    inc(release, identifier, identifierBase) {
      if (release.startsWith("pre")) {
        if (!identifier && identifierBase === false) {
          throw new Error("invalid increment argument: identifier is empty");
        }
        if (identifier) {
          const r = new RegExp(`^${this.options.loose ? src[t.PRERELEASELOOSE] : src[t.PRERELEASE]}$`);
          const match2 = `-${identifier}`.match(r);
          if (!match2 || match2[1] !== identifier) {
            throw new Error(`invalid identifier: ${identifier}`);
          }
        }
      }
      switch (release) {
        case "premajor":
          this.prerelease.length = 0;
          this.patch = 0;
          this.minor = 0;
          this.major++;
          this.inc("pre", identifier, identifierBase);
          break;
        case "preminor":
          this.prerelease.length = 0;
          this.patch = 0;
          this.minor++;
          this.inc("pre", identifier, identifierBase);
          break;
        case "prepatch":
          this.prerelease.length = 0;
          this.inc("patch", identifier, identifierBase);
          this.inc("pre", identifier, identifierBase);
          break;
        // If the input is a non-prerelease version, this acts the same as
        // prepatch.
        case "prerelease":
          if (this.prerelease.length === 0) {
            this.inc("patch", identifier, identifierBase);
          }
          this.inc("pre", identifier, identifierBase);
          break;
        case "release":
          if (this.prerelease.length === 0) {
            throw new Error(`version ${this.raw} is not a prerelease`);
          }
          this.prerelease.length = 0;
          break;
        case "major":
          if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
            this.major++;
          }
          this.minor = 0;
          this.patch = 0;
          this.prerelease = [];
          break;
        case "minor":
          if (this.patch !== 0 || this.prerelease.length === 0) {
            this.minor++;
          }
          this.patch = 0;
          this.prerelease = [];
          break;
        case "patch":
          if (this.prerelease.length === 0) {
            this.patch++;
          }
          this.prerelease = [];
          break;
        // This probably shouldn't be used publicly.
        // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
        case "pre": {
          const base = Number(identifierBase) ? 1 : 0;
          if (this.prerelease.length === 0) {
            this.prerelease = [base];
          } else {
            let i = this.prerelease.length;
            while (--i >= 0) {
              if (typeof this.prerelease[i] === "number") {
                this.prerelease[i]++;
                i = -2;
              }
            }
            if (i === -1) {
              if (identifier === this.prerelease.join(".") && identifierBase === false) {
                throw new Error("invalid increment argument: identifier already exists");
              }
              this.prerelease.push(base);
            }
          }
          if (identifier) {
            let prerelease = [identifier, base];
            if (identifierBase === false) {
              prerelease = [identifier];
            }
            if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
              if (isNaN(this.prerelease[1])) {
                this.prerelease = prerelease;
              }
            } else {
              this.prerelease = prerelease;
            }
          }
          break;
        }
        default:
          throw new Error(`invalid increment argument: ${release}`);
      }
      this.raw = this.format();
      if (this.build.length) {
        this.raw += `+${this.build.join(".")}`;
      }
      return this;
    }
  }
  semver$2 = SemVer;
  return semver$2;
}
var parse_1;
var hasRequiredParse;
function requireParse() {
  if (hasRequiredParse) return parse_1;
  hasRequiredParse = 1;
  const SemVer = requireSemver$1();
  const parse = (version2, options, throwErrors = false) => {
    if (version2 instanceof SemVer) {
      return version2;
    }
    try {
      return new SemVer(version2, options);
    } catch (er) {
      if (!throwErrors) {
        return null;
      }
      throw er;
    }
  };
  parse_1 = parse;
  return parse_1;
}
var valid_1;
var hasRequiredValid$1;
function requireValid$1() {
  if (hasRequiredValid$1) return valid_1;
  hasRequiredValid$1 = 1;
  const parse = requireParse();
  const valid2 = (version2, options) => {
    const v = parse(version2, options);
    return v ? v.version : null;
  };
  valid_1 = valid2;
  return valid_1;
}
var clean_1;
var hasRequiredClean;
function requireClean() {
  if (hasRequiredClean) return clean_1;
  hasRequiredClean = 1;
  const parse = requireParse();
  const clean = (version2, options) => {
    const s = parse(version2.trim().replace(/^[=v]+/, ""), options);
    return s ? s.version : null;
  };
  clean_1 = clean;
  return clean_1;
}
var inc_1;
var hasRequiredInc;
function requireInc() {
  if (hasRequiredInc) return inc_1;
  hasRequiredInc = 1;
  const SemVer = requireSemver$1();
  const inc = (version2, release, options, identifier, identifierBase) => {
    if (typeof options === "string") {
      identifierBase = identifier;
      identifier = options;
      options = void 0;
    }
    try {
      return new SemVer(
        version2 instanceof SemVer ? version2.version : version2,
        options
      ).inc(release, identifier, identifierBase).version;
    } catch (er) {
      return null;
    }
  };
  inc_1 = inc;
  return inc_1;
}
var diff_1;
var hasRequiredDiff;
function requireDiff() {
  if (hasRequiredDiff) return diff_1;
  hasRequiredDiff = 1;
  const parse = requireParse();
  const diff = (version1, version2) => {
    const v1 = parse(version1, null, true);
    const v2 = parse(version2, null, true);
    const comparison = v1.compare(v2);
    if (comparison === 0) {
      return null;
    }
    const v1Higher = comparison > 0;
    const highVersion = v1Higher ? v1 : v2;
    const lowVersion = v1Higher ? v2 : v1;
    const highHasPre = !!highVersion.prerelease.length;
    const lowHasPre = !!lowVersion.prerelease.length;
    if (lowHasPre && !highHasPre) {
      if (!lowVersion.patch && !lowVersion.minor) {
        return "major";
      }
      if (lowVersion.compareMain(highVersion) === 0) {
        if (lowVersion.minor && !lowVersion.patch) {
          return "minor";
        }
        return "patch";
      }
    }
    const prefix = highHasPre ? "pre" : "";
    if (v1.major !== v2.major) {
      return prefix + "major";
    }
    if (v1.minor !== v2.minor) {
      return prefix + "minor";
    }
    if (v1.patch !== v2.patch) {
      return prefix + "patch";
    }
    return "prerelease";
  };
  diff_1 = diff;
  return diff_1;
}
var major_1;
var hasRequiredMajor;
function requireMajor() {
  if (hasRequiredMajor) return major_1;
  hasRequiredMajor = 1;
  const SemVer = requireSemver$1();
  const major = (a, loose) => new SemVer(a, loose).major;
  major_1 = major;
  return major_1;
}
var minor_1;
var hasRequiredMinor;
function requireMinor() {
  if (hasRequiredMinor) return minor_1;
  hasRequiredMinor = 1;
  const SemVer = requireSemver$1();
  const minor = (a, loose) => new SemVer(a, loose).minor;
  minor_1 = minor;
  return minor_1;
}
var patch_1;
var hasRequiredPatch;
function requirePatch() {
  if (hasRequiredPatch) return patch_1;
  hasRequiredPatch = 1;
  const SemVer = requireSemver$1();
  const patch = (a, loose) => new SemVer(a, loose).patch;
  patch_1 = patch;
  return patch_1;
}
var prerelease_1;
var hasRequiredPrerelease;
function requirePrerelease() {
  if (hasRequiredPrerelease) return prerelease_1;
  hasRequiredPrerelease = 1;
  const parse = requireParse();
  const prerelease = (version2, options) => {
    const parsed = parse(version2, options);
    return parsed && parsed.prerelease.length ? parsed.prerelease : null;
  };
  prerelease_1 = prerelease;
  return prerelease_1;
}
var compare_1;
var hasRequiredCompare;
function requireCompare() {
  if (hasRequiredCompare) return compare_1;
  hasRequiredCompare = 1;
  const SemVer = requireSemver$1();
  const compare = (a, b, loose) => new SemVer(a, loose).compare(new SemVer(b, loose));
  compare_1 = compare;
  return compare_1;
}
var rcompare_1;
var hasRequiredRcompare;
function requireRcompare() {
  if (hasRequiredRcompare) return rcompare_1;
  hasRequiredRcompare = 1;
  const compare = requireCompare();
  const rcompare = (a, b, loose) => compare(b, a, loose);
  rcompare_1 = rcompare;
  return rcompare_1;
}
var compareLoose_1;
var hasRequiredCompareLoose;
function requireCompareLoose() {
  if (hasRequiredCompareLoose) return compareLoose_1;
  hasRequiredCompareLoose = 1;
  const compare = requireCompare();
  const compareLoose = (a, b) => compare(a, b, true);
  compareLoose_1 = compareLoose;
  return compareLoose_1;
}
var compareBuild_1;
var hasRequiredCompareBuild;
function requireCompareBuild() {
  if (hasRequiredCompareBuild) return compareBuild_1;
  hasRequiredCompareBuild = 1;
  const SemVer = requireSemver$1();
  const compareBuild = (a, b, loose) => {
    const versionA = new SemVer(a, loose);
    const versionB = new SemVer(b, loose);
    return versionA.compare(versionB) || versionA.compareBuild(versionB);
  };
  compareBuild_1 = compareBuild;
  return compareBuild_1;
}
var sort_1;
var hasRequiredSort;
function requireSort() {
  if (hasRequiredSort) return sort_1;
  hasRequiredSort = 1;
  const compareBuild = requireCompareBuild();
  const sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose));
  sort_1 = sort;
  return sort_1;
}
var rsort_1;
var hasRequiredRsort;
function requireRsort() {
  if (hasRequiredRsort) return rsort_1;
  hasRequiredRsort = 1;
  const compareBuild = requireCompareBuild();
  const rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose));
  rsort_1 = rsort;
  return rsort_1;
}
var gt_1;
var hasRequiredGt;
function requireGt() {
  if (hasRequiredGt) return gt_1;
  hasRequiredGt = 1;
  const compare = requireCompare();
  const gt = (a, b, loose) => compare(a, b, loose) > 0;
  gt_1 = gt;
  return gt_1;
}
var lt_1;
var hasRequiredLt;
function requireLt() {
  if (hasRequiredLt) return lt_1;
  hasRequiredLt = 1;
  const compare = requireCompare();
  const lt = (a, b, loose) => compare(a, b, loose) < 0;
  lt_1 = lt;
  return lt_1;
}
var eq_1;
var hasRequiredEq;
function requireEq() {
  if (hasRequiredEq) return eq_1;
  hasRequiredEq = 1;
  const compare = requireCompare();
  const eq = (a, b, loose) => compare(a, b, loose) === 0;
  eq_1 = eq;
  return eq_1;
}
var neq_1;
var hasRequiredNeq;
function requireNeq() {
  if (hasRequiredNeq) return neq_1;
  hasRequiredNeq = 1;
  const compare = requireCompare();
  const neq = (a, b, loose) => compare(a, b, loose) !== 0;
  neq_1 = neq;
  return neq_1;
}
var gte_1;
var hasRequiredGte;
function requireGte() {
  if (hasRequiredGte) return gte_1;
  hasRequiredGte = 1;
  const compare = requireCompare();
  const gte = (a, b, loose) => compare(a, b, loose) >= 0;
  gte_1 = gte;
  return gte_1;
}
var lte_1;
var hasRequiredLte;
function requireLte() {
  if (hasRequiredLte) return lte_1;
  hasRequiredLte = 1;
  const compare = requireCompare();
  const lte = (a, b, loose) => compare(a, b, loose) <= 0;
  lte_1 = lte;
  return lte_1;
}
var cmp_1;
var hasRequiredCmp;
function requireCmp() {
  if (hasRequiredCmp) return cmp_1;
  hasRequiredCmp = 1;
  const eq = requireEq();
  const neq = requireNeq();
  const gt = requireGt();
  const gte = requireGte();
  const lt = requireLt();
  const lte = requireLte();
  const cmp = (a, op, b, loose) => {
    switch (op) {
      case "===":
        if (typeof a === "object") {
          a = a.version;
        }
        if (typeof b === "object") {
          b = b.version;
        }
        return a === b;
      case "!==":
        if (typeof a === "object") {
          a = a.version;
        }
        if (typeof b === "object") {
          b = b.version;
        }
        return a !== b;
      case "":
      case "=":
      case "==":
        return eq(a, b, loose);
      case "!=":
        return neq(a, b, loose);
      case ">":
        return gt(a, b, loose);
      case ">=":
        return gte(a, b, loose);
      case "<":
        return lt(a, b, loose);
      case "<=":
        return lte(a, b, loose);
      default:
        throw new TypeError(`Invalid operator: ${op}`);
    }
  };
  cmp_1 = cmp;
  return cmp_1;
}
var coerce_1;
var hasRequiredCoerce;
function requireCoerce() {
  if (hasRequiredCoerce) return coerce_1;
  hasRequiredCoerce = 1;
  const SemVer = requireSemver$1();
  const parse = requireParse();
  const { safeRe: re2, t } = requireRe();
  const coerce = (version2, options) => {
    if (version2 instanceof SemVer) {
      return version2;
    }
    if (typeof version2 === "number") {
      version2 = String(version2);
    }
    if (typeof version2 !== "string") {
      return null;
    }
    options = options || {};
    let match2 = null;
    if (!options.rtl) {
      match2 = version2.match(options.includePrerelease ? re2[t.COERCEFULL] : re2[t.COERCE]);
    } else {
      const coerceRtlRegex = options.includePrerelease ? re2[t.COERCERTLFULL] : re2[t.COERCERTL];
      let next;
      while ((next = coerceRtlRegex.exec(version2)) && (!match2 || match2.index + match2[0].length !== version2.length)) {
        if (!match2 || next.index + next[0].length !== match2.index + match2[0].length) {
          match2 = next;
        }
        coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
      }
      coerceRtlRegex.lastIndex = -1;
    }
    if (match2 === null) {
      return null;
    }
    const major = match2[2];
    const minor = match2[3] || "0";
    const patch = match2[4] || "0";
    const prerelease = options.includePrerelease && match2[5] ? `-${match2[5]}` : "";
    const build = options.includePrerelease && match2[6] ? `+${match2[6]}` : "";
    return parse(`${major}.${minor}.${patch}${prerelease}${build}`, options);
  };
  coerce_1 = coerce;
  return coerce_1;
}
var lrucache;
var hasRequiredLrucache;
function requireLrucache() {
  if (hasRequiredLrucache) return lrucache;
  hasRequiredLrucache = 1;
  class LRUCache {
    constructor() {
      this.max = 1e3;
      this.map = /* @__PURE__ */ new Map();
    }
    get(key) {
      const value = this.map.get(key);
      if (value === void 0) {
        return void 0;
      } else {
        this.map.delete(key);
        this.map.set(key, value);
        return value;
      }
    }
    delete(key) {
      return this.map.delete(key);
    }
    set(key, value) {
      const deleted = this.delete(key);
      if (!deleted && value !== void 0) {
        if (this.map.size >= this.max) {
          const firstKey = this.map.keys().next().value;
          this.delete(firstKey);
        }
        this.map.set(key, value);
      }
      return this;
    }
  }
  lrucache = LRUCache;
  return lrucache;
}
var range;
var hasRequiredRange;
function requireRange() {
  if (hasRequiredRange) return range;
  hasRequiredRange = 1;
  const SPACE_CHARACTERS = /\s+/g;
  class Range {
    constructor(range2, options) {
      options = parseOptions(options);
      if (range2 instanceof Range) {
        if (range2.loose === !!options.loose && range2.includePrerelease === !!options.includePrerelease) {
          return range2;
        } else {
          return new Range(range2.raw, options);
        }
      }
      if (range2 instanceof Comparator) {
        this.raw = range2.value;
        this.set = [[range2]];
        this.formatted = void 0;
        return this;
      }
      this.options = options;
      this.loose = !!options.loose;
      this.includePrerelease = !!options.includePrerelease;
      this.raw = range2.trim().replace(SPACE_CHARACTERS, " ");
      this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
      if (!this.set.length) {
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      }
      if (this.set.length > 1) {
        const first2 = this.set[0];
        this.set = this.set.filter((c) => !isNullSet(c[0]));
        if (this.set.length === 0) {
          this.set = [first2];
        } else if (this.set.length > 1) {
          for (const c of this.set) {
            if (c.length === 1 && isAny(c[0])) {
              this.set = [c];
              break;
            }
          }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let i = 0; i < this.set.length; i++) {
          if (i > 0) {
            this.formatted += "||";
          }
          const comps = this.set[i];
          for (let k = 0; k < comps.length; k++) {
            if (k > 0) {
              this.formatted += " ";
            }
            this.formatted += comps[k].toString().trim();
          }
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(range2) {
      const memoOpts = (this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE);
      const memoKey = memoOpts + ":" + range2;
      const cached = cache.get(memoKey);
      if (cached) {
        return cached;
      }
      const loose = this.options.loose;
      const hr = loose ? re2[t.HYPHENRANGELOOSE] : re2[t.HYPHENRANGE];
      range2 = range2.replace(hr, hyphenReplace(this.options.includePrerelease));
      debug("hyphen replace", range2);
      range2 = range2.replace(re2[t.COMPARATORTRIM], comparatorTrimReplace);
      debug("comparator trim", range2);
      range2 = range2.replace(re2[t.TILDETRIM], tildeTrimReplace);
      debug("tilde trim", range2);
      range2 = range2.replace(re2[t.CARETTRIM], caretTrimReplace);
      debug("caret trim", range2);
      let rangeList = range2.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
      if (loose) {
        rangeList = rangeList.filter((comp) => {
          debug("loose invalid filter", comp, this.options);
          return !!comp.match(re2[t.COMPARATORLOOSE]);
        });
      }
      debug("range list", rangeList);
      const rangeMap = /* @__PURE__ */ new Map();
      const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
      for (const comp of comparators) {
        if (isNullSet(comp)) {
          return [comp];
        }
        rangeMap.set(comp.value, comp);
      }
      if (rangeMap.size > 1 && rangeMap.has("")) {
        rangeMap.delete("");
      }
      const result = [...rangeMap.values()];
      cache.set(memoKey, result);
      return result;
    }
    intersects(range2, options) {
      if (!(range2 instanceof Range)) {
        throw new TypeError("a Range is required");
      }
      return this.set.some((thisComparators) => {
        return isSatisfiable(thisComparators, options) && range2.set.some((rangeComparators) => {
          return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
            return rangeComparators.every((rangeComparator) => {
              return thisComparator.intersects(rangeComparator, options);
            });
          });
        });
      });
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(version2) {
      if (!version2) {
        return false;
      }
      if (typeof version2 === "string") {
        try {
          version2 = new SemVer(version2, this.options);
        } catch (er) {
          return false;
        }
      }
      for (let i = 0; i < this.set.length; i++) {
        if (testSet(this.set[i], version2, this.options)) {
          return true;
        }
      }
      return false;
    }
  }
  range = Range;
  const LRU = requireLrucache();
  const cache = new LRU();
  const parseOptions = requireParseOptions();
  const Comparator = requireComparator();
  const debug = requireDebug();
  const SemVer = requireSemver$1();
  const {
    safeRe: re2,
    t,
    comparatorTrimReplace,
    tildeTrimReplace,
    caretTrimReplace
  } = requireRe();
  const { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = requireConstants();
  const isNullSet = (c) => c.value === "<0.0.0-0";
  const isAny = (c) => c.value === "";
  const isSatisfiable = (comparators, options) => {
    let result = true;
    const remainingComparators = comparators.slice();
    let testComparator = remainingComparators.pop();
    while (result && remainingComparators.length) {
      result = remainingComparators.every((otherComparator) => {
        return testComparator.intersects(otherComparator, options);
      });
      testComparator = remainingComparators.pop();
    }
    return result;
  };
  const parseComparator = (comp, options) => {
    debug("comp", comp, options);
    comp = replaceCarets(comp, options);
    debug("caret", comp);
    comp = replaceTildes(comp, options);
    debug("tildes", comp);
    comp = replaceXRanges(comp, options);
    debug("xrange", comp);
    comp = replaceStars(comp, options);
    debug("stars", comp);
    return comp;
  };
  const isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
  const replaceTildes = (comp, options) => {
    return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
  };
  const replaceTilde = (comp, options) => {
    const r = options.loose ? re2[t.TILDELOOSE] : re2[t.TILDE];
    return comp.replace(r, (_2, M, m, p, pr) => {
      debug("tilde", comp, _2, M, m, p, pr);
      let ret;
      if (isX(M)) {
        ret = "";
      } else if (isX(m)) {
        ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
      } else if (isX(p)) {
        ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
      } else if (pr) {
        debug("replaceTilde pr", pr);
        ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
      } else {
        ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
      }
      debug("tilde return", ret);
      return ret;
    });
  };
  const replaceCarets = (comp, options) => {
    return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
  };
  const replaceCaret = (comp, options) => {
    debug("caret", comp, options);
    const r = options.loose ? re2[t.CARETLOOSE] : re2[t.CARET];
    const z = options.includePrerelease ? "-0" : "";
    return comp.replace(r, (_2, M, m, p, pr) => {
      debug("caret", comp, _2, M, m, p, pr);
      let ret;
      if (isX(M)) {
        ret = "";
      } else if (isX(m)) {
        ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
      } else if (isX(p)) {
        if (M === "0") {
          ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
        } else {
          ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
        }
      } else if (pr) {
        debug("replaceCaret pr", pr);
        if (M === "0") {
          if (m === "0") {
            ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
          } else {
            ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
          }
        } else {
          ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
        }
      } else {
        debug("no pr");
        if (M === "0") {
          if (m === "0") {
            ret = `>=${M}.${m}.${p}${z} <${M}.${m}.${+p + 1}-0`;
          } else {
            ret = `>=${M}.${m}.${p}${z} <${M}.${+m + 1}.0-0`;
          }
        } else {
          ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
        }
      }
      debug("caret return", ret);
      return ret;
    });
  };
  const replaceXRanges = (comp, options) => {
    debug("replaceXRanges", comp, options);
    return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
  };
  const replaceXRange = (comp, options) => {
    comp = comp.trim();
    const r = options.loose ? re2[t.XRANGELOOSE] : re2[t.XRANGE];
    return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
      debug("xRange", comp, ret, gtlt, M, m, p, pr);
      const xM = isX(M);
      const xm = xM || isX(m);
      const xp = xm || isX(p);
      const anyX = xp;
      if (gtlt === "=" && anyX) {
        gtlt = "";
      }
      pr = options.includePrerelease ? "-0" : "";
      if (xM) {
        if (gtlt === ">" || gtlt === "<") {
          ret = "<0.0.0-0";
        } else {
          ret = "*";
        }
      } else if (gtlt && anyX) {
        if (xm) {
          m = 0;
        }
        p = 0;
        if (gtlt === ">") {
          gtlt = ">=";
          if (xm) {
            M = +M + 1;
            m = 0;
            p = 0;
          } else {
            m = +m + 1;
            p = 0;
          }
        } else if (gtlt === "<=") {
          gtlt = "<";
          if (xm) {
            M = +M + 1;
          } else {
            m = +m + 1;
          }
        }
        if (gtlt === "<") {
          pr = "-0";
        }
        ret = `${gtlt + M}.${m}.${p}${pr}`;
      } else if (xm) {
        ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
      } else if (xp) {
        ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
      }
      debug("xRange return", ret);
      return ret;
    });
  };
  const replaceStars = (comp, options) => {
    debug("replaceStars", comp, options);
    return comp.trim().replace(re2[t.STAR], "");
  };
  const replaceGTE0 = (comp, options) => {
    debug("replaceGTE0", comp, options);
    return comp.trim().replace(re2[options.includePrerelease ? t.GTE0PRE : t.GTE0], "");
  };
  const hyphenReplace = (incPr) => ($0, from2, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
    if (isX(fM)) {
      from2 = "";
    } else if (isX(fm)) {
      from2 = `>=${fM}.0.0${incPr ? "-0" : ""}`;
    } else if (isX(fp)) {
      from2 = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
    } else if (fpr) {
      from2 = `>=${from2}`;
    } else {
      from2 = `>=${from2}${incPr ? "-0" : ""}`;
    }
    if (isX(tM)) {
      to = "";
    } else if (isX(tm)) {
      to = `<${+tM + 1}.0.0-0`;
    } else if (isX(tp)) {
      to = `<${tM}.${+tm + 1}.0-0`;
    } else if (tpr) {
      to = `<=${tM}.${tm}.${tp}-${tpr}`;
    } else if (incPr) {
      to = `<${tM}.${tm}.${+tp + 1}-0`;
    } else {
      to = `<=${to}`;
    }
    return `${from2} ${to}`.trim();
  };
  const testSet = (set, version2, options) => {
    for (let i = 0; i < set.length; i++) {
      if (!set[i].test(version2)) {
        return false;
      }
    }
    if (version2.prerelease.length && !options.includePrerelease) {
      for (let i = 0; i < set.length; i++) {
        debug(set[i].semver);
        if (set[i].semver === Comparator.ANY) {
          continue;
        }
        if (set[i].semver.prerelease.length > 0) {
          const allowed = set[i].semver;
          if (allowed.major === version2.major && allowed.minor === version2.minor && allowed.patch === version2.patch) {
            return true;
          }
        }
      }
      return false;
    }
    return true;
  };
  return range;
}
var comparator;
var hasRequiredComparator;
function requireComparator() {
  if (hasRequiredComparator) return comparator;
  hasRequiredComparator = 1;
  const ANY = Symbol("SemVer ANY");
  class Comparator {
    static get ANY() {
      return ANY;
    }
    constructor(comp, options) {
      options = parseOptions(options);
      if (comp instanceof Comparator) {
        if (comp.loose === !!options.loose) {
          return comp;
        } else {
          comp = comp.value;
        }
      }
      comp = comp.trim().split(/\s+/).join(" ");
      debug("comparator", comp, options);
      this.options = options;
      this.loose = !!options.loose;
      this.parse(comp);
      if (this.semver === ANY) {
        this.value = "";
      } else {
        this.value = this.operator + this.semver.version;
      }
      debug("comp", this);
    }
    parse(comp) {
      const r = this.options.loose ? re2[t.COMPARATORLOOSE] : re2[t.COMPARATOR];
      const m = comp.match(r);
      if (!m) {
        throw new TypeError(`Invalid comparator: ${comp}`);
      }
      this.operator = m[1] !== void 0 ? m[1] : "";
      if (this.operator === "=") {
        this.operator = "";
      }
      if (!m[2]) {
        this.semver = ANY;
      } else {
        this.semver = new SemVer(m[2], this.options.loose);
      }
    }
    toString() {
      return this.value;
    }
    test(version2) {
      debug("Comparator.test", version2, this.options.loose);
      if (this.semver === ANY || version2 === ANY) {
        return true;
      }
      if (typeof version2 === "string") {
        try {
          version2 = new SemVer(version2, this.options);
        } catch (er) {
          return false;
        }
      }
      return cmp(version2, this.operator, this.semver, this.options);
    }
    intersects(comp, options) {
      if (!(comp instanceof Comparator)) {
        throw new TypeError("a Comparator is required");
      }
      if (this.operator === "") {
        if (this.value === "") {
          return true;
        }
        return new Range(comp.value, options).test(this.value);
      } else if (comp.operator === "") {
        if (comp.value === "") {
          return true;
        }
        return new Range(this.value, options).test(comp.semver);
      }
      options = parseOptions(options);
      if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) {
        return false;
      }
      if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) {
        return false;
      }
      if (this.operator.startsWith(">") && comp.operator.startsWith(">")) {
        return true;
      }
      if (this.operator.startsWith("<") && comp.operator.startsWith("<")) {
        return true;
      }
      if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) {
        return true;
      }
      if (cmp(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) {
        return true;
      }
      if (cmp(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) {
        return true;
      }
      return false;
    }
  }
  comparator = Comparator;
  const parseOptions = requireParseOptions();
  const { safeRe: re2, t } = requireRe();
  const cmp = requireCmp();
  const debug = requireDebug();
  const SemVer = requireSemver$1();
  const Range = requireRange();
  return comparator;
}
var satisfies_1;
var hasRequiredSatisfies;
function requireSatisfies() {
  if (hasRequiredSatisfies) return satisfies_1;
  hasRequiredSatisfies = 1;
  const Range = requireRange();
  const satisfies = (version2, range2, options) => {
    try {
      range2 = new Range(range2, options);
    } catch (er) {
      return false;
    }
    return range2.test(version2);
  };
  satisfies_1 = satisfies;
  return satisfies_1;
}
var toComparators_1;
var hasRequiredToComparators;
function requireToComparators() {
  if (hasRequiredToComparators) return toComparators_1;
  hasRequiredToComparators = 1;
  const Range = requireRange();
  const toComparators = (range2, options) => new Range(range2, options).set.map((comp) => comp.map((c) => c.value).join(" ").trim().split(" "));
  toComparators_1 = toComparators;
  return toComparators_1;
}
var maxSatisfying_1;
var hasRequiredMaxSatisfying;
function requireMaxSatisfying() {
  if (hasRequiredMaxSatisfying) return maxSatisfying_1;
  hasRequiredMaxSatisfying = 1;
  const SemVer = requireSemver$1();
  const Range = requireRange();
  const maxSatisfying = (versions, range2, options) => {
    let max2 = null;
    let maxSV = null;
    let rangeObj = null;
    try {
      rangeObj = new Range(range2, options);
    } catch (er) {
      return null;
    }
    versions.forEach((v) => {
      if (rangeObj.test(v)) {
        if (!max2 || maxSV.compare(v) === -1) {
          max2 = v;
          maxSV = new SemVer(max2, options);
        }
      }
    });
    return max2;
  };
  maxSatisfying_1 = maxSatisfying;
  return maxSatisfying_1;
}
var minSatisfying_1;
var hasRequiredMinSatisfying;
function requireMinSatisfying() {
  if (hasRequiredMinSatisfying) return minSatisfying_1;
  hasRequiredMinSatisfying = 1;
  const SemVer = requireSemver$1();
  const Range = requireRange();
  const minSatisfying = (versions, range2, options) => {
    let min2 = null;
    let minSV = null;
    let rangeObj = null;
    try {
      rangeObj = new Range(range2, options);
    } catch (er) {
      return null;
    }
    versions.forEach((v) => {
      if (rangeObj.test(v)) {
        if (!min2 || minSV.compare(v) === 1) {
          min2 = v;
          minSV = new SemVer(min2, options);
        }
      }
    });
    return min2;
  };
  minSatisfying_1 = minSatisfying;
  return minSatisfying_1;
}
var minVersion_1;
var hasRequiredMinVersion;
function requireMinVersion() {
  if (hasRequiredMinVersion) return minVersion_1;
  hasRequiredMinVersion = 1;
  const SemVer = requireSemver$1();
  const Range = requireRange();
  const gt = requireGt();
  const minVersion = (range2, loose) => {
    range2 = new Range(range2, loose);
    let minver = new SemVer("0.0.0");
    if (range2.test(minver)) {
      return minver;
    }
    minver = new SemVer("0.0.0-0");
    if (range2.test(minver)) {
      return minver;
    }
    minver = null;
    for (let i = 0; i < range2.set.length; ++i) {
      const comparators = range2.set[i];
      let setMin = null;
      comparators.forEach((comparator2) => {
        const compver = new SemVer(comparator2.semver.version);
        switch (comparator2.operator) {
          case ">":
            if (compver.prerelease.length === 0) {
              compver.patch++;
            } else {
              compver.prerelease.push(0);
            }
            compver.raw = compver.format();
          /* fallthrough */
          case "":
          case ">=":
            if (!setMin || gt(compver, setMin)) {
              setMin = compver;
            }
            break;
          case "<":
          case "<=":
            break;
          /* istanbul ignore next */
          default:
            throw new Error(`Unexpected operation: ${comparator2.operator}`);
        }
      });
      if (setMin && (!minver || gt(minver, setMin))) {
        minver = setMin;
      }
    }
    if (minver && range2.test(minver)) {
      return minver;
    }
    return null;
  };
  minVersion_1 = minVersion;
  return minVersion_1;
}
var valid;
var hasRequiredValid;
function requireValid() {
  if (hasRequiredValid) return valid;
  hasRequiredValid = 1;
  const Range = requireRange();
  const validRange = (range2, options) => {
    try {
      return new Range(range2, options).range || "*";
    } catch (er) {
      return null;
    }
  };
  valid = validRange;
  return valid;
}
var outside_1;
var hasRequiredOutside;
function requireOutside() {
  if (hasRequiredOutside) return outside_1;
  hasRequiredOutside = 1;
  const SemVer = requireSemver$1();
  const Comparator = requireComparator();
  const { ANY } = Comparator;
  const Range = requireRange();
  const satisfies = requireSatisfies();
  const gt = requireGt();
  const lt = requireLt();
  const lte = requireLte();
  const gte = requireGte();
  const outside = (version2, range2, hilo, options) => {
    version2 = new SemVer(version2, options);
    range2 = new Range(range2, options);
    let gtfn, ltefn, ltfn, comp, ecomp;
    switch (hilo) {
      case ">":
        gtfn = gt;
        ltefn = lte;
        ltfn = lt;
        comp = ">";
        ecomp = ">=";
        break;
      case "<":
        gtfn = lt;
        ltefn = gte;
        ltfn = gt;
        comp = "<";
        ecomp = "<=";
        break;
      default:
        throw new TypeError('Must provide a hilo val of "<" or ">"');
    }
    if (satisfies(version2, range2, options)) {
      return false;
    }
    for (let i = 0; i < range2.set.length; ++i) {
      const comparators = range2.set[i];
      let high = null;
      let low = null;
      comparators.forEach((comparator2) => {
        if (comparator2.semver === ANY) {
          comparator2 = new Comparator(">=0.0.0");
        }
        high = high || comparator2;
        low = low || comparator2;
        if (gtfn(comparator2.semver, high.semver, options)) {
          high = comparator2;
        } else if (ltfn(comparator2.semver, low.semver, options)) {
          low = comparator2;
        }
      });
      if (high.operator === comp || high.operator === ecomp) {
        return false;
      }
      if ((!low.operator || low.operator === comp) && ltefn(version2, low.semver)) {
        return false;
      } else if (low.operator === ecomp && ltfn(version2, low.semver)) {
        return false;
      }
    }
    return true;
  };
  outside_1 = outside;
  return outside_1;
}
var gtr_1;
var hasRequiredGtr;
function requireGtr() {
  if (hasRequiredGtr) return gtr_1;
  hasRequiredGtr = 1;
  const outside = requireOutside();
  const gtr = (version2, range2, options) => outside(version2, range2, ">", options);
  gtr_1 = gtr;
  return gtr_1;
}
var ltr_1;
var hasRequiredLtr;
function requireLtr() {
  if (hasRequiredLtr) return ltr_1;
  hasRequiredLtr = 1;
  const outside = requireOutside();
  const ltr = (version2, range2, options) => outside(version2, range2, "<", options);
  ltr_1 = ltr;
  return ltr_1;
}
var intersects_1;
var hasRequiredIntersects;
function requireIntersects() {
  if (hasRequiredIntersects) return intersects_1;
  hasRequiredIntersects = 1;
  const Range = requireRange();
  const intersects = (r1, r2, options) => {
    r1 = new Range(r1, options);
    r2 = new Range(r2, options);
    return r1.intersects(r2, options);
  };
  intersects_1 = intersects;
  return intersects_1;
}
var simplify;
var hasRequiredSimplify;
function requireSimplify() {
  if (hasRequiredSimplify) return simplify;
  hasRequiredSimplify = 1;
  const satisfies = requireSatisfies();
  const compare = requireCompare();
  simplify = (versions, range2, options) => {
    const set = [];
    let first2 = null;
    let prev = null;
    const v = versions.sort((a, b) => compare(a, b, options));
    for (const version2 of v) {
      const included = satisfies(version2, range2, options);
      if (included) {
        prev = version2;
        if (!first2) {
          first2 = version2;
        }
      } else {
        if (prev) {
          set.push([first2, prev]);
        }
        prev = null;
        first2 = null;
      }
    }
    if (first2) {
      set.push([first2, null]);
    }
    const ranges = [];
    for (const [min2, max2] of set) {
      if (min2 === max2) {
        ranges.push(min2);
      } else if (!max2 && min2 === v[0]) {
        ranges.push("*");
      } else if (!max2) {
        ranges.push(`>=${min2}`);
      } else if (min2 === v[0]) {
        ranges.push(`<=${max2}`);
      } else {
        ranges.push(`${min2} - ${max2}`);
      }
    }
    const simplified = ranges.join(" || ");
    const original = typeof range2.raw === "string" ? range2.raw : String(range2);
    return simplified.length < original.length ? simplified : range2;
  };
  return simplify;
}
var subset_1;
var hasRequiredSubset;
function requireSubset() {
  if (hasRequiredSubset) return subset_1;
  hasRequiredSubset = 1;
  const Range = requireRange();
  const Comparator = requireComparator();
  const { ANY } = Comparator;
  const satisfies = requireSatisfies();
  const compare = requireCompare();
  const subset = (sub, dom, options = {}) => {
    if (sub === dom) {
      return true;
    }
    sub = new Range(sub, options);
    dom = new Range(dom, options);
    let sawNonNull = false;
    OUTER: for (const simpleSub of sub.set) {
      for (const simpleDom of dom.set) {
        const isSub = simpleSubset(simpleSub, simpleDom, options);
        sawNonNull = sawNonNull || isSub !== null;
        if (isSub) {
          continue OUTER;
        }
      }
      if (sawNonNull) {
        return false;
      }
    }
    return true;
  };
  const minimumVersionWithPreRelease = [new Comparator(">=0.0.0-0")];
  const minimumVersion = [new Comparator(">=0.0.0")];
  const simpleSubset = (sub, dom, options) => {
    if (sub === dom) {
      return true;
    }
    if (sub.length === 1 && sub[0].semver === ANY) {
      if (dom.length === 1 && dom[0].semver === ANY) {
        return true;
      } else if (options.includePrerelease) {
        sub = minimumVersionWithPreRelease;
      } else {
        sub = minimumVersion;
      }
    }
    if (dom.length === 1 && dom[0].semver === ANY) {
      if (options.includePrerelease) {
        return true;
      } else {
        dom = minimumVersion;
      }
    }
    const eqSet = /* @__PURE__ */ new Set();
    let gt, lt;
    for (const c of sub) {
      if (c.operator === ">" || c.operator === ">=") {
        gt = higherGT(gt, c, options);
      } else if (c.operator === "<" || c.operator === "<=") {
        lt = lowerLT(lt, c, options);
      } else {
        eqSet.add(c.semver);
      }
    }
    if (eqSet.size > 1) {
      return null;
    }
    let gtltComp;
    if (gt && lt) {
      gtltComp = compare(gt.semver, lt.semver, options);
      if (gtltComp > 0) {
        return null;
      } else if (gtltComp === 0 && (gt.operator !== ">=" || lt.operator !== "<=")) {
        return null;
      }
    }
    for (const eq of eqSet) {
      if (gt && !satisfies(eq, String(gt), options)) {
        return null;
      }
      if (lt && !satisfies(eq, String(lt), options)) {
        return null;
      }
      for (const c of dom) {
        if (!satisfies(eq, String(c), options)) {
          return false;
        }
      }
      return true;
    }
    let higher, lower;
    let hasDomLT, hasDomGT;
    let needDomLTPre = lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : false;
    let needDomGTPre = gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : false;
    if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt.operator === "<" && needDomLTPre.prerelease[0] === 0) {
      needDomLTPre = false;
    }
    for (const c of dom) {
      hasDomGT = hasDomGT || c.operator === ">" || c.operator === ">=";
      hasDomLT = hasDomLT || c.operator === "<" || c.operator === "<=";
      if (gt) {
        if (needDomGTPre) {
          if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) {
            needDomGTPre = false;
          }
        }
        if (c.operator === ">" || c.operator === ">=") {
          higher = higherGT(gt, c, options);
          if (higher === c && higher !== gt) {
            return false;
          }
        } else if (gt.operator === ">=" && !satisfies(gt.semver, String(c), options)) {
          return false;
        }
      }
      if (lt) {
        if (needDomLTPre) {
          if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) {
            needDomLTPre = false;
          }
        }
        if (c.operator === "<" || c.operator === "<=") {
          lower = lowerLT(lt, c, options);
          if (lower === c && lower !== lt) {
            return false;
          }
        } else if (lt.operator === "<=" && !satisfies(lt.semver, String(c), options)) {
          return false;
        }
      }
      if (!c.operator && (lt || gt) && gtltComp !== 0) {
        return false;
      }
    }
    if (gt && hasDomLT && !lt && gtltComp !== 0) {
      return false;
    }
    if (lt && hasDomGT && !gt && gtltComp !== 0) {
      return false;
    }
    if (needDomGTPre || needDomLTPre) {
      return false;
    }
    return true;
  };
  const higherGT = (a, b, options) => {
    if (!a) {
      return b;
    }
    const comp = compare(a.semver, b.semver, options);
    return comp > 0 ? a : comp < 0 ? b : b.operator === ">" && a.operator === ">=" ? b : a;
  };
  const lowerLT = (a, b, options) => {
    if (!a) {
      return b;
    }
    const comp = compare(a.semver, b.semver, options);
    return comp < 0 ? a : comp > 0 ? b : b.operator === "<" && a.operator === "<=" ? b : a;
  };
  subset_1 = subset;
  return subset_1;
}
var semver$1;
var hasRequiredSemver;
function requireSemver() {
  if (hasRequiredSemver) return semver$1;
  hasRequiredSemver = 1;
  const internalRe = requireRe();
  const constants2 = requireConstants();
  const SemVer = requireSemver$1();
  const identifiers2 = requireIdentifiers();
  const parse = requireParse();
  const valid2 = requireValid$1();
  const clean = requireClean();
  const inc = requireInc();
  const diff = requireDiff();
  const major = requireMajor();
  const minor = requireMinor();
  const patch = requirePatch();
  const prerelease = requirePrerelease();
  const compare = requireCompare();
  const rcompare = requireRcompare();
  const compareLoose = requireCompareLoose();
  const compareBuild = requireCompareBuild();
  const sort = requireSort();
  const rsort = requireRsort();
  const gt = requireGt();
  const lt = requireLt();
  const eq = requireEq();
  const neq = requireNeq();
  const gte = requireGte();
  const lte = requireLte();
  const cmp = requireCmp();
  const coerce = requireCoerce();
  const Comparator = requireComparator();
  const Range = requireRange();
  const satisfies = requireSatisfies();
  const toComparators = requireToComparators();
  const maxSatisfying = requireMaxSatisfying();
  const minSatisfying = requireMinSatisfying();
  const minVersion = requireMinVersion();
  const validRange = requireValid();
  const outside = requireOutside();
  const gtr = requireGtr();
  const ltr = requireLtr();
  const intersects = requireIntersects();
  const simplifyRange = requireSimplify();
  const subset = requireSubset();
  semver$1 = {
    parse,
    valid: valid2,
    clean,
    inc,
    diff,
    major,
    minor,
    patch,
    prerelease,
    compare,
    rcompare,
    compareLoose,
    compareBuild,
    sort,
    rsort,
    gt,
    lt,
    eq,
    neq,
    gte,
    lte,
    cmp,
    coerce,
    Comparator,
    Range,
    satisfies,
    toComparators,
    maxSatisfying,
    minSatisfying,
    minVersion,
    validRange,
    outside,
    gtr,
    ltr,
    intersects,
    simplifyRange,
    subset,
    SemVer,
    re: internalRe.re,
    src: internalRe.src,
    tokens: internalRe.t,
    SEMVER_SPEC_VERSION: constants2.SEMVER_SPEC_VERSION,
    RELEASE_TYPES: constants2.RELEASE_TYPES,
    compareIdentifiers: identifiers2.compareIdentifiers,
    rcompareIdentifiers: identifiers2.rcompareIdentifiers
  };
  return semver$1;
}
var semverExports = requireSemver();
const semver = /* @__PURE__ */ getDefaultExportFromCjs(semverExports);
var ejs$1 = {};
var utils = {};
var hasRequiredUtils;
function requireUtils() {
  if (hasRequiredUtils) return utils;
  hasRequiredUtils = 1;
  (function(exports2) {
    var regExpChars = /[|\\{}()[\]^$+*?.]/g;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var hasOwn = function(obj, key) {
      return hasOwnProperty.apply(obj, [key]);
    };
    exports2.escapeRegExpChars = function(string) {
      if (!string) {
        return "";
      }
      return String(string).replace(regExpChars, "\\$&");
    };
    var _ENCODE_HTML_RULES = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&#34;",
      "'": "&#39;"
    };
    var _MATCH_HTML = /[&<>'"]/g;
    function encode_char(c) {
      return _ENCODE_HTML_RULES[c] || c;
    }
    var escapeFuncStr = `var _ENCODE_HTML_RULES = {
      "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , '"': "&#34;"
    , "'": "&#39;"
    }
  , _MATCH_HTML = /[&<>'"]/g;
function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
};
`;
    exports2.escapeXML = function(markup) {
      return markup == void 0 ? "" : String(markup).replace(_MATCH_HTML, encode_char);
    };
    function escapeXMLToString() {
      return Function.prototype.toString.call(this) + ";\n" + escapeFuncStr;
    }
    try {
      if (typeof Object.defineProperty === "function") {
        Object.defineProperty(exports2.escapeXML, "toString", { value: escapeXMLToString });
      } else {
        exports2.escapeXML.toString = escapeXMLToString;
      }
    } catch (err) {
      console.warn("Unable to set escapeXML.toString (is the Function prototype frozen?)");
    }
    exports2.shallowCopy = function(to, from2) {
      from2 = from2 || {};
      if (to !== null && to !== void 0) {
        for (var p in from2) {
          if (!hasOwn(from2, p)) {
            continue;
          }
          if (p === "__proto__" || p === "constructor") {
            continue;
          }
          to[p] = from2[p];
        }
      }
      return to;
    };
    exports2.shallowCopyFromList = function(to, from2, list) {
      list = list || [];
      from2 = from2 || {};
      if (to !== null && to !== void 0) {
        for (var i = 0; i < list.length; i++) {
          var p = list[i];
          if (typeof from2[p] != "undefined") {
            if (!hasOwn(from2, p)) {
              continue;
            }
            if (p === "__proto__" || p === "constructor") {
              continue;
            }
            to[p] = from2[p];
          }
        }
      }
      return to;
    };
    exports2.cache = {
      _data: {},
      set: function(key, val) {
        this._data[key] = val;
      },
      get: function(key) {
        return this._data[key];
      },
      remove: function(key) {
        delete this._data[key];
      },
      reset: function() {
        this._data = {};
      }
    };
    exports2.hyphenToCamel = function(str) {
      return str.replace(/-[a-z]/g, function(match2) {
        return match2[1].toUpperCase();
      });
    };
    exports2.createNullProtoObjWherePossible = function() {
      if (typeof Object.create == "function") {
        return function() {
          return /* @__PURE__ */ Object.create(null);
        };
      }
      if (!({ __proto__: null } instanceof Object)) {
        return function() {
          return { __proto__: null };
        };
      }
      return function() {
        return {};
      };
    }();
    exports2.hasOwnOnlyObject = function(obj) {
      var o = exports2.createNullProtoObjWherePossible();
      for (var p in obj) {
        if (hasOwn(obj, p)) {
          o[p] = obj[p];
        }
      }
      return o;
    };
  })(utils);
  return utils;
}
const version$1 = "3.1.10";
const require$$3 = {
  version: version$1
};
var hasRequiredEjs;
function requireEjs() {
  if (hasRequiredEjs) return ejs$1;
  hasRequiredEjs = 1;
  (function(exports2) {
    /**
     * @file Embedded JavaScript templating engine. {@link http://ejs.co}
     * @author Matthew Eernisse <mde@fleegix.org>
     * @author Tiancheng "Timothy" Gu <timothygu99@gmail.com>
     * @project EJS
     * @license {@link http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0}
     */
    var fs$1 = fs;
    var path$1 = path;
    var utils2 = requireUtils();
    var scopeOptionWarned = false;
    var _VERSION_STRING = require$$3.version;
    var _DEFAULT_OPEN_DELIMITER = "<";
    var _DEFAULT_CLOSE_DELIMITER = ">";
    var _DEFAULT_DELIMITER = "%";
    var _DEFAULT_LOCALS_NAME = "locals";
    var _NAME = "ejs";
    var _REGEX_STRING = "(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)";
    var _OPTS_PASSABLE_WITH_DATA = [
      "delimiter",
      "scope",
      "context",
      "debug",
      "compileDebug",
      "client",
      "_with",
      "rmWhitespace",
      "strict",
      "filename",
      "async"
    ];
    var _OPTS_PASSABLE_WITH_DATA_EXPRESS = _OPTS_PASSABLE_WITH_DATA.concat("cache");
    var _BOM = /^\uFEFF/;
    var _JS_IDENTIFIER = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/;
    exports2.cache = utils2.cache;
    exports2.fileLoader = fs$1.readFileSync;
    exports2.localsName = _DEFAULT_LOCALS_NAME;
    exports2.promiseImpl = new Function("return this;")().Promise;
    exports2.resolveInclude = function(name, filename, isDir) {
      var dirname = path$1.dirname;
      var extname = path$1.extname;
      var resolve = path$1.resolve;
      var includePath = resolve(isDir ? filename : dirname(filename), name);
      var ext = extname(name);
      if (!ext) {
        includePath += ".ejs";
      }
      return includePath;
    };
    function resolvePaths(name, paths) {
      var filePath;
      if (paths.some(function(v) {
        filePath = exports2.resolveInclude(name, v, true);
        return fs$1.existsSync(filePath);
      })) {
        return filePath;
      }
    }
    function getIncludePath(path2, options) {
      var includePath;
      var filePath;
      var views = options.views;
      var match2 = /^[A-Za-z]+:\\|^\//.exec(path2);
      if (match2 && match2.length) {
        path2 = path2.replace(/^\/*/, "");
        if (Array.isArray(options.root)) {
          includePath = resolvePaths(path2, options.root);
        } else {
          includePath = exports2.resolveInclude(path2, options.root || "/", true);
        }
      } else {
        if (options.filename) {
          filePath = exports2.resolveInclude(path2, options.filename);
          if (fs$1.existsSync(filePath)) {
            includePath = filePath;
          }
        }
        if (!includePath && Array.isArray(views)) {
          includePath = resolvePaths(path2, views);
        }
        if (!includePath && typeof options.includer !== "function") {
          throw new Error('Could not find the include file "' + options.escapeFunction(path2) + '"');
        }
      }
      return includePath;
    }
    function handleCache(options, template) {
      var func;
      var filename = options.filename;
      var hasTemplate = arguments.length > 1;
      if (options.cache) {
        if (!filename) {
          throw new Error("cache option requires a filename");
        }
        func = exports2.cache.get(filename);
        if (func) {
          return func;
        }
        if (!hasTemplate) {
          template = fileLoader(filename).toString().replace(_BOM, "");
        }
      } else if (!hasTemplate) {
        if (!filename) {
          throw new Error("Internal EJS error: no file name or template provided");
        }
        template = fileLoader(filename).toString().replace(_BOM, "");
      }
      func = exports2.compile(template, options);
      if (options.cache) {
        exports2.cache.set(filename, func);
      }
      return func;
    }
    function tryHandleCache(options, data, cb) {
      var result;
      if (!cb) {
        if (typeof exports2.promiseImpl == "function") {
          return new exports2.promiseImpl(function(resolve, reject) {
            try {
              result = handleCache(options)(data);
              resolve(result);
            } catch (err) {
              reject(err);
            }
          });
        } else {
          throw new Error("Please provide a callback function");
        }
      } else {
        try {
          result = handleCache(options)(data);
        } catch (err) {
          return cb(err);
        }
        cb(null, result);
      }
    }
    function fileLoader(filePath) {
      return exports2.fileLoader(filePath);
    }
    function includeFile(path2, options) {
      var opts = utils2.shallowCopy(utils2.createNullProtoObjWherePossible(), options);
      opts.filename = getIncludePath(path2, opts);
      if (typeof options.includer === "function") {
        var includerResult = options.includer(path2, opts.filename);
        if (includerResult) {
          if (includerResult.filename) {
            opts.filename = includerResult.filename;
          }
          if (includerResult.template) {
            return handleCache(opts, includerResult.template);
          }
        }
      }
      return handleCache(opts);
    }
    function rethrow(err, str, flnm, lineno, esc) {
      var lines2 = str.split("\n");
      var start = Math.max(lineno - 3, 0);
      var end = Math.min(lines2.length, lineno + 3);
      var filename = esc(flnm);
      var context = lines2.slice(start, end).map(function(line, i) {
        var curr = i + start + 1;
        return (curr == lineno ? " >> " : "    ") + curr + "| " + line;
      }).join("\n");
      err.path = filename;
      err.message = (filename || "ejs") + ":" + lineno + "\n" + context + "\n\n" + err.message;
      throw err;
    }
    function stripSemi(str) {
      return str.replace(/;(\s*$)/, "$1");
    }
    exports2.compile = function compile(template, opts) {
      var templ;
      if (opts && opts.scope) {
        if (!scopeOptionWarned) {
          console.warn("`scope` option is deprecated and will be removed in EJS 3");
          scopeOptionWarned = true;
        }
        if (!opts.context) {
          opts.context = opts.scope;
        }
        delete opts.scope;
      }
      templ = new Template(template, opts);
      return templ.compile();
    };
    exports2.render = function(template, d, o) {
      var data = d || utils2.createNullProtoObjWherePossible();
      var opts = o || utils2.createNullProtoObjWherePossible();
      if (arguments.length == 2) {
        utils2.shallowCopyFromList(opts, data, _OPTS_PASSABLE_WITH_DATA);
      }
      return handleCache(opts, template)(data);
    };
    exports2.renderFile = function() {
      var args2 = Array.prototype.slice.call(arguments);
      var filename = args2.shift();
      var cb;
      var opts = { filename };
      var data;
      var viewOpts;
      if (typeof arguments[arguments.length - 1] == "function") {
        cb = args2.pop();
      }
      if (args2.length) {
        data = args2.shift();
        if (args2.length) {
          utils2.shallowCopy(opts, args2.pop());
        } else {
          if (data.settings) {
            if (data.settings.views) {
              opts.views = data.settings.views;
            }
            if (data.settings["view cache"]) {
              opts.cache = true;
            }
            viewOpts = data.settings["view options"];
            if (viewOpts) {
              utils2.shallowCopy(opts, viewOpts);
            }
          }
          utils2.shallowCopyFromList(opts, data, _OPTS_PASSABLE_WITH_DATA_EXPRESS);
        }
        opts.filename = filename;
      } else {
        data = utils2.createNullProtoObjWherePossible();
      }
      return tryHandleCache(opts, data, cb);
    };
    exports2.Template = Template;
    exports2.clearCache = function() {
      exports2.cache.reset();
    };
    function Template(text, optsParam) {
      var opts = utils2.hasOwnOnlyObject(optsParam);
      var options = utils2.createNullProtoObjWherePossible();
      this.templateText = text;
      this.mode = null;
      this.truncate = false;
      this.currentLine = 1;
      this.source = "";
      options.client = opts.client || false;
      options.escapeFunction = opts.escape || opts.escapeFunction || utils2.escapeXML;
      options.compileDebug = opts.compileDebug !== false;
      options.debug = !!opts.debug;
      options.filename = opts.filename;
      options.openDelimiter = opts.openDelimiter || exports2.openDelimiter || _DEFAULT_OPEN_DELIMITER;
      options.closeDelimiter = opts.closeDelimiter || exports2.closeDelimiter || _DEFAULT_CLOSE_DELIMITER;
      options.delimiter = opts.delimiter || exports2.delimiter || _DEFAULT_DELIMITER;
      options.strict = opts.strict || false;
      options.context = opts.context;
      options.cache = opts.cache || false;
      options.rmWhitespace = opts.rmWhitespace;
      options.root = opts.root;
      options.includer = opts.includer;
      options.outputFunctionName = opts.outputFunctionName;
      options.localsName = opts.localsName || exports2.localsName || _DEFAULT_LOCALS_NAME;
      options.views = opts.views;
      options.async = opts.async;
      options.destructuredLocals = opts.destructuredLocals;
      options.legacyInclude = typeof opts.legacyInclude != "undefined" ? !!opts.legacyInclude : true;
      if (options.strict) {
        options._with = false;
      } else {
        options._with = typeof opts._with != "undefined" ? opts._with : true;
      }
      this.opts = options;
      this.regex = this.createRegex();
    }
    Template.modes = {
      EVAL: "eval",
      ESCAPED: "escaped",
      RAW: "raw",
      COMMENT: "comment",
      LITERAL: "literal"
    };
    Template.prototype = {
      createRegex: function() {
        var str = _REGEX_STRING;
        var delim = utils2.escapeRegExpChars(this.opts.delimiter);
        var open = utils2.escapeRegExpChars(this.opts.openDelimiter);
        var close = utils2.escapeRegExpChars(this.opts.closeDelimiter);
        str = str.replace(/%/g, delim).replace(/</g, open).replace(/>/g, close);
        return new RegExp(str);
      },
      compile: function() {
        var src;
        var fn;
        var opts = this.opts;
        var prepended = "";
        var appended = "";
        var escapeFn = opts.escapeFunction;
        var ctor;
        var sanitizedFilename = opts.filename ? JSON.stringify(opts.filename) : "undefined";
        if (!this.source) {
          this.generateSource();
          prepended += '  var __output = "";\n  function __append(s) { if (s !== undefined && s !== null) __output += s }\n';
          if (opts.outputFunctionName) {
            if (!_JS_IDENTIFIER.test(opts.outputFunctionName)) {
              throw new Error("outputFunctionName is not a valid JS identifier.");
            }
            prepended += "  var " + opts.outputFunctionName + " = __append;\n";
          }
          if (opts.localsName && !_JS_IDENTIFIER.test(opts.localsName)) {
            throw new Error("localsName is not a valid JS identifier.");
          }
          if (opts.destructuredLocals && opts.destructuredLocals.length) {
            var destructuring = "  var __locals = (" + opts.localsName + " || {}),\n";
            for (var i = 0; i < opts.destructuredLocals.length; i++) {
              var name = opts.destructuredLocals[i];
              if (!_JS_IDENTIFIER.test(name)) {
                throw new Error("destructuredLocals[" + i + "] is not a valid JS identifier.");
              }
              if (i > 0) {
                destructuring += ",\n  ";
              }
              destructuring += name + " = __locals." + name;
            }
            prepended += destructuring + ";\n";
          }
          if (opts._with !== false) {
            prepended += "  with (" + opts.localsName + " || {}) {\n";
            appended += "  }\n";
          }
          appended += "  return __output;\n";
          this.source = prepended + this.source + appended;
        }
        if (opts.compileDebug) {
          src = "var __line = 1\n  , __lines = " + JSON.stringify(this.templateText) + "\n  , __filename = " + sanitizedFilename + ";\ntry {\n" + this.source + "} catch (e) {\n  rethrow(e, __lines, __filename, __line, escapeFn);\n}\n";
        } else {
          src = this.source;
        }
        if (opts.client) {
          src = "escapeFn = escapeFn || " + escapeFn.toString() + ";\n" + src;
          if (opts.compileDebug) {
            src = "rethrow = rethrow || " + rethrow.toString() + ";\n" + src;
          }
        }
        if (opts.strict) {
          src = '"use strict";\n' + src;
        }
        if (opts.debug) {
          console.log(src);
        }
        if (opts.compileDebug && opts.filename) {
          src = src + "\n//# sourceURL=" + sanitizedFilename + "\n";
        }
        try {
          if (opts.async) {
            try {
              ctor = new Function("return (async function(){}).constructor;")();
            } catch (e) {
              if (e instanceof SyntaxError) {
                throw new Error("This environment does not support async/await");
              } else {
                throw e;
              }
            }
          } else {
            ctor = Function;
          }
          fn = new ctor(opts.localsName + ", escapeFn, include, rethrow", src);
        } catch (e) {
          if (e instanceof SyntaxError) {
            if (opts.filename) {
              e.message += " in " + opts.filename;
            }
            e.message += " while compiling ejs\n\n";
            e.message += "If the above error is not helpful, you may want to try EJS-Lint:\n";
            e.message += "https://github.com/RyanZim/EJS-Lint";
            if (!opts.async) {
              e.message += "\n";
              e.message += "Or, if you meant to create an async function, pass `async: true` as an option.";
            }
          }
          throw e;
        }
        var returnedFn = opts.client ? fn : function anonymous(data) {
          var include = function(path2, includeData) {
            var d = utils2.shallowCopy(utils2.createNullProtoObjWherePossible(), data);
            if (includeData) {
              d = utils2.shallowCopy(d, includeData);
            }
            return includeFile(path2, opts)(d);
          };
          return fn.apply(
            opts.context,
            [data || utils2.createNullProtoObjWherePossible(), escapeFn, include, rethrow]
          );
        };
        if (opts.filename && typeof Object.defineProperty === "function") {
          var filename = opts.filename;
          var basename = path$1.basename(filename, path$1.extname(filename));
          try {
            Object.defineProperty(returnedFn, "name", {
              value: basename,
              writable: false,
              enumerable: false,
              configurable: true
            });
          } catch (e) {
          }
        }
        return returnedFn;
      },
      generateSource: function() {
        var opts = this.opts;
        if (opts.rmWhitespace) {
          this.templateText = this.templateText.replace(/[\r\n]+/g, "\n").replace(/^\s+|\s+$/gm, "");
        }
        this.templateText = this.templateText.replace(/[ \t]*<%_/gm, "<%_").replace(/_%>[ \t]*/gm, "_%>");
        var self = this;
        var matches = this.parseTemplateText();
        var d = this.opts.delimiter;
        var o = this.opts.openDelimiter;
        var c = this.opts.closeDelimiter;
        if (matches && matches.length) {
          matches.forEach(function(line, index) {
            var closing;
            if (line.indexOf(o + d) === 0 && line.indexOf(o + d + d) !== 0) {
              closing = matches[index + 2];
              if (!(closing == d + c || closing == "-" + d + c || closing == "_" + d + c)) {
                throw new Error('Could not find matching close tag for "' + line + '".');
              }
            }
            self.scanLine(line);
          });
        }
      },
      parseTemplateText: function() {
        var str = this.templateText;
        var pat = this.regex;
        var result = pat.exec(str);
        var arr = [];
        var firstPos;
        while (result) {
          firstPos = result.index;
          if (firstPos !== 0) {
            arr.push(str.substring(0, firstPos));
            str = str.slice(firstPos);
          }
          arr.push(result[0]);
          str = str.slice(result[0].length);
          result = pat.exec(str);
        }
        if (str) {
          arr.push(str);
        }
        return arr;
      },
      _addOutput: function(line) {
        if (this.truncate) {
          line = line.replace(/^(?:\r\n|\r|\n)/, "");
          this.truncate = false;
        }
        if (!line) {
          return line;
        }
        line = line.replace(/\\/g, "\\\\");
        line = line.replace(/\n/g, "\\n");
        line = line.replace(/\r/g, "\\r");
        line = line.replace(/"/g, '\\"');
        this.source += '    ; __append("' + line + '")\n';
      },
      scanLine: function(line) {
        var self = this;
        var d = this.opts.delimiter;
        var o = this.opts.openDelimiter;
        var c = this.opts.closeDelimiter;
        var newLineCount = 0;
        newLineCount = line.split("\n").length - 1;
        switch (line) {
          case o + d:
          case o + d + "_":
            this.mode = Template.modes.EVAL;
            break;
          case o + d + "=":
            this.mode = Template.modes.ESCAPED;
            break;
          case o + d + "-":
            this.mode = Template.modes.RAW;
            break;
          case o + d + "#":
            this.mode = Template.modes.COMMENT;
            break;
          case o + d + d:
            this.mode = Template.modes.LITERAL;
            this.source += '    ; __append("' + line.replace(o + d + d, o + d) + '")\n';
            break;
          case d + d + c:
            this.mode = Template.modes.LITERAL;
            this.source += '    ; __append("' + line.replace(d + d + c, d + c) + '")\n';
            break;
          case d + c:
          case "-" + d + c:
          case "_" + d + c:
            if (this.mode == Template.modes.LITERAL) {
              this._addOutput(line);
            }
            this.mode = null;
            this.truncate = line.indexOf("-") === 0 || line.indexOf("_") === 0;
            break;
          default:
            if (this.mode) {
              switch (this.mode) {
                case Template.modes.EVAL:
                case Template.modes.ESCAPED:
                case Template.modes.RAW:
                  if (line.lastIndexOf("//") > line.lastIndexOf("\n")) {
                    line += "\n";
                  }
              }
              switch (this.mode) {
                // Just executing code
                case Template.modes.EVAL:
                  this.source += "    ; " + line + "\n";
                  break;
                // Exec, esc, and output
                case Template.modes.ESCAPED:
                  this.source += "    ; __append(escapeFn(" + stripSemi(line) + "))\n";
                  break;
                // Exec and output
                case Template.modes.RAW:
                  this.source += "    ; __append(" + stripSemi(line) + ")\n";
                  break;
                case Template.modes.COMMENT:
                  break;
                // Literal <%% mode, append as raw output
                case Template.modes.LITERAL:
                  this._addOutput(line);
                  break;
              }
            } else {
              this._addOutput(line);
            }
        }
        if (self.opts.compileDebug && newLineCount) {
          this.currentLine += newLineCount;
          this.source += "    ; __line = " + this.currentLine + "\n";
        }
      }
    };
    exports2.escapeXML = utils2.escapeXML;
    exports2.__express = exports2.renderFile;
    exports2.VERSION = _VERSION_STRING;
    exports2.name = _NAME;
    if (typeof window != "undefined") {
      window.ejs = exports2;
    }
  })(ejs$1);
  return ejs$1;
}
var ejsExports = requireEjs();
const ejs = /* @__PURE__ */ getDefaultExportFromCjs(ejsExports);
const version = "1.0.5";
const packagejson = {
  version
};
const checkNpmManagerInstall = (name) => {
  try {
    require$$1$4.execSync(`${name} --version`, { stdio: "ignore" });
    return true;
  } catch (e) {
    throw new Error(`${name} 未安装`);
  }
};
program.version(packagejson.version).description("@xh/uni-cli 命令行工具").action(() => {
  inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "请输入项目名称",
      default: "xh-uni-app"
    },
    {
      type: "input",
      name: "appName",
      message: "请输入应用名称",
      default: "小火软件"
    },
    {
      type: "select",
      name: "version",
      message: "请选择项目类型",
      choices: ["v2", "v3"],
      default: "v3"
    },
    {
      type: "select",
      name: "npmManager",
      message: "请选择包管理工具？",
      choices: ["pnpm", "npm", "cnpm", "yarn"],
      default: "pnpm"
    }
  ]).then((res) => {
    const localVersion = semver.clean(process.version);
    if (semver.lt(localVersion, "16.7.0")) {
      throw new Error(
        `当前 Node 版本为 ${localVersion}，请升级到 16.7.0 或以上版本`
      );
    }
    if (res.version == "v2") {
      throw new Error("v2版本待更新，请选择v3版本");
    }
    checkNpmManagerInstall(res.npmManager);
    const templateDir = path.join(
      void 0,
      `../templates/xh-${res.version}`
    );
    const targetDir = path.join(process.cwd(), res.projectName);
    if (fs.existsSync(targetDir)) {
      throw new Error(`${res.projectName}目录已存在`);
    }
    fs.mkdirSync(targetDir);
    fs.cpSync(templateDir, targetDir, { recursive: true });
    const packagePath = path.join(targetDir, "package.json");
    ejs.renderFile(packagePath, res, (err, res2) => {
      if (!err) {
        fs.writeFileSync(packagePath, res2);
      }
    });
    const pagesPath = path.join(targetDir, "src", "pages.json");
    ejs.renderFile(pagesPath, res, (err, res2) => {
      if (!err) {
        fs.writeFileSync(pagesPath, res2);
      }
    });
    const manifest = path.join(targetDir, "src", "manifest.json");
    ejs.renderFile(pagesPath, res, (err, res2) => {
      if (!err) {
        fs.writeFileSync(manifest, res2);
      }
    });
    require$$1$4.execSync(`cd ${res.projectName} && ${res.npmManager} install`, {
      stdio: "inherit"
    });
  });
});
program.parse();
