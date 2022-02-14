import { generatedMessage, createElementMetadata } from './utils.js';

export function generate(config: { customElementsManifest: any, entrypoint: string }) {
  const elements = createElementMetadata(config.customElementsManifest, config.entrypoint);

  const eventObject = elements.reduce((prev, component) => {
    component.events?.forEach(event => {
      prev[event.name] = prev[event.name] ? [...prev[event.name] ?? [], { ...event, tagName: component.tagName }] : [];
    });

    return prev;
  }, { });


  const srcCS = `
/* 
 * @experimental
 *
 * EventHandlers.cs
 * ${generatedMessage}
 */

using Microsoft.AspNetCore.Components;
using System.Text.Json;

namespace BlazorApp;
${Object.keys(eventObject).map(name => ({ name, descriptions: eventObject[name] })).map(e => {
  return `
[EventHandler("on${e.name}", typeof(CustomEventArgs))] // ${e.descriptions.map(d => `${d.tagName}`).join(', ')}`;
}).join('')}
public static class EventHandlers
{

}

public class CustomEventArgs : EventArgs
{
  public dynamic? Detail { get; set; }

  /* Returns the detail value of CustomEvent with given type */
  public T GetDetail<T>() {
    return JsonSerializer.Deserialize<T>(Detail); // used to cast dynamic type, unknown until event occurs at runtime
  }
}`.trim();

  const srcJS = `
/**
 * @experimental
 * 
 * wwwroot/custom-events.js
 * ${generatedMessage}
 */

const customEvents = {${Object.keys(eventObject)
  .map(name => ({ name, descriptions: eventObject[name] }))
  .map(e => `
  ${e.name}: true, // ${e.descriptions.map(d => `${d.tagName}`).join(', ')}`)}
};

/**
 * Workaround: Blazor ignores the event target and only listens to global events
 * this is a problem for most custom elements which dispatch CustomEvent types
 * that default to not bubbling.
 */
CustomEvent = class Bubbled extends CustomEvent {
  constructor(event, config) {
    const bubbles = customEvents[event] !== undefined ? customEvents[event] : config.bubbles;
    super(event, { ...config, bubbles });
  }
}

Object.keys(customEvents).map(event => {
  Blazor.registerCustomEventType(event, {
    browserEventName: event,
    createEventArgs: event => {
      return { detail: event.detail };
    }
  });
});
`;

  return [{ src: srcCS, path: 'CustomEvents.cs' }, { src: srcJS, path: 'custom-events.js' }];
}


// export function afterStarted() {
//   ${Object.keys(eventObject).map(name => ({ name, descriptions: eventObject[name] })).map(e => `
// ${e.descriptions.map(d => `  // ${d.tagName}: ${d.description}`).join('\n')}
//   Blazor.registerCustomEventType('${e.name}', {
//     browserEventName: '${e.name}',
//     createEventArgs: event => {
//       return { detail: event.detail };
//     }
//   });`)}`};