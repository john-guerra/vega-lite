"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var selection_1 = require("./compile/selection/selection");
var datetime_1 = require("./datetime");
var fielddef_1 = require("./fielddef");
var timeunit_1 = require("./timeunit");
var util_1 = require("./util");
function isSelectionFilter(filter) {
    return filter && filter['selection'];
}
exports.isSelectionFilter = isSelectionFilter;
function isEqualFilter(filter) {
    return filter && !!filter.field && filter.equal !== undefined;
}
exports.isEqualFilter = isEqualFilter;
function isRangeFilter(filter) {
    if (filter && filter.field) {
        if (util_1.isArray(filter.range) && filter.range.length === 2) {
            return true;
        }
    }
    return false;
}
exports.isRangeFilter = isRangeFilter;
function isOneOfFilter(filter) {
    return filter && !!filter.field && (util_1.isArray(filter.oneOf) ||
        util_1.isArray(filter.in) // backward compatibility
    );
}
exports.isOneOfFilter = isOneOfFilter;
function isFieldFilter(filter) {
    return isOneOfFilter(filter) || isEqualFilter(filter) || isRangeFilter(filter);
}
exports.isFieldFilter = isFieldFilter;
/**
 * Converts a filter into an expression.
 */
// model is only used for selection filters.
function expression(model, filterOp, node) {
    return util_1.logicalExpr(filterOp, function (filter) {
        if (util_1.isString(filter)) {
            return filter;
        }
        else if (isSelectionFilter(filter)) {
            return selection_1.predicate(model, filter.selection, node);
        }
        else {
            return fieldFilterExpression(filter);
        }
    });
}
exports.expression = expression;
// This method is used by Voyager.  Do not change its behavior without changing Voyager.
function fieldFilterExpression(filter, useInRange) {
    if (useInRange === void 0) { useInRange = true; }
    var fieldExpr = filter.timeUnit ?
        // For timeUnit, cast into integer with time() so we can use ===, inrange, indexOf to compare values directly.
        // TODO: We calculate timeUnit on the fly here. Consider if we would like to consolidate this with timeUnit pipeline
        // TODO: support utc
        ('time(' + timeunit_1.fieldExpr(filter.timeUnit, filter.field) + ')') :
        fielddef_1.field(filter, { expr: 'datum' });
    if (isEqualFilter(filter)) {
        return fieldExpr + '===' + valueExpr(filter.equal, filter.timeUnit);
    }
    else if (isOneOfFilter(filter)) {
        // "oneOf" was formerly "in" -- so we need to add backward compatibility
        var oneOf = filter.oneOf || filter['in'];
        return 'indexof([' +
            oneOf.map(function (v) { return valueExpr(v, filter.timeUnit); }).join(',') +
            '], ' + fieldExpr + ') !== -1';
    }
    else if (isRangeFilter(filter)) {
        var lower = filter.range[0];
        var upper = filter.range[1];
        if (lower !== null && upper !== null && useInRange) {
            return 'inrange(' + fieldExpr + ', [' +
                valueExpr(lower, filter.timeUnit) + ', ' +
                valueExpr(upper, filter.timeUnit) + '])';
        }
        var exprs = [];
        if (lower !== null) {
            exprs.push(fieldExpr + " >= " + valueExpr(lower, filter.timeUnit));
        }
        if (upper !== null) {
            exprs.push(fieldExpr + " <= " + valueExpr(upper, filter.timeUnit));
        }
        return exprs.length > 0 ? exprs.join(' && ') : 'true';
    }
    /* istanbul ignore next: it should never reach here */
    throw new Error("Invalid field filter: " + JSON.stringify(filter));
}
exports.fieldFilterExpression = fieldFilterExpression;
function valueExpr(v, timeUnit) {
    if (datetime_1.isDateTime(v)) {
        var expr = datetime_1.dateTimeExpr(v, true);
        return 'time(' + expr + ')';
    }
    if (timeunit_1.isLocalSingleTimeUnit(timeUnit)) {
        var datetime = {};
        datetime[timeUnit] = v;
        var expr = datetime_1.dateTimeExpr(datetime, true);
        return 'time(' + expr + ')';
    }
    else if (timeunit_1.isUtcSingleTimeUnit(timeUnit)) {
        return valueExpr(v, timeunit_1.getLocalTimeUnit(timeUnit));
    }
    return JSON.stringify(v);
}
function normalizeFilter(f) {
    if (isFieldFilter(f) && f.timeUnit) {
        return __assign({}, f, { timeUnit: timeunit_1.normalizeTimeUnit(f.timeUnit) });
    }
    return f;
}
exports.normalizeFilter = normalizeFilter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2ZpbHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUEsMkRBQXdEO0FBQ3hELHVDQUE4RDtBQUM5RCx1Q0FBaUM7QUFFakMsdUNBQXFKO0FBQ3JKLCtCQUFzRDtBQWtCdEQsMkJBQWtDLE1BQThCO0lBQzlELE1BQU0sQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFGRCw4Q0FFQztBQXNCRCx1QkFBOEIsTUFBVztJQUN2QyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEtBQUcsU0FBUyxDQUFDO0FBQzlELENBQUM7QUFGRCxzQ0FFQztBQXlCRCx1QkFBOEIsTUFBVztJQUN2QyxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDM0IsRUFBRSxDQUFDLENBQUMsY0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZELE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO0lBQ0gsQ0FBQztJQUNELE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDZixDQUFDO0FBUEQsc0NBT0M7QUF1QkQsdUJBQThCLE1BQVc7SUFDdkMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxDQUNqQyxjQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNyQixjQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLHlCQUF5QjtLQUM3QyxDQUFDO0FBQ0osQ0FBQztBQUxELHNDQUtDO0FBRUQsdUJBQThCLE1BQWM7SUFDMUMsTUFBTSxDQUFDLGFB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Ryx1QkFBWSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMxQyxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxHQUFHLENBQUM7SUFDOUIsQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyw4QkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDekMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsMkJBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDM0IsQ0FBQztBQUVELHlCQUFnQyxDQUFTO0lBQ3ZDLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNuQyxNQUFNLGNBQ0QsQ0FBQyxJQUNKLFFBQVEsRUFBRSw0QkFBaUIsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLElBQ3ZDO0lBQ0osQ0FBQztJQUNELE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBUkQsMENBUUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0RhdGFGbG93Tm9kZX0gZnJvbSAnLi9jb21waWxlL2RhdGEvZGF0YWZsb3cnO1xuaW1wb3J0IHtNb2RlbH0gZnJvbSAnLi9jb21waWxlL21vZGVsJztcbmltcG9ydCB7cHJlZGljYXRlfSBmcm9tICcuL2NvbXBpbGUvc2VsZWN0aW9uL3NlbGVjdGlvbic7XG5pbXBvcnQge0RhdGVUaW1lLCBkYXRlVGltZUV4cHIsIGlzRGF0ZVRpbWV9IGZyb20gJy4vZGF0ZXRpbWUnO1xuaW1wb3J0IHtmaWVsZH0gZnJvbSAnLi9maWVsZGRlZic7XG5pbXBvcnQge0xvZ2ljYWxPcGVyYW5kfSBmcm9tICcuL2xvZ2ljYWwnO1xuaW1wb3J0IHtmaWVsZEV4cHIgYXMgdGltZVVuaXRGaWVsZEV4cHIsIGdldExvY2FsVGltZVVuaXQsIGlzTG9jYWxTaW5nbGVUaW1lVW5pdCwgaXNVdGNTaW5nbGVUaW1lVW5pdCwgbm9ybWFsaXplVGltZVVuaXQsIFRpbWVVbml0fSBmcm9tICcuL3RpbWV1bml0JztcbmltcG9ydCB7aXNBcnJheSwgaXNTdHJpbmcsIGxvZ2ljYWxFeHByfSBmcm9tICcuL3V0aWwnO1xuXG5cbmV4cG9ydCB0eXBlIEZpbHRlciA9XG4gIC8vIEZpZWxkRmlsdGVyIChidXQgd2UgZG9uJ3QgdHlwZSBGaWVsZEZpbHRlciBoZXJlIHNvIHRoZSBzY2hlbWEgaGFzIG5vIG5lc3RpbmdcbiAgLy8gYW5kIHRodXMgdGhlIGRvY3VtZW50YXRpb24gc2hvd3MgYWxsIG9mIHRoZSB0eXBlcyBjbGVhcmx5KVxuICBFcXVhbEZpbHRlciB8IFJhbmdlRmlsdGVyIHwgT25lT2ZGaWx0ZXIgfFxuICBTZWxlY3Rpb25GaWx0ZXIgfCBzdHJpbmc7XG5cbmV4cG9ydCB0eXBlIEZpZWxkRmlsdGVyID0gRXF1YWxGaWx0ZXIgfCBSYW5nZUZpbHRlciB8IE9uZU9mRmlsdGVyO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNlbGVjdGlvbkZpbHRlciB7XG4gIC8qKlxuICAgKiBGaWx0ZXIgdXNpbmcgYSBzZWxlY3Rpb24gbmFtZS5cbiAgICovXG4gIHNlbGVjdGlvbjogTG9naWNhbE9wZXJhbmQ8c3RyaW5nPjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzU2VsZWN0aW9uRmlsdGVyKGZpbHRlcjogTG9naWNhbE9wZXJhbmQ8RmlsdGVyPik6IGZpbHRlciBpcyBTZWxlY3Rpb25GaWx0ZXIge1xuICByZXR1cm4gZmlsdGVyICYmIGZpbHRlclsnc2VsZWN0aW9uJ107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRXF1YWxGaWx0ZXIge1xuICAvLyBUT0RPOiBzdXBwb3J0IGFnZ3JlZ2F0ZVxuXG4gIC8qKlxuICAgKiBUaW1lIHVuaXQgZm9yIHRoZSBmaWVsZCB0byBiZSBmaWx0ZXJlZC5cbiAgICovXG4gIHRpbWVVbml0PzogVGltZVVuaXQ7XG5cbiAgLyoqXG4gICAqIEZpZWxkIHRvIGJlIGZpbHRlcmVkLlxuICAgKi9cbiAgZmllbGQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHZhbHVlIHRoYXQgdGhlIGZpZWxkIHNob3VsZCBiZSBlcXVhbCB0by5cbiAgICovXG4gIGVxdWFsOiBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIHwgRGF0ZVRpbWU7XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRXF1YWxGaWx0ZXIoZmlsdGVyOiBhbnkpOiBmaWx0ZXIgaXMgRXF1YWxGaWx0ZXIge1xuICByZXR1cm4gZmlsdGVyICYmICEhZmlsdGVyLmZpZWxkICYmIGZpbHRlci5lcXVhbCE9PXVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSYW5nZUZpbHRlciB7XG4gIC8vIFRPRE86IHN1cHBvcnQgYWdncmVnYXRlXG5cbiAgLyoqXG4gICAqIHRpbWUgdW5pdCBmb3IgdGhlIGZpZWxkIHRvIGJlIGZpbHRlcmVkLlxuICAgKi9cbiAgdGltZVVuaXQ/OiBUaW1lVW5pdDtcblxuICAvKipcbiAgICogRmllbGQgdG8gYmUgZmlsdGVyZWRcbiAgICovXG4gIGZpZWxkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEFuIGFycmF5IG9mIGluY2x1c2l2ZSBtaW5pbXVtIGFuZCBtYXhpbXVtIHZhbHVlc1xuICAgKiBmb3IgYSBmaWVsZCB2YWx1ZSBvZiBhIGRhdGEgaXRlbSB0byBiZSBpbmNsdWRlZCBpbiB0aGUgZmlsdGVyZWQgZGF0YS5cbiAgICogQG1heEl0ZW1zIDJcbiAgICogQG1pbkl0ZW1zIDJcbiAgICovXG4gIHJhbmdlOiAobnVtYmVyfERhdGVUaW1lKVtdO1xuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1JhbmdlRmlsdGVyKGZpbHRlcjogYW55KTogZmlsdGVyIGlzIFJhbmdlRmlsdGVyIHtcbiAgaWYgKGZpbHRlciAmJiBmaWx0ZXIuZmllbGQpIHtcbiAgICBpZiAoaXNBcnJheShmaWx0ZXIucmFuZ2UpICYmIGZpbHRlci5yYW5nZS5sZW5ndGggPT09IDIpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgT25lT2ZGaWx0ZXIge1xuICAvLyBUT0RPOiBzdXBwb3J0IGFnZ3JlZ2F0ZVxuXG4gIC8qKlxuICAgKiB0aW1lIHVuaXQgZm9yIHRoZSBmaWVsZCB0byBiZSBmaWx0ZXJlZC5cbiAgICovXG4gIHRpbWVVbml0PzogVGltZVVuaXQ7XG5cbiAgLyoqXG4gICAqIEZpZWxkIHRvIGJlIGZpbHRlcmVkXG4gICAqL1xuICBmaWVsZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIHNldCBvZiB2YWx1ZXMgdGhhdCB0aGUgYGZpZWxkYCdzIHZhbHVlIHNob3VsZCBiZSBhIG1lbWJlciBvZixcbiAgICogZm9yIGEgZGF0YSBpdGVtIGluY2x1ZGVkIGluIHRoZSBmaWx0ZXJlZCBkYXRhLlxuICAgKi9cbiAgb25lT2Y6IHN0cmluZ1tdIHwgbnVtYmVyW10gfCBib29sZWFuW10gfCBEYXRlVGltZVtdO1xuXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc09uZU9mRmlsdGVyKGZpbHRlcjogYW55KTogZmlsdGVyIGlzIE9uZU9mRmlsdGVyIHtcbiAgcmV0dXJuIGZpbHRlciAmJiAhIWZpbHRlci5maWVsZCAmJiAoXG4gICAgaXNBcnJheShmaWx0ZXIub25lT2YpIHx8XG4gICAgaXNBcnJheShmaWx0ZXIuaW4pIC8vIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzRmllbGRGaWx0ZXIoZmlsdGVyOiBGaWx0ZXIpOiBmaWx0ZXIgaXMgT25lT2ZGaWx0ZXIgfCBFcXVhbEZpbHRlciB8IFJhbmdlRmlsdGVyIHtcbiAgcmV0dXJuIGlzT25lT2ZGaWx0ZXIoZmlsdGVyKSB8fCBpc0VxdWFsRmlsdGVyKGZpbHRlcikgfHwgaXNSYW5nZUZpbHRlcihmaWx0ZXIpO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGEgZmlsdGVyIGludG8gYW4gZXhwcmVzc2lvbi5cbiAqL1xuLy8gbW9kZWwgaXMgb25seSB1c2VkIGZvciBzZWxlY3Rpb24gZmlsdGVycy5cbmV4cG9ydCBmdW5jdGlvbiBleHByZXNzaW9uKG1vZGVsOiBNb2RlbCwgZmlsdGVyT3A6IExvZ2ljYWxPcGVyYW5kPEZpbHRlcj4sIG5vZGU/OiBEYXRhRmxvd05vZGUpOiBzdHJpbmcge1xuICByZXR1cm4gbG9naWNhbEV4cHIoZmlsdGVyT3AsIChmaWx0ZXI6IEZpbHRlcikgPT4ge1xuICAgIGlmIChpc1N0cmluZyhmaWx0ZXIpKSB7XG4gICAgICByZXR1cm4gZmlsdGVyO1xuICAgIH0gZWxzZSBpZiAoaXNTZWxlY3Rpb25GaWx0ZXIoZmlsdGVyKSkge1xuICAgICAgcmV0dXJuIHByZWRpY2F0ZShtb2RlbCwgZmlsdGVyLnNlbGVjdGlvbiwgbm9kZSk7XG4gICAgfSBlbHNlIHsgLy8gRmlsdGVyIE9iamVjdFxuICAgICAgcmV0dXJuIGZpZWxkRmlsdGVyRXhwcmVzc2lvbihmaWx0ZXIpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8vIFRoaXMgbWV0aG9kIGlzIHVzZWQgYnkgVm95YWdlci4gIERvIG5vdCBjaGFuZ2UgaXRzIGJlaGF2aW9yIHdpdGhvdXQgY2hhbmdpbmcgVm95YWdlci5cbmV4cG9ydCBmdW5jdGlvbiBmaWVsZEZpbHRlckV4cHJlc3Npb24oZmlsdGVyOiBGaWVsZEZpbHRlciwgdXNlSW5SYW5nZT10cnVlKSB7XG4gIGNvbnN0IGZpZWxkRXhwciA9IGZpbHRlci50aW1lVW5pdCA/XG4gICAgLy8gRm9yIHRpbWVVbml0LCBjYXN0IGludG8gaW50ZWdlciB3aXRoIHRpbWUoKSBzbyB3ZSBjYW4gdXNlID09PSwgaW5yYW5nZSwgaW5kZXhPZiB0byBjb21wYXJlIHZhbHVlcyBkaXJlY3RseS5cbiAgICAgIC8vIFRPRE86IFdlIGNhbGN1bGF0ZSB0aW1lVW5pdCBvbiB0aGUgZmx5IGhlcmUuIENvbnNpZGVyIGlmIHdlIHdvdWxkIGxpa2UgdG8gY29uc29saWRhdGUgdGhpcyB3aXRoIHRpbWVVbml0IHBpcGVsaW5lXG4gICAgICAvLyBUT0RPOiBzdXBwb3J0IHV0Y1xuICAgICgndGltZSgnICsgdGltZVVuaXRGaWVsZEV4cHIoZmlsdGVyLnRpbWVVbml0LCBmaWx0ZXIuZmllbGQpICsgJyknKSA6XG4gICAgZmllbGQoZmlsdGVyLCB7ZXhwcjogJ2RhdHVtJ30pO1xuXG4gIGlmIChpc0VxdWFsRmlsdGVyKGZpbHRlcikpIHtcbiAgICByZXR1cm4gZmllbGRFeHByICsgJz09PScgKyB2YWx1ZUV4cHIoZmlsdGVyLmVxdWFsLCBmaWx0ZXIudGltZVVuaXQpO1xuICB9IGVsc2UgaWYgKGlzT25lT2ZGaWx0ZXIoZmlsdGVyKSkge1xuICAgIC8vIFwib25lT2ZcIiB3YXMgZm9ybWVybHkgXCJpblwiIC0tIHNvIHdlIG5lZWQgdG8gYWRkIGJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbiAgICBjb25zdCBvbmVPZjogT25lT2ZGaWx0ZXJbXSA9IGZpbHRlci5vbmVPZiB8fCBmaWx0ZXJbJ2luJ107XG4gICAgcmV0dXJuICdpbmRleG9mKFsnICtcbiAgICAgIG9uZU9mLm1hcCgodikgPT4gdmFsdWVFeHByKHYsIGZpbHRlci50aW1lVW5pdCkpLmpvaW4oJywnKSArXG4gICAgICAnXSwgJyArIGZpZWxkRXhwciArICcpICE9PSAtMSc7XG4gIH0gZWxzZSBpZiAoaXNSYW5nZUZpbHRlcihmaWx0ZXIpKSB7XG4gICAgY29uc3QgbG93ZXIgPSBmaWx0ZXIucmFuZ2VbMF07XG4gICAgY29uc3QgdXBwZXIgPSBmaWx0ZXIucmFuZ2VbMV07XG5cbiAgICBpZiAobG93ZXIgIT09IG51bGwgJiYgdXBwZXIgIT09IG51bGwgJiYgdXNlSW5SYW5nZSkge1xuICAgICAgcmV0dXJuICdpbnJhbmdlKCcgKyBmaWVsZEV4cHIgKyAnLCBbJyArXG4gICAgICAgIHZhbHVlRXhwcihsb3dlciwgZmlsdGVyLnRpbWVVbml0KSArICcsICcgK1xuICAgICAgICB2YWx1ZUV4cHIodXBwZXIsIGZpbHRlci50aW1lVW5pdCkgKyAnXSknO1xuICAgIH1cblxuICAgIGNvbnN0IGV4cHJzID0gW107XG4gICAgaWYgKGxvd2VyICE9PSBudWxsKSB7XG4gICAgICBleHBycy5wdXNoKGAke2ZpZWxkRXhwcn0gPj0gJHt2YWx1ZUV4cHIobG93ZXIsIGZpbHRlci50aW1lVW5pdCl9YCk7XG4gICAgfVxuICAgIGlmICh1cHBlciAhPT0gbnVsbCkge1xuICAgICAgZXhwcnMucHVzaChgJHtmaWVsZEV4cHJ9IDw9ICR7dmFsdWVFeHByKHVwcGVyLCBmaWx0ZXIudGltZVVuaXQpfWApO1xuICAgIH1cblxuICAgIHJldHVybiBleHBycy5sZW5ndGggPiAwID8gZXhwcnMuam9pbignICYmICcpIDogJ3RydWUnO1xuICB9XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQ6IGl0IHNob3VsZCBuZXZlciByZWFjaCBoZXJlICovXG4gIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBmaWVsZCBmaWx0ZXI6ICR7SlNPTi5zdHJpbmdpZnkoZmlsdGVyKX1gKTtcbn1cblxuZnVuY3Rpb24gdmFsdWVFeHByKHY6IGFueSwgdGltZVVuaXQ6IFRpbWVVbml0KTogc3RyaW5nIHtcbiAgaWYgKGlzRGF0ZVRpbWUodikpIHtcbiAgICBjb25zdCBleHByID0gZGF0ZVRpbWVFeHByKHYsIHRydWUpO1xuICAgIHJldHVybiAndGltZSgnICsgZXhwciArICcpJztcbiAgfVxuICBpZiAoaXNMb2NhbFNpbmdsZVRpbWVVbml0KHRpbWVVbml0KSkge1xuICAgIGNvbnN0IGRhdGV0aW1lOiBEYXRlVGltZSA9IHt9O1xuICAgIGRhdGV0aW1lW3RpbWVVbml0XSA9IHY7XG4gICAgY29uc3QgZXhwciA9IGRhdGVUaW1lRXhwcihkYXRldGltZSwgdHJ1ZSk7XG4gICAgcmV0dXJuICd0aW1lKCcgKyBleHByICsgJyknO1xuICB9IGVsc2UgaWYgKGlzVXRjU2luZ2xlVGltZVVuaXQodGltZVVuaXQpKSB7XG4gICAgcmV0dXJuIHZhbHVlRXhwcih2LCBnZXRMb2NhbFRpbWVVbml0KHRpbWVVbml0KSk7XG4gIH1cbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHYpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplRmlsdGVyKGY6IEZpbHRlcik6IEZpbHRlciB7XG4gIGlmIChpc0ZpZWxkRmlsdGVyKGYpICYmIGYudGltZVVuaXQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uZixcbiAgICAgIHRpbWVVbml0OiBub3JtYWxpemVUaW1lVW5pdChmLnRpbWVVbml0KVxuICAgIH07XG4gIH1cbiAgcmV0dXJuIGY7XG59XG4iXX0=